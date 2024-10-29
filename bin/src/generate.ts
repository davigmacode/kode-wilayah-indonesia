import { dirname, join as pathJoin } from 'path';
import { createReadStream, existsSync, mkdirSync, writeFile } from 'fs';
import { parseStream } from 'fast-csv';
import {
  DATA_FILE, STATIC_PATH, FIELD_CODE, FIELD_NAME,
  PROVINCES_CODE_LENGTH, REGENCIES_CODE_LENGTH,
  DISTRICTS_CODE_LENGTH, VILLAGES_CODE_LENGTH
} from './config';

async function getData(): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const result: string[][] = [];
    const stream = createReadStream(DATA_FILE);
    parseStream(stream, { headers: true })
      .on('error', error => reject(error))
      .on('data', row => {
        const c: string = row[FIELD_CODE];
        const n: string = row[FIELD_NAME];
        result.push([c, n]);
      })
      .on('end', () => resolve(result));
  });
}

async function saveData(filename: string, data: unknown) {
  return new Promise((resolve, reject) => {
    const filepath = pathJoin(process.cwd(), STATIC_PATH, filename);
    const dir = dirname(filepath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFile(filepath, JSON.stringify(data), (err) => {
      if (!err) resolve(filepath);
      else reject(err);
    });
  });
}

function log(message: string){
  const timestamp = new Date().toISOString().substring(11,23);
  console.log(`[${timestamp}] - ${message}`);
}

async function main() {
  log('Generating kode wilayah..');
  log('Preparing data source..');
  const source = await getData();
  const provinces = source.filter((e) => e[0].length == PROVINCES_CODE_LENGTH);
  const regencies = source.filter((e) => e[0].length == REGENCIES_CODE_LENGTH);
  const districts = source.filter((e) => e[0].length == DISTRICTS_CODE_LENGTH);
  const villages = source.filter((e) => e[0].length == VILLAGES_CODE_LENGTH);

  log('Generating static provincies..');
  await saveData('/provinces.json', provinces);

  log('Generating static regencies..');
  const saveRegencies = provinces.map((p) => {
    const data = regencies.filter((r) => r[0].startsWith(p[0]));
    return saveData(`/regencies/${p[0]}.json`, data);
  });
  await Promise.allSettled(saveRegencies);

  log('Generating static districts..');
  const saveDistricts = regencies.map((r) => {
    const data = districts.filter((d) => d[0].startsWith(r[0]));
    return saveData(`/districts/${r[0]}.json`, data);
  });
  await Promise.allSettled(saveDistricts);

  log('Generating static villages..');
  const saveVillages = districts.map((d) => {
    const data = villages.filter((v) => v[0].startsWith(d[0]));
    return saveData(`/villages/${d[0]}.json`, data);
  });
  await Promise.allSettled(saveVillages);

  log('Mapping data source..');
  const sourceMap = new Map<string, string[]>();
  source.forEach((e) => sourceMap.set(e[0], e));

  // populating db entries
  const dbEntries: string[][] = [];
  provinces.forEach((e) => {
    dbEntries.push([e[0], e[1], '1']);
  });

  log('Generating static regencies trace..');
  const saveRegenciesTrace = regencies.map((e) => {
    const c: string = e[0];
    const data = {
      province: sourceMap.get(c.substring(0, PROVINCES_CODE_LENGTH)),
      regency: e,
    };
    const name = [
      data.province?.at(1),
      data.regency?.at(1),
    ].join(', ');
    dbEntries.push([c, name, '2']);
    return saveData(`/trace/${c}.json`, data);
  });
  await Promise.allSettled(saveRegenciesTrace);

  log('Generating static districts trace..');
  const saveDistricsTrace = districts.map((e) => {
    const c: string = e[0];
    const data = {
      province: sourceMap.get(c.substring(0, PROVINCES_CODE_LENGTH)),
      regency: sourceMap.get(c.substring(0, REGENCIES_CODE_LENGTH)),
      district: e,
    };
    const name = [
      data.province?.at(1),
      data.regency?.at(1),
      data.district?.at(1),
    ].join(', ');
    dbEntries.push([c, name, '3']);
    return saveData(`/trace/${c}.json`, data);
  });
  await Promise.allSettled(saveDistricsTrace);

  log('Generating static villages trace..');
  const saveVillagesTrace = villages.map((e) => {
    const c: string = e[0];
    const data = {
      province: sourceMap.get(c.substring(0, PROVINCES_CODE_LENGTH)),
      regency: sourceMap.get(c.substring(0, REGENCIES_CODE_LENGTH)),
      district: sourceMap.get(c.substring(0, DISTRICTS_CODE_LENGTH)),
      village: e,
    };
    const name = [
      data.province?.at(1),
      data.regency?.at(1),
      data.district?.at(1),
      data.village?.at(1),
    ].join(', ');
    dbEntries.push([c, name, '4']);
    return saveData(`/trace/${c}.json`, data);
  });
  await Promise.allSettled(saveVillagesTrace);

  log('Writing into database..');
  await saveData('/regions.json', dbEntries);
}

main().then(() => log('Done.'));
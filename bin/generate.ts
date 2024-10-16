import { dirname, resolve as pathResolve, join as pathJoin } from 'path';
import { createReadStream, existsSync, mkdirSync, writeFile } from 'fs';
import { parseStream } from 'fast-csv';

const DATA_PATH = pathResolve(__dirname, '../data');
const DATA_FILE = process.env.DATA_FILE || 'kode-wilayah.csv';
const DATA_CODE = process.env.DATA_HEADER_CODE || 'kode';
const DATA_NAME = process.env.DATA_HEADER_NAME || 'nama';

const CODE_SEPARATOR = process.env.DATA_CODE_SEPARATOR || '';
const CODE_SEGMENT = {
  provinces: [2],
  regencies: [2, 2],
  districts: [2, 2, 2],
  villages: [2, 2, 2, 4],
};

type Resource = keyof typeof CODE_SEGMENT;

function getCodeLength(resource: Resource): number {
  const segment = CODE_SEGMENT[resource];
  const separator = CODE_SEPARATOR.length * (segment.length > 1 ? segment.length - 1 : 0);
  return segment.reduce((a, b) => a + b) + separator;
}

const PROVINCES_CODE_LENGTH = getCodeLength('provinces');
const REGENCIES_CODE_LENGTH = getCodeLength('regencies');
const DISTRICTS_CODE_LENGTH = getCodeLength('districts');
const VILLAGES_CODE_LENGTH = getCodeLength('villages');

async function getData(): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const result: string[][] = [];
    const filepath = pathJoin(DATA_PATH, DATA_FILE);
    const stream = createReadStream(filepath);
    parseStream(stream, { headers: true })
      .on('error', error => reject(error))
      .on('data', row => {
        const c: string = row[DATA_CODE];
        const n: string = row[DATA_NAME];
        result.push([c, n]);
      })
      .on('end', () => resolve(result));
  });
}

async function saveData(filepath: string, data: unknown) {
  return new Promise((resolve, reject) => {
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

  log('Writing provincies..');
  await saveData('./public/provinces.json', provinces);

  log('Writing regencies..');
  const saveRegencies = provinces.map((p) => {
    const data = regencies.filter((r) => r[0].startsWith(p[0]));
    return saveData(`./public/regencies/${p[0]}.json`, data);
  });
  await Promise.allSettled(saveRegencies);

  log('Writing districts..');
  const saveDistricts = regencies.map((r) => {
    const data = districts.filter((d) => d[0].startsWith(r[0]));
    return saveData(`./public/districts/${r[0]}.json`, data);
  });
  await Promise.allSettled(saveDistricts);

  log('Writing villages..');
  const saveVillages = districts.map((d) => {
    const data = villages.filter((v) => v[0].startsWith(d[0]));
    return saveData(`./public/villages/${d[0]}.json`, data);
  });
  await Promise.allSettled(saveVillages);

  log('Mapping data source..');
  const sourcemap = new Map();
  source.forEach((e) => sourcemap.set(e[0], e));

  log('Writing trace..');
  const saveTrace = villages.map((v) => {
    const c: string = v[0];
    const data = {
      province: sourcemap.get(c.substring(0, PROVINCES_CODE_LENGTH)),
      regency: sourcemap.get(c.substring(0, REGENCIES_CODE_LENGTH)),
      district: sourcemap.get(c.substring(0, DISTRICTS_CODE_LENGTH)),
      village: v,
    };
    return saveData(`./public/trace/${c}.json`, data);
  });
  await Promise.allSettled(saveTrace);
}

main().then(() => log('Done.'));
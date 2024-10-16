import { createReadStream } from 'fs';
import { parseStream } from 'fast-csv';

const DATA_PATH = './data/kode-wilayah-permen-2022.csv';
const DATA_CODE = 'kode';
const DATA_NAME = 'nama';

const CODE_SEGMENT = {
  provinces: [2],
  regencies: [2, 2],
  districts: [2, 2, 2],
  villages: [2, 2, 2, 4],
};

type Resource = keyof typeof CODE_SEGMENT;

interface Context {
  params: Params;
}

interface Params {
  segment: [Resource, string?]
}

function getCodeLength(resource: Resource): number {
  const segment = CODE_SEGMENT[resource];
  const separator = segment.length - 1;
  return segment.reduce((a, b) => a + b) + separator;
}

async function getEntries(resource: Resource, prefix?: string) {
  return new Promise((resolve, reject) => {
    const codeLength = getCodeLength(resource);
    const result: string[][] = [];
    const stream = createReadStream(DATA_PATH);
    parseStream(stream, { headers: true })
      .on('error', error => reject(error))
      .on('data', row => {
        const c: string = row[DATA_CODE];
        const n: string = row[DATA_NAME];
        if (resource == 'provinces') {
          if (c.length == 2) result.push([c, n]);
        } else {
          const isMatchLength = c.length == codeLength;
          const isMatchPrefix = prefix != undefined && c.startsWith(prefix)
          if (isMatchPrefix && isMatchLength) result.push([c, n]);
        }
      })
      .on('end', () => resolve(result));
  });
}

export async function GET(_: Request, { params }: Context) {
  const [resource, prefix] = params.segment;
  const data = await getEntries(resource, prefix);
  return Response.json(data);
}
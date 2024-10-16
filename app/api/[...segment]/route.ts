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

type Endpoint = Resource | 'trace';

interface Context {
  params: Params;
}

interface Params {
  segment: [Endpoint, string?]
}

function getCodeLength(resource: Resource): number {
  const segment = CODE_SEGMENT[resource];
  const separator = segment.length > 1 ? segment.length - 1 : 0;
  return segment.reduce((a, b) => a + b) + separator;
}

async function getEntries(resource: Resource, prefix?: string): Promise<string[][]> {
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

async function getInfo(code: string) {
  return new Promise((resolve, reject) => {
    let result: Record<string, string[] | undefined> = {};
    const tracer = [
      ['province', 'provinces'],
      ['regency', 'regencies'],
      ['district', 'districts'],
      ['village', 'villages'],
    ];
    const stream = createReadStream(DATA_PATH);
    parseStream(stream, { headers: true })
      .on('error', error => reject(error))
      .on('data', row => {
        const c: string = row[DATA_CODE];
        const n: string = row[DATA_NAME];
        for (let i = 0; i < tracer.length; i++) {
          const t = tracer[i];
          const r = t[1] as Resource;
          const k = t[0];
          const len = getCodeLength(r);
          if (c.length == len && c == code.substring(0, len)) {
            result = { ...result, [k]: [c, n] };
          }
        }
      })
      .on('end', () => resolve(result));
  });
}

export async function GET(_: Request, { params }: Context) {
  let data: unknown;
  const [endpoint, code] = params.segment;
  if (endpoint == 'trace') {
    data = code != undefined ? await getInfo(code) : {};
  } else {
    data = await getEntries(endpoint, code);
  }
  return Response.json(data);
}
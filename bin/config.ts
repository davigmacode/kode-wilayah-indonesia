import path from 'path';

export const STATIC_PATH = process.env.STATIC_PATH || '/public';

export const DATA_PATH = process.env.SOURCE_PATH || '/data';
export const DATA_FILE_NAME = process.env.SOURCE_FILE || 'kode-wilayah.csv';
export const DATA_FILE = path.join(process.cwd(), DATA_PATH, DATA_FILE_NAME);

export const FIELD_CODE = process.env.FIELD_CODE || 'kode';
export const FIELD_NAME = process.env.FIELD_NAME || 'nama';

export const CODE_SEPARATOR = process.env.CODE_SEPARATOR || '';
export const CODE_SEGMENT = {
  provinces: [2],
  regencies: [2, 2],
  districts: [2, 2, 2],
  villages: [2, 2, 2, 4],
};

export type Resource = keyof typeof CODE_SEGMENT;

function getCodeLength(resource: Resource): number {
  const segment = CODE_SEGMENT[resource];
  const separator = CODE_SEPARATOR.length * (segment.length > 1 ? segment.length - 1 : 0);
  return segment.reduce((a, b) => a + b) + separator;
}

export const PROVINCES_CODE_LENGTH = getCodeLength('provinces');
export const REGENCIES_CODE_LENGTH = getCodeLength('regencies');
export const DISTRICTS_CODE_LENGTH = getCodeLength('districts');
export const VILLAGES_CODE_LENGTH = getCodeLength('villages');

// export const DB_PATH = path.resolve(__dirname, '../', process.env.DB_PATH || './app/db');
export const DB_PATH = process.env.DB_PATH || 'app/db';
export const DB_NAME = process.env.DB_NAME || 'regions.db';
export const DB_FILE = path.join(process.cwd(), DB_PATH, DB_NAME);

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const db = new Database(':memory:');
db.pragma('journal_mode = WAL');

// Create tables and indexes if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS wilayah (code TEXT PRIMARY KEY, name TEXT, fullname TEXT);
  CREATE INDEX IF NOT EXISTS idx_name ON wilayah (name);
  CREATE INDEX IF NOT EXISTS idx_fullname ON wilayah (fullname);
`);

export const insertOne = db.prepare('INSERT INTO wilayah (code, name, fullname) VALUES (?, ?, ?)');

export const insertMany = db.transaction((items: Wilayah[]) => {
  for (const item of items) {
    insertOne.run(item.code, item.name, item.fullname);
  }
});

// Read the JSON file and parse it
const jsonPath = process.env.STATIC_PATH || '/public';
const jsonFile = path.join(process.cwd(), jsonPath, 'regions.json');
const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
insertMany(jsonData);

interface SearchByFullnameProps {
  query: string;
  limit?: number;
  skip?: number;
}

export const searchByFullname = db.transaction(({ query, limit = 25, skip = 0 }: SearchByFullnameProps) => {
  const entries = db.prepare(`
    SELECT * FROM wilayah
    WHERE fullname LIKE ?
    LIMIT ? OFFSET ?
  `).all(`%${query}%`, limit, skip);

  const total = db.prepare(`
    SELECT COUNT(*) AS count FROM wilayah
    WHERE fullname LIKE ?
  `).get(`%${query}%`) as { count: number };

  return { entries, skip, limit, count: total.count };
});

export interface Wilayah {
  code: string;
  name: string;
  fullname: string;
}
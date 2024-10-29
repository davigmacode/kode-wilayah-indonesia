import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const REGION_LEVEL = {
  'provinces': 1,
  'regencies': 2,
  'districts': 3,
  'villages': 4,
}

type RegionKey = keyof typeof REGION_LEVEL;

function isValidRegion(k: string): k is RegionKey {
  return k in REGION_LEVEL;
}

const db = new Database(':memory:');
db.pragma('journal_mode = WAL');

// Create tables and indexes if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS regions (code TEXT PRIMARY KEY, name TEXT, level INTEGER);
  CREATE INDEX IF NOT EXISTS idx_name ON regions (name);
  CREATE INDEX IF NOT EXISTS idx_level ON regions (level);
`);

export const insertOne = db.prepare('INSERT INTO regions (code, name, level) VALUES (?, ?, ?)');

export const insertMany = db.transaction((items: string[][]) => {
  for (const item of items) {
    insertOne.run(item[0], item[1], Number(item[2]));
  }
});

// Read the JSON file and parse it
const jsonPath = process.env.STATIC_PATH || '/public';
const jsonFile = path.join(process.cwd(), jsonPath, 'regions.json');
const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
insertMany(jsonData);

interface SearchByFullnameProps {
  type: string;
  query: string;
  limit: number;
  skip: number;
}

export const searchByFullname = db.transaction(({
  type,
  query,
  limit,
  skip
}: SearchByFullnameProps) => {
  const level = isValidRegion(type) ? REGION_LEVEL[type] : -1;
  const whereLevel = level != -1 ? `AND level==${level}` : '';

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const entries = db.prepare(`
    SELECT code, name FROM regions
    WHERE name LIKE ? ${whereLevel}
    LIMIT ? OFFSET ?
  `).all(`%${query}%`, limit, skip).map((e: any) => [e.code, e.name]);

  if (limit == -1) return entries;

  const total = db.prepare(`
    SELECT COUNT(*) AS count FROM regions
    WHERE name LIKE ? ${whereLevel}
  `).get(`%${query}%`) as { count: number };

  return { entries, skip, limit, count: total.count };
});
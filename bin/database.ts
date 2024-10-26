import Database from 'better-sqlite3';
import { DB_FILE } from './config';

const db = new Database(DB_FILE);
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

export interface Wilayah {
  code: string;
  name: string;
  fullname: string;
}

export default db;
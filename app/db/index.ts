import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DB_PATH || 'app/db';
const dbName = process.env.DB_NAME || 'regions.db';
const dbFile = path.join(process.cwd(), dbPath, dbName);
const db = new Database(dbFile, { fileMustExist: true });
db.pragma('journal_mode = WAL');

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

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Check if we are in production or dev to determine DB path
const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'sqlite.db');

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

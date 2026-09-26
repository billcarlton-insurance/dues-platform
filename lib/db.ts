import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dues.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS body (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    body_type TEXT NOT NULL,
    member_cap INTEGER,
    dues_amount REAL NOT NULL DEFAULT 0,
    dues_cadence TEXT NOT NULL DEFAULT 'annual'
  );

  CREATE TABLE IF NOT EXISTS person (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    mailing_address TEXT
  );

  CREATE TABLE IF NOT EXISTS membership (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER NOT NULL REFERENCES person(id),
    body_id INTEGER NOT NULL REFERENCES body(id),
    status TEXT NOT NULL DEFAULT 'active', -- active, inactive, deceased, life, emeritus
    joined_date TEXT
  );

  CREATE TABLE IF NOT EXISTS dues_cycle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    body_id INTEGER NOT NULL REFERENCES body(id),
    year INTEGER NOT NULL,
    amount REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS payment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    membership_id INTEGER NOT NULL REFERENCES membership(id),
    dues_cycle_id INTEGER NOT NULL REFERENCES dues_cycle(id),
    amount REAL NOT NULL,
    method TEXT NOT NULL DEFAULT 'manual', -- manual, ach, card, check
    paid_date TEXT NOT NULL DEFAULT (date('now'))
  );
`);

export default db;

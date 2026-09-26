import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});

let initialized = false;

export async function ensureSchema() {
  if (initialized) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS body (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      body_type TEXT NOT NULL,
      member_cap INTEGER,
      dues_amount NUMERIC NOT NULL DEFAULT 0,
      dues_cadence TEXT NOT NULL DEFAULT 'annual'
    );

    CREATE TABLE IF NOT EXISTS person (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      mailing_address TEXT
    );

    CREATE TABLE IF NOT EXISTS membership (
      id SERIAL PRIMARY KEY,
      person_id INTEGER NOT NULL REFERENCES person(id),
      body_id INTEGER NOT NULL REFERENCES body(id),
      status TEXT NOT NULL DEFAULT 'active',
      joined_date TEXT
    );

    CREATE TABLE IF NOT EXISTS dues_cycle (
      id SERIAL PRIMARY KEY,
      body_id INTEGER NOT NULL REFERENCES body(id),
      year INTEGER NOT NULL,
      amount NUMERIC NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payment (
      id SERIAL PRIMARY KEY,
      membership_id INTEGER NOT NULL REFERENCES membership(id),
      dues_cycle_id INTEGER NOT NULL REFERENCES dues_cycle(id),
      amount NUMERIC NOT NULL,
      method TEXT NOT NULL DEFAULT 'manual',
      paid_date DATE NOT NULL DEFAULT CURRENT_DATE
    );
  `);
  initialized = true;
}

export default pool;

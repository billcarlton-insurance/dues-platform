import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import pool, { ensureSchema } from '@/lib/db';

export async function POST(req: NextRequest) {
  await ensureSchema();
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const bodyId = formData.get('body_id') as string | null;

  if (!file || !bodyId) {
    return NextResponse.json(
      { error: 'file and body_id are required' },
      { status: 400 }
    );
  }

  const text = await file.text();
  const records: Array<Record<string, string>> = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const client = await pool.connect();
  let imported = 0;
  try {
    await client.query('BEGIN');
    for (const row of records) {
      if (!row.full_name) continue;
      const personResult = await client.query(
        `INSERT INTO person (full_name, email, phone, mailing_address)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [row.full_name, row.email || null, row.phone || null, row.mailing_address || null]
      );
      await client.query(
        `INSERT INTO membership (person_id, body_id, status, joined_date)
         VALUES ($1, $2, 'active', $3)`,
        [personResult.rows[0].id, bodyId, row.joined_date || null]
      );
      imported++;
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return NextResponse.json({ imported });
}

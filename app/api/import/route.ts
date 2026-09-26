import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import pool, { ensureSchema } from '@/lib/db';

// Normalizes a header like "Full Name" or "MAILING ADDRESS" to "full_name" /
// "mailing_address" so exports from Masonic Solutions, Google Sheets, Excel,
// etc. all work without the secretary having to rename columns.
function normalizeKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, '_');
}

// Maps a "Member Type" column value to our status field.
function mapStatus(memberType: string | undefined): string {
  const t = (memberType || '').trim().toLowerCase();
  if (t === 'life') return 'life';
  if (t === 'emeritus') return 'emeritus';
  if (t === 'deceased') return 'deceased';
  if (t === 'inactive' || t === 'suspended') return 'inactive';
  // "Regular", "50-year" (not yet dues-free), or anything unrecognized
  // defaults to active.
  return 'active';
}

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
  const rawRecords: Array<Record<string, string>> = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });

  // Normalize every row's keys so "Full Name" -> full_name, etc.
  const records = rawRecords.map((row) => {
    const normalized: Record<string, string> = {};
    for (const [key, value] of Object.entries(row)) {
      normalized[normalizeKey(key)] = value;
    }
    return normalized;
  });

  const client = await pool.connect();
  let imported = 0;
  try {
    await client.query('BEGIN');
    for (const row of records) {
      // Accept full_name, or fall back to "name" if that's what the sheet used.
      const fullName = row.full_name || row.name;
      if (!fullName) continue;

      const status = mapStatus(row.member_type || row.status || row.local_status);

      const personResult = await client.query(
        `INSERT INTO person (full_name, email, phone, mailing_address)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [fullName, row.email || null, row.phone || null, row.mailing_address || null]
      );
      await client.query(
        `INSERT INTO membership (person_id, body_id, status, joined_date)
         VALUES ($1, $2, $3, $4)`,
        [personResult.rows[0].id, bodyId, status, row.joined_date || null]
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

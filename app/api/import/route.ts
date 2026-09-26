import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import db from '@/lib/db';

// Expects a CSV with headers: full_name,email,phone,mailing_address
// and a body_id + joined_date to attach every row to.
export async function POST(req: NextRequest) {
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

  const insertPerson = db.prepare(
    `INSERT INTO person (full_name, email, phone, mailing_address) VALUES (?, ?, ?, ?)`
  );
  const insertMembership = db.prepare(
    `INSERT INTO membership (person_id, body_id, status, joined_date) VALUES (?, ?, 'active', ?)`
  );

  const insertAll = db.transaction((rows: typeof records) => {
    let count = 0;
    for (const row of rows) {
      if (!row.full_name) continue;
      const personResult = insertPerson.run(
        row.full_name,
        row.email || null,
        row.phone || null,
        row.mailing_address || null
      );
      insertMembership.run(
        personResult.lastInsertRowid,
        bodyId,
        row.joined_date || null
      );
      count++;
    }
    return count;
  });

  const imported = insertAll(records);

  return NextResponse.json({ imported });
}

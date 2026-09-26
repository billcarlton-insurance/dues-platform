import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const bodies = db.prepare('SELECT * FROM body').all();
  return NextResponse.json(bodies);
}

export async function POST(req: NextRequest) {
  const { name, body_type, dues_amount, dues_cadence, member_cap, year } = await req.json();

  const result = db
    .prepare(
      `INSERT INTO body (name, body_type, dues_amount, dues_cadence, member_cap)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(name, body_type, dues_amount, dues_cadence || 'annual', member_cap || null);

  const bodyId = result.lastInsertRowid;

  // Create the first dues cycle for this body
  db.prepare(
    `INSERT INTO dues_cycle (body_id, year, amount) VALUES (?, ?, ?)`
  ).run(bodyId, year || new Date().getFullYear(), dues_amount);

  return NextResponse.json({ id: bodyId });
}

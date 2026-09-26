import { NextRequest, NextResponse } from 'next/server';
import pool, { ensureSchema } from '@/lib/db';

export async function GET() {
  await ensureSchema();
  const result = await pool.query('SELECT * FROM body ORDER BY id');
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const { name, body_type, dues_amount, dues_cadence, member_cap, year } = await req.json();

  const bodyResult = await pool.query(
    `INSERT INTO body (name, body_type, dues_amount, dues_cadence, member_cap)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [name, body_type, dues_amount, dues_cadence || 'annual', member_cap || null]
  );
  const bodyId = bodyResult.rows[0].id;

  await pool.query(
    `INSERT INTO dues_cycle (body_id, year, amount) VALUES ($1, $2, $3)`,
    [bodyId, year || new Date().getFullYear(), dues_amount]
  );

  return NextResponse.json({ id: bodyId });
}

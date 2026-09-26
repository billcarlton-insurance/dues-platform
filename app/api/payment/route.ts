import { NextRequest, NextResponse } from 'next/server';
import pool, { ensureSchema } from '@/lib/db';

export async function POST(req: NextRequest) {
  await ensureSchema();
  const { membership_id, dues_cycle_id, amount, method } = await req.json();

  if (!membership_id || !dues_cycle_id || !amount) {
    return NextResponse.json(
      { error: 'membership_id, dues_cycle_id, and amount are required' },
      { status: 400 }
    );
  }

  const result = await pool.query(
    `INSERT INTO payment (membership_id, dues_cycle_id, amount, method)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [membership_id, dues_cycle_id, amount, method || 'manual']
  );

  return NextResponse.json({ id: result.rows[0].id });
}

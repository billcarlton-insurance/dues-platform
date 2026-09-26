import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Records a payment for a membership against its body's current dues cycle.
// method is 'manual' for now (check/cash entered by the secretary) —
// this is the slot where Stripe webhook-driven inserts plug in later.
export async function POST(req: NextRequest) {
  const { membership_id, dues_cycle_id, amount, method } = await req.json();

  if (!membership_id || !dues_cycle_id || !amount) {
    return NextResponse.json(
      { error: 'membership_id, dues_cycle_id, and amount are required' },
      { status: 400 }
    );
  }

  const result = db
    .prepare(
      `INSERT INTO payment (membership_id, dues_cycle_id, amount, method) VALUES (?, ?, ?, ?)`
    )
    .run(membership_id, dues_cycle_id, amount, method || 'manual');

  return NextResponse.json({ id: result.lastInsertRowid });
}

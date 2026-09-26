import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  const bodyId = req.nextUrl.searchParams.get('body_id');
  if (!bodyId) {
    return NextResponse.json({ error: 'body_id is required' }, { status: 400 });
  }

  const body = db.prepare('SELECT * FROM body WHERE id = ?').get(bodyId) as
    | { id: number; name: string; dues_amount: number; member_cap: number | null }
    | undefined;

  if (!body) {
    return NextResponse.json({ error: 'body not found' }, { status: 404 });
  }

  // Current dues cycle = most recent year on record for this body
  const cycle = db
    .prepare(
      `SELECT * FROM dues_cycle WHERE body_id = ? ORDER BY year DESC LIMIT 1`
    )
    .get(bodyId) as { id: number; year: number; amount: number } | undefined;

  const members = db
    .prepare(
      `
      SELECT
        m.id as membership_id,
        p.full_name,
        p.email,
        p.phone,
        m.status,
        (
          SELECT COUNT(*) FROM payment
          WHERE payment.membership_id = m.id
          AND payment.dues_cycle_id = ?
        ) as paid_count
      FROM membership m
      JOIN person p ON p.id = m.person_id
      WHERE m.body_id = ?
      ORDER BY p.full_name
    `
    )
    .all(cycle?.id ?? -1, bodyId) as Array<{
    membership_id: number;
    full_name: string;
    email: string | null;
    phone: string | null;
    status: string;
    paid_count: number;
  }>;

  const activeMembers = members.filter((m) => m.status === 'active');
  const paidCount = activeMembers.filter((m) => m.paid_count > 0).length;
  const openSlots = body.member_cap ? body.member_cap - activeMembers.length : null;

  return NextResponse.json({
    body,
    cycle,
    members: members.map((m) => ({ ...m, paid: m.paid_count > 0 })),
    summary: {
      total_active: activeMembers.length,
      paid: paidCount,
      unpaid: activeMembers.length - paidCount,
      open_slots: openSlots,
    },
  });
}

import { NextRequest, NextResponse } from 'next/server';
import pool, { ensureSchema } from '@/lib/db';

export async function GET(req: NextRequest) {
  await ensureSchema();
  const bodyId = req.nextUrl.searchParams.get('body_id');
  if (!bodyId) {
    return NextResponse.json({ error: 'body_id is required' }, { status: 400 });
  }

  const bodyResult = await pool.query('SELECT * FROM body WHERE id = $1', [bodyId]);
  const body = bodyResult.rows[0];
  if (!body) {
    return NextResponse.json({ error: 'body not found' }, { status: 404 });
  }

  const cycleResult = await pool.query(
    `SELECT * FROM dues_cycle WHERE body_id = $1 ORDER BY year DESC LIMIT 1`,
    [bodyId]
  );
  const cycle = cycleResult.rows[0];

  const membersResult = await pool.query(
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
        AND payment.dues_cycle_id = $1
      ) as paid_count
    FROM membership m
    JOIN person p ON p.id = m.person_id
    WHERE m.body_id = $2
    ORDER BY p.full_name
    `,
    [cycle?.id ?? -1, bodyId]
  );

  const members = membersResult.rows.map((m) => ({
    ...m,
    paid_count: parseInt(m.paid_count, 10),
    paid: parseInt(m.paid_count, 10) > 0,
  }));

  const activeMembers = members.filter((m) => m.status === 'active');
  const paidCount = activeMembers.filter((m) => m.paid).length;
  const openSlots = body.member_cap ? body.member_cap - activeMembers.length : null;

  return NextResponse.json({
    body,
    cycle,
    members,
    summary: {
      total_active: activeMembers.length,
      paid: paidCount,
      unpaid: activeMembers.length - paidCount,
      open_slots: openSlots,
    },
  });
}

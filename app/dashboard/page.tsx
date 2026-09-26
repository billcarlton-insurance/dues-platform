'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type Member = {
  membership_id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  paid: boolean;
};

type DashboardData = {
  body: { id: number; name: string; dues_amount: number; member_cap: number | null };
  cycle: { id: number; year: number; amount: number };
  members: Member[];
  summary: {
    total_active: number;
    paid: number;
    unpaid: number;
    open_slots: number | null;
  };
};

function Dashboard() {
  const bodyId = useSearchParams().get('body_id');
  const [data, setData] = useState<DashboardData | null>(null);

  const load = useCallback(async () => {
    if (!bodyId) return;
    const res = await fetch(`/api/dashboard?body_id=${bodyId}`);
    setData(await res.json());
  }, [bodyId]);

  useEffect(() => {
    load();
  }, [load]);

  const markPaid = async (membershipId: number) => {
    if (!data) return;
    await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        membership_id: membershipId,
        dues_cycle_id: data.cycle.id,
        amount: data.cycle.amount,
        method: 'manual',
      }),
    });
    load();
  };

  if (!bodyId) return <p className="p-8">Missing body_id in the URL.</p>;
  if (!data) return <p className="p-8">Loading...</p>;

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-semibold">{data.body.name}</h1>
      <p className="text-gray-500">
        {data.cycle.year} dues — ${data.cycle.amount} per member
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Active members</p>
          <p className="text-2xl font-semibold">{data.summary.total_active}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Paid this cycle</p>
          <p className="text-2xl font-semibold text-green-700">
            {data.summary.paid}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Open slots</p>
          <p className="text-2xl font-semibold">
            {data.summary.open_slots ?? '—'}
          </p>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Status</th>
            <th className="py-2">Dues</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {data.members.map((m) => (
            <tr key={m.membership_id} className="border-b">
              <td className="py-2">{m.full_name}</td>
              <td className="py-2 capitalize">{m.status}</td>
              <td className="py-2">
                {m.paid ? (
                  <span className="text-green-700">Paid</span>
                ) : (
                  <span className="text-red-600">Unpaid</span>
                )}
              </td>
              <td className="py-2">
                {!m.paid && (
                  <button
                    className="text-sm underline"
                    onClick={() => markPaid(m.membership_id)}
                  >
                    Mark paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="p-8">Loading...</p>}>
      <Dashboard />
    </Suspense>
  );
}

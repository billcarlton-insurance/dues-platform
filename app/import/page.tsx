'use client';

import { useState, useEffect } from 'react';

type Body = {
  id: number;
  name: string;
  body_type: string;
  dues_amount: number;
  member_count: number;
};

export default function ImportPage() {
  const [bodies, setBodies] = useState<Body[]>([]);
  const [showNewBodyForm, setShowNewBodyForm] = useState(false);
  const [name, setName] = useState('');
  const [bodyType, setBodyType] = useState('Chapter');
  const [duesAmount, setDuesAmount] = useState('75');
  const [message, setMessage] = useState('');
  const [importingBodyId, setImportingBodyId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const loadBodies = async () => {
    const res = await fetch('/api/body');
    setBodies(await res.json());
  };

  useEffect(() => {
    loadBodies();
  }, []);

  const createBody = async () => {
    if (!name.trim()) {
      setMessage('Enter a name for the body first.');
      return;
    }
    await fetch('/api/body', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        body_type: bodyType,
        dues_amount: parseFloat(duesAmount),
      }),
    });
    setMessage(`Created ${name}. It now appears in the list below.`);
    setName('');
    setShowNewBodyForm(false);
    loadBodies();
  };

  const deleteBody = async (id: number, bodyName: string) => {
    if (!confirm(`Delete "${bodyName}" and all its members and payment records? This cannot be undone.`)) {
      return;
    }
    await fetch(`/api/body?id=${id}`, { method: 'DELETE' });
    setMessage(`Deleted ${bodyName}.`);
    loadBodies();
  };

  const importRoster = async (bodyId: number) => {
    if (!file) {
      setMessage('Choose a CSV file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('body_id', String(bodyId));
    const res = await fetch('/api/import', { method: 'POST', body: formData });
    const data = await res.json();
    setMessage(`Imported ${data.imported} members.`);
    setFile(null);
    setImportingBodyId(null);
    loadBodies();
  };

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Your bodies</h1>
        <p className="text-sm text-gray-500 mt-1">
          Already set one up? Click it below to open its dashboard. Setting up
          a body only happens once, ever — after that, always come back here
          and pick it from this list.
        </p>
      </div>

      {bodies.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Nothing set up yet — add your first body below.
        </p>
      )}

      <div className="space-y-3">
        {bodies.map((b) => (
          <div key={b.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <a
                  href={`/dashboard?body_id=${b.id}`}
                  className="font-medium text-blue-700 underline text-lg"
                >
                  {b.name}
                </a>
                <p className="text-sm text-gray-500">
                  {b.body_type} · ${b.dues_amount}/yr · {b.member_count}{' '}
                  {b.member_count === 1 ? 'member' : 'members'}
                </p>
              </div>
              <button
                className="text-sm text-red-600 underline"
                onClick={() => deleteBody(b.id, b.name)}
              >
                Delete
              </button>
            </div>

            {importingBodyId === b.id ? (
              <div className="mt-3 pt-3 border-t space-y-2">
                <p className="text-sm text-gray-500">
                  CSV columns: full_name (or Full Name), email, phone,
                  mailing_address. Member Type (Regular/Life/Emeritus/etc.) is
                  read automatically if present.
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <div className="flex gap-2">
                  <button
                    className="bg-black text-white rounded px-3 py-1 text-sm"
                    onClick={() => importRoster(b.id)}
                  >
                    Import
                  </button>
                  <button
                    className="text-sm underline"
                    onClick={() => {
                      setImportingBodyId(null);
                      setFile(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="text-sm underline mt-2"
                onClick={() => setImportingBodyId(b.id)}
              >
                Import or re-import a roster CSV
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        {showNewBodyForm ? (
          <div className="space-y-3 border rounded-lg p-5">
            <h2 className="font-medium">Set up a brand-new body</h2>
            <p className="text-sm text-gray-500">
              Only use this for a body that isn&apos;t in the list above yet —
              a Chapter, Council, Commandery, or allied body you haven&apos;t
              added before.
            </p>
            <input
              className="border rounded px-3 py-2 w-full"
              placeholder="Body name (e.g. Oak Park Chapter No. 12)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
              className="border rounded px-3 py-2 w-full"
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
            >
              <option>Chapter</option>
              <option>Council</option>
              <option>Commandery</option>
              <option>Allied body</option>
            </select>
            <input
              className="border rounded px-3 py-2 w-full"
              type="number"
              placeholder="Annual dues amount"
              value={duesAmount}
              onChange={(e) => setDuesAmount(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="bg-black text-white rounded px-4 py-2"
                onClick={createBody}
              >
                Create body
              </button>
              <button
                className="text-sm underline"
                onClick={() => setShowNewBodyForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="text-sm underline text-blue-700"
            onClick={() => setShowNewBodyForm(true)}
          >
            + Set up a new body
          </button>
        )}
      </div>

      {message && <p className="text-sm text-green-700">{message}</p>}
    </main>
  );
}

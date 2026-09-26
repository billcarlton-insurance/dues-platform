'use client';

import { useState, useEffect } from 'react';

type Body = { id: number; name: string; body_type: string; dues_amount: number };

export default function ImportPage() {
  const [bodies, setBodies] = useState<Body[]>([]);
  const [name, setName] = useState('');
  const [bodyType, setBodyType] = useState('Chapter');
  const [duesAmount, setDuesAmount] = useState('75');
  const [selectedBody, setSelectedBody] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const loadBodies = async () => {
    const res = await fetch('/api/body');
    setBodies(await res.json());
  };

  useEffect(() => {
    loadBodies();
  }, []);

  const createBody = async () => {
    await fetch('/api/body', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        body_type: bodyType,
        dues_amount: parseFloat(duesAmount),
      }),
    });
    setName('');
    setMessage(`Created ${name}`);
    loadBodies();
  };

  const importRoster = async () => {
    if (!file || !selectedBody) {
      setMessage('Pick a body and a CSV file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('body_id', selectedBody);
    const res = await fetch('/api/import', { method: 'POST', body: formData });
    const data = await res.json();
    setMessage(`Imported ${data.imported} members.`);
  };

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-10">
      <h1 className="text-2xl font-semibold">Setup</h1>

      <section className="space-y-3 border rounded-lg p-5">
        <h2 className="font-medium">1. Create a body</h2>
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
        <button
          className="bg-black text-white rounded px-4 py-2"
          onClick={createBody}
        >
          Create body
        </button>
      </section>

      <section className="space-y-3 border rounded-lg p-5">
        <h2 className="font-medium">2. Import member roster (CSV)</h2>
        <p className="text-sm text-gray-500">
          CSV columns expected: full_name, email, phone, mailing_address
        </p>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedBody}
          onChange={(e) => setSelectedBody(e.target.value)}
        >
          <option value="">Select a body...</option>
          {bodies.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.body_type})
            </option>
          ))}
        </select>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          className="bg-black text-white rounded px-4 py-2"
          onClick={importRoster}
        >
          Import roster
        </button>
      </section>

      {message && <p className="text-sm text-green-700">{message}</p>}

      {bodies.length > 0 && (
        <a
          className="underline text-blue-700"
          href={`/dashboard?body_id=${bodies[0].id}`}
        >
          Go to dashboard →
        </a>
      )}
    </main>
  );
}

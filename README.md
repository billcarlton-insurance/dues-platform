# Dues Platform — MVP

Core loop for chapter/council/commandery dues management: create a body,
import a member roster from CSV, track who's paid, mark payments.

## Run it

```
npm install
npm run dev
```

Then open http://localhost:3000 — it'll take you to /import.

## What's here

- `/import` — create a body (Chapter/Council/Commandery/Allied) and upload a
  roster CSV (columns: full_name, email, phone, mailing_address)
- `/dashboard?body_id=1` — see every member's dues status for the current
  cycle, with a "Mark paid" action
- SQLite database (`dues.db`, created automatically) — no external service
  needed to run this locally
- Schema in `lib/db.ts`: body, person, membership, dues_cycle, payment

## What's NOT here yet (by design — build in this order)

1. Real Stripe payments (currently "Mark paid" is a manual/secretary-entered
   action — this is exactly the slot where a Stripe webhook writes a payment
   row instead)
2. Notifications (email/text dues reminders, printable invoice fallback)
3. Emeritus / suspension-year credited-time logic
4. Life membership calculator
5. Calendar / events / RSVP
6. The onboarding wizard (currently setup is a plain form on /import)

Each of these is a self-contained next step — get the core loop solid with
your pilot chapter first, live through one real dues cycle, then layer in
the next piece.

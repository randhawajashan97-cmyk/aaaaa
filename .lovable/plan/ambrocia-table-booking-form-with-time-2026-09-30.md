# Ambrocia — Table Booking Form with Time

## What we're adding
A "Reserve a Table" booking form on the single-page site. Guests pick a date, a time slot, party size, and leave their name and phone. The reservation is saved to a database (Lovable Cloud) and the guest sees an elegant confirmation on screen.

## Form fields
- Name (required, max 100 chars)
- Phone (required, max 15 chars)
- Date (required — date picker, today onward)
- Time (required — fixed 30-minute slots from 12:00 pm to 11:00 pm, matching "open daily until 11:30 pm")
- Guests (required — 1 to 12)
- Notes (optional, max 500 chars — e.g. birthday, window table)

All input validated with zod on both client and server; nothing is echoed to console.

## Design
- New section between Menu and Gallery (or between Reviews and Visit): "Reserve" with the existing gold hairline + serif heading style.
- Dark noir form panel with gold-accented inputs and a gold "Confirm Reservation" button.
- On success: replaces the form with a confirmation ("Your table is set, {name} — {date} at {time}, {guests} guests") plus a note that the restaurant will confirm by phone.
- Nav gains a "Reserve" link; hero keeps "View the Menu" CTA.

## Backend (new — enables Lovable Cloud)
- Enable Lovable Cloud (the site currently has no backend).
- New `reservations` table: id, name, phone, date, time, guests, notes, created_at.
- GRANTs: INSERT + SELECT to anon (insert-only public form), ALL to service_role.
- RLS enabled; policy allows anon INSERT only (no one can read others' bookings from the browser).
- A `createReservation` server function validates with zod, then inserts through the server publishable client. Booking times restricted to the open-hour slots server-side.

## Files touched
- `src/routes/index.tsx` — new Reserve section + form component, nav link, success state.
- `src/lib/reservations.functions.ts` — new server function.
- New migration — table, grants, RLS policy.
- Lovable Cloud enabled for database + storage.

## Verification
- Check build log after edits.
- Playwright: fill the form with a test booking, submit, confirm the success message renders and the row lands in the database.

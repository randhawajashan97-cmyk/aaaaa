# Add a Data Panel Button

## Goal
Add a visible button on the website that takes staff to the orders data panel at `/admin` (the page showing Pending, Confirmed, Preparing and Cancelled bookings).

## Changes

1. **Navigation bar** (`src/routes/index.tsx`)
   - Add a "Staff Panel" button at the right end of the top navigation, next to the phone button.
   - Style it as a subtle gold-outline button so it fits the luxury look without competing with the "Reserve" call-to-action.
   - It links to `/admin` using the router's `Link` component. Guests who click it without a staff login are sent to the sign-in page automatically (existing behaviour).

2. **Footer** (`src/routes/index.tsx`)
   - Add a small "Staff Panel" text link in the footer for easy access on mobile, where the top button may be hidden.

## Technical details
- Use `Link` from `@tanstack/react-router` with `to="/admin"` — the route already exists at `src/routes/_authenticated/admin.tsx` behind the staff login gate.
- No database or backend changes. No new dependencies.
- Verify with a preview check: button renders, clicking it lands on the sign-in page when logged out.

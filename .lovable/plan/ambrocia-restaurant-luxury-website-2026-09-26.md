# Ambrocia Restaurant — Luxury Website

## What we're building
A single-page luxury restaurant website for **Ambrocia Restaurant** (Baba Bakala, Rayya, Punjab), using real details from the uploaded Google listing:
- 4.7 stars, 309 reviews
- ₹200–400 per person
- Address: Morh, near Beant Enclave, Baba Bakala, Rayya, Punjab 143202
- Phone: 082838 33030
- Open daily, closes 11:30 pm
- Dine-in, kerbside pickup, no-contact delivery
- Known for: butter chicken, paneer dishes, Amritsari kulcha, tandoori chicken, veg manchurian; separate tea/coffee point; biker- and tourist-friendly
- Visitor quotes: Hardip Singh and Harwinder Singh reviews

## Design direction (locked)
- **Palette: Noir & Gold** — near-black backgrounds (#0d0d0d / #1a1a1a), gold accents (#c9a84c), warm champagne highlights (#f0d78c). High-end editorial feel.
- **Typography: DM Serif Display headings + Fira Sans body**, loaded via `<link>` in the root route head.
- **Mood:** candlelit fine-dining luxury — generous whitespace, thin gold rules/dividers, serif display type, subtle reveal-on-scroll motion. No purple gradients, no generic SaaS look.

## Page structure (src/routes/index.tsx, replaces placeholder)
1. **Top bar / nav** — "AMBROCIA" wordmark, minimal links (Menu, Story, Reviews, Visit), phone number.
2. **Hero** — full-screen dark hero with generated moody food photography, serif headline, 4.7★ · 309 reviews badge, single CTA "View the Menu".
3. **Story / About** — short editorial paragraph about Ambrocia's warmth (tea point, biker-friendly, fresh food).
4. **Signature dishes** — 3 dish cards: Butter Chicken, Amritsari Kulcha, Paneer Tikka — each with generated image.
5. **Menu** — luxury two-column menu list (Starters, Tandoor & Mains, Breads, Beverages) with prices in ₹, within the ₹200–400 range.
6. **Gallery** — 3–4 generated images (interior ambience, tandoor, tea point, plated dish).
7. **Reviews** — 4.7 rating display, review summary line, two real visitor quotes from the listing.
8. **Visit / Contact** — hours, address, phone, service options (dine-in / pickup / delivery), and a Google Maps link.
9. **Footer** — minimal: wordmark, address, phone.

## Technical notes
- Tailwind v4 tokens in `src/styles.css` under `@theme inline` (oklch values for noir/gold palette); no hardcoded color utilities.
- Fonts via `<link>` in `src/routes/__root.tsx`; register `--font-display` / `--font-body` tokens.
- Images: 5–6 generated assets (hero, 3 dishes, gallery) saved under `src/assets/` and imported directly.
- Head metadata for the home route: unique title ("Ambrocia Restaurant — Luxury Indian Dining in Baba Bakala"), description, og tags.
- Frontend only — no database, no auth, no backend functions needed.

## Verification
- Check build log for errors after edits.
- Playwright screenshot of the finished page to confirm layout, fonts, and imagery render correctly.

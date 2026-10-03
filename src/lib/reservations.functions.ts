import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

/** Fixed 30-minute slots, 12:00 pm – 11:00 pm (open daily until 11:30 pm). */
export const TIME_SLOTS: { value: string; label: string }[] = Array.from(
  { length: 23 },
  (_, i) => {
    const minutes = 12 * 60 + i * 30; // start 12:00
    const h24 = Math.floor(minutes / 60);
    const mm = minutes % 60 === 0 ? "00" : "30";
    const h12 = h24 > 12 ? h24 - 12 : h24;
    const suffix = h24 >= 12 ? "PM" : "AM";
    return { value: `${String(h24).padStart(2, "0")}:${mm}`, label: `${h12}:${mm} ${suffix}` };
  }
);

const VALID_TIMES = new Set(TIME_SLOTS.map((s) => s.value));

export const reservationInputSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,15}$/, "Please enter a valid phone number"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please pick a date"),
  time: z.string().regex(/^([01]\d|2[0-3]):(00|30)$/, "Please pick a time"),
  guests: z.number().int().min(1).max(12),
  notes: z.string().trim().max(500).optional(),
});

export const createReservation = createServerFn({ method: "POST" })
  .inputValidator((data) => reservationInputSchema.parse(data))
  .handler(async ({ data }) => {
    // Server-side guard: only real, in-hours slots and today-onward dates.
    if (!VALID_TIMES.has(data.time)) {
      throw new Error("That time is outside our hours. Please pick a slot between 12:00 pm and 11:00 pm.");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(`${data.date}T00:00:00`) < today) {
      throw new Error("Please pick today or a future date.");
    }

    try {
      const { addOrder } = await import("./orders-store.server");
      await addOrder({
        name: data.name,
        phone: data.phone,
        date: data.date,
        time: data.time,
        guests: data.guests,
        notes: data.notes || null,
        status: "pending",
      });
    } catch (saveErr) {
      console.warn("Could not save to local orders store:", saveErr);
    }

    try {
      const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
      const supabaseUrl = process.env["SUPABASE_URL"];
      if (key && supabaseUrl) {
        const supabase = createClient(supabaseUrl, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const h = new Headers(init?.headers);
              if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
                h.delete("Authorization");
              }
              h.set("apikey", key);
              return fetch(input, { ...init, headers: h });
            },
          },
        });

        await supabase.from("reservations").insert({
          name: data.name,
          phone: data.phone,
          date: data.date,
          time: data.time,
          guests: data.guests,
          notes: data.notes || null,
        });
      }
    } catch (supabaseErr) {
      console.warn("Supabase insert notice:", supabaseErr);
    }

    return { ok: true as const };
  });

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createReservation, TIME_SLOTS } from "@/lib/reservations.functions";

import heroImg from "@/assets/hero.jpg";
import butterChicken from "@/assets/butter-chicken.jpg";
import kulcha from "@/assets/kulcha.jpg";
import paneerTikka from "@/assets/paneer-tikka.jpg";
import interior from "@/assets/interior.jpg";
import tandoor from "@/assets/tandoor.jpg";
import teaPoint from "@/assets/tea-point.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Ambrocia Restaurant — Luxury Indian Dining in Baba Bakala",
      },
      {
        name: "description",
        content:
          "Ambrocia Restaurant in Rayya, Punjab — butter chicken, Amritsari kulcha and paneer, served with warmth. Rated 4.7 by 309 guests. Open daily until 11:30 pm.",
      },
      { property: "og:title", content: "Ambrocia Restaurant — Luxury Indian Dining in Baba Bakala" },
      {
        property: "og:description",
        content:
          "Butter chicken, Amritsari kulcha and paneer, served with warmth in Baba Bakala, Punjab. Rated 4.7 by 309 guests.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV_LINKS = [
  { label: "Story", href: "#story" },
  { label: "Signatures", href: "#signatures" },
  { label: "Menu", href: "#menu" },
  { label: "Reserve", href: "#reserve" },
  { label: "Reviews", href: "#reviews" },
  { label: "Visit", href: "#visit" },
];

const SIGNATURES = [
  {
    name: "Butter Chicken",
    hindi: "Murgh Makhani",
    price: "₹340",
    description:
      "Charcoal-kissed chicken folded into a silky tomato and white-butter gravy, finished with cream and fenugreek.",
    image: butterChicken,
  },
  {
    name: "Amritsari Kulcha",
    hindi: "ਅੰਮ੍ਰਿਤਸਰੀ ਕੁਲਚਾ",
    price: "₹60",
    description:
      "Stone-ground, stuffed and slapped into the tandoor — blistered crisp, brushed with ghee, served with spiced chole.",
    image: kulcha,
  },
  {
    name: "Paneer Tikka",
    hindi: "ਪਨੀਰ ਟਿੱਕਾ",
    price: "₹260",
    description:
      "Hand-cut cottage cheese marinated overnight in hung curd and spices, charred over live embers with peppers.",
    image: paneerTikka,
  },
];

const MENU: { category: string; note: string; items: { name: string; description?: string; price: string }[] }[] = [
  {
    category: "To Begin",
    note: "From the tandoor & wok",
    items: [
      { name: "Paneer Tikka", description: "Charred cottage cheese, mint chutney", price: "260" },
      { name: "Tandoori Chicken", description: "Half bird, Punjabi masala, overnight marinade", price: "320" },
      { name: "Veg Manchurian", description: "Wok-tossed vegetable dumplings, soy-ginger glaze", price: "180" },
      { name: "American Salad", description: "Crisp greens, house dressing", price: "160" },
      { name: "Half Egg Fry", description: "Masala fried eggs, curry-leaf tempering", price: "120" },
    ],
  },
  {
    category: "Mains",
    note: "Slow-cooked Punjabi classics",
    items: [
      { name: "Butter Chicken", description: "Tandoor-smoked chicken, tomato & white butter", price: "340" },
      { name: "Paneer Butter Masala", description: "Silky makhani gravy, kasuri methi", price: "280" },
      { name: "Amritsari Chole", description: "Slow-simmered chickpeas, ginger juliennes", price: "200" },
      { name: "Dal Makhani", description: "Black lentils, twelve hours over embers", price: "240" },
    ],
  },
  {
    category: "Breads",
    note: "Slapped by hand, fired in the tandoor",
    items: [
      { name: "Amritsari Kulcha", description: "Stuffed, ghee-brushed, with chole", price: "60" },
      { name: "Butter Naan", description: "Classic leavened tandoor bread", price: "50" },
      { name: "Lachha Paratha", description: "Layered whole-wheat paratha", price: "60" },
      { name: "Tandoori Roti", description: "Stone-ground whole wheat", price: "30" },
    ],
  },
  {
    category: "The Tea Point",
    note: "Our beloved separate tea & coffee counter",
    items: [
      { name: "Masala Chai", description: "Fresh-brewed, cardamom & ginger", price: "40" },
      { name: "Filter Coffee", description: "Slow-dripped, frothed by hand", price: "50" },
      { name: "Sweet Lassi", description: "Churned curd, saffron strands", price: "80" },
      { name: "Fresh Lime Soda", description: "Sweet, salted, or mixed", price: "60" },
    ],
  },
];

const REVIEWS = [
  {
    author: "Hardip Singh",
    meta: "Local Guide · 29 reviews",
    quote:
      "Came with a plan to eat light… but the food had other plans. Every dish was so tasty that my diet took an unexpected holiday.",
  },
  {
    author: "Harwinder Singh",
    meta: "Local Guide · 16 reviews",
    quote:
      "A great stop for amazing food and a welcoming vibe. Loved their separate tea point — perfect for a relaxing break. Biker and tourist friendly.",
  },
];

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Stars() {
  return (
    <span aria-label="4.7 out of 5 stars" className="tracking-[0.2em] text-primary">
      ★★★★★
    </span>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center" data-reveal>
      <p className="text-xs uppercase tracking-[0.4em] text-primary">{eyebrow}</p>
      <h2 className="mt-4 text-4xl leading-tight text-foreground md:text-5xl">{title}</h2>
      <div className="gold-rule mx-auto mt-6" />
    </div>
  );
}

function Index() {
  useReveal();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="font-display text-xl tracking-[0.3em] text-foreground">
            AMBROCIA
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="border border-primary/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              Staff Panel
            </Link>
            <a
              href="tel:08283833030"
              className="hidden border border-input px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:block"
            >
              082838 33030
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Butter chicken and Amritsari kulcha by candlelight at Ambrocia"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-primary" data-reveal>
            Baba Bakala · Punjab
          </p>
          <h1 className="mt-6 font-display text-6xl leading-[1.05] text-foreground md:text-8xl" data-reveal>
            Where Every Plate <em className="text-primary">Feels</em> Occasioned
          </h1>
          <div className="gold-rule mx-auto mt-8" data-reveal />
          <p className="mt-8 text-sm font-light leading-relaxed tracking-wide text-muted-foreground md:text-base" data-reveal>
            Fresh tandoor, slow-cooked Punjabi classics and a devoted tea point — served
            with the kind of warmth guests write home about.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4" data-reveal>
            <a
              href="#menu"
              className="bg-primary px-10 py-4 text-xs uppercase tracking-[0.3em] text-primary-foreground transition-colors hover:bg-gold-soft"
            >
              View the Menu
            </a>
            <p className="text-xs tracking-[0.2em] text-muted-foreground">
              <Stars /> &nbsp;4.7 · 309 reviews
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="mx-auto max-w-4xl px-6 py-28 md:py-36">
        <SectionHeading eyebrow="Our Story" title="A Table With a Heart" />
        <div className="mt-12 space-y-6 text-center text-base font-light leading-loose text-muted-foreground" data-reveal>
          <p>
            On the highway at Baba Bakala, Ambrocia began with a simple belief — that
            travellers, bikers and neighbours all deserve a table set with care. Every
            gravy is ground fresh each morning, every kulcha slapped by hand and fired
            to order.
          </p>
          <p>
            Beyond the dining room sits our separate tea point: a quiet corner for
            chai, coffee and conversation. It is this attention — the kind staff, the
            clean and pleasant ambience, the honest prices — that 309 guests have
            rated 4.7 stars.
          </p>
        </div>
      </section>

      {/* Signature dishes */}
      <section id="signatures" className="border-y border-border bg-card py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="Signatures" title="Dishes Guests Return For" />
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {SIGNATURES.map((dish) => (
              <article key={dish.name} className="group" data-reveal>
                <div className="overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between">
                  <h3 className="text-2xl text-foreground">{dish.name}</h3>
                  <span className="font-display text-lg text-primary">{dish.price}</span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">{dish.hindi}</p>
                <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">{dish.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-5xl px-6 py-28 md:py-36">
        <SectionHeading eyebrow="The Menu" title="Set Down, Take Your Time" />
        <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground" data-reveal>
          ₹200–400 per person
        </p>
        <div className="mt-16 grid gap-16 md:grid-cols-2">
          {MENU.map((section) => (
            <div key={section.category} data-reveal>
              <h3 className="text-3xl text-foreground">{section.category}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-primary">{section.note}</p>
              <div className="gold-rule mt-4 !mx-0 w-full max-w-xs" />
              <ul className="mt-6 space-y-5">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-foreground">{item.name}</span>
                      <span aria-hidden className="grow border-b border-dotted border-border" />
                      <span className="text-primary">₹{item.price}</span>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm font-light text-muted-foreground">{item.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Reserve */}
      <ReservationSection />

      {/* Gallery */}
      <section className="border-y border-border bg-card py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="The Ambience" title="Evenings at Ambrocia" />
          <div className="mt-16 grid gap-6 md:grid-cols-3" data-reveal>
            <img
              src={interior}
              alt="Candle-lit dining room at Ambrocia"
              loading="lazy"
              width={1024}
              height={1024}
              className="aspect-[3/4] w-full object-cover"
            />
            <img
              src={tandoor}
              alt="Live embers of the tandoor oven"
              loading="lazy"
              width={1024}
              height={1024}
              className="aspect-[3/4] w-full object-cover md:mt-12"
            />
            <img
              src={teaPoint}
              alt="Chai being poured at the tea point"
              loading="lazy"
              width={1024}
              height={1024}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="mx-auto max-w-4xl px-6 py-28 md:py-36">
        <SectionHeading eyebrow="Guest Words" title="4.7, in Their Own Hand" />
        <div className="mt-16 space-y-12">
          {REVIEWS.map((review) => (
            <blockquote key={review.author} className="text-center" data-reveal>
              <Stars />
              <p className="mt-6 font-display text-2xl leading-relaxed text-foreground md:text-3xl">
                “{review.quote}”
              </p>
              <footer className="mt-6">
                <p className="text-sm tracking-[0.2em] text-foreground">{review.author}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">{review.meta}</p>
              </footer>
            </blockquote>
          ))}
        </div>
        <p className="mt-16 text-center text-sm font-light leading-relaxed text-muted-foreground" data-reveal>
          309 guests have rated Ambrocia 4.7 — praising the delicious, freshly made food,
          the attentive staff and the pleasant, clean ambience.
        </p>
      </section>

      {/* Visit */}
      <section id="visit" className="border-t border-border bg-card py-28 md:py-36">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading eyebrow="Visit Us" title="Find Your Way to the Table" />
          <div className="mt-16 grid gap-12 text-center md:grid-cols-3" data-reveal>
            <div>
              <h3 className="text-xs uppercase tracking-[0.35em] text-primary">Hours</h3>
              <p className="mt-4 text-foreground">Open daily</p>
              <p className="mt-1 text-sm font-light text-muted-foreground">Until 11:30 pm</p>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.35em] text-primary">Address</h3>
              <p className="mt-4 text-foreground">Morh, near Beant Enclave</p>
              <p className="mt-1 text-sm font-light text-muted-foreground">
                Baba Bakala, Rayya, Punjab 143202
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ambrocia+restaurant+Rayya+Punjab"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs uppercase tracking-[0.25em] text-primary underline-offset-4 hover:underline"
              >
                Get Directions
              </a>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.35em] text-primary">Contact</h3>
              <a href="tel:08283833030" className="mt-4 block text-foreground hover:text-primary">
                082838 33030
              </a>
              <p className="mt-3 text-sm font-light text-muted-foreground">
                Dine-in · Kerbside pickup · No-contact delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="font-display text-lg tracking-[0.3em] text-foreground">AMBROCIA</p>
          <p className="mt-3 text-xs font-light tracking-wide text-muted-foreground">
            Baba Bakala, Rayya, Punjab · 082838 33030 · Open daily until 11:30 pm
          </p>
          <Link
            to="/admin"
            className="mt-4 inline-block text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary"
          >
            Staff Panel
          </Link>
        </div>
      </footer>
    </div>
  );
}

const todayLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const prettyDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const prettyTime = (value: string) =>
  TIME_SLOTS.find((slot) => slot.value === value)?.label ?? value;

function ReservationSection() {
  const bookFn = useServerFn(createReservation);
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", guests: "2", notes: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<{ name: string; date: string; time: string; guests: string } | null>(null);

  const inputClass =
    "w-full border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      await bookFn({
        data: {
          name: form.name,
          phone: form.phone,
          date: form.date,
          time: form.time,
          guests: Number(form.guests),
          notes: form.notes.trim() || undefined,
        },
      });
      setConfirmed({ name: form.name, date: form.date, time: form.time, guests: form.guests });
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section id="reserve" className="mx-auto max-w-3xl px-6 py-28 md:py-36">
      <SectionHeading eyebrow="Reservations" title="Reserve Your Table" />
      <div className="mt-12 border border-border bg-card p-8 md:p-12" data-reveal>
        {status === "success" && confirmed ? (
          <div className="py-8 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-primary">Table Reserved</p>
            <p className="mt-6 font-display text-3xl leading-relaxed text-foreground md:text-4xl">
              Your table is set, {confirmed.name}.
            </p>
            <div className="gold-rule mx-auto mt-8" />
            <p className="mt-8 text-base text-foreground">
              {prettyDate(confirmed.date)} · {prettyTime(confirmed.time)} · {confirmed.guests}{" "}
              {Number(confirmed.guests) === 1 ? "guest" : "guests"}
            </p>
            <p className="mt-4 text-sm font-light text-muted-foreground">
              We will confirm your booking by phone shortly. To change or cancel, call 082838 33030.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-muted-foreground">Name</span>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-muted-foreground">Phone</span>
                <input
                  type="tel"
                  required
                  maxLength={15}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className={inputClass}
                />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-muted-foreground">Date</span>
                <input
                  type="date"
                  required
                  min={todayLocal()}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-muted-foreground">Time</span>
                <select
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Pick a time
                  </option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-muted-foreground">Guests</span>
                <select
                  required
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className={inputClass}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={String(n)}>
                      {n} {n === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Notes <span className="normal-case tracking-normal">(optional)</span>
              </span>
              <textarea
                rows={3}
                maxLength={500}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Birthday, window table, anything we should know…"
                className={`${inputClass} resize-none`}
              />
            </label>
            {status === "error" && error && (
              <p className="text-sm text-primary" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-primary px-10 py-4 text-xs uppercase tracking-[0.3em] text-primary-foreground transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Reserving…" : "Confirm Reservation"}
            </button>
            <p className="text-center text-xs font-light text-muted-foreground">
              Open daily until 11:30 pm · We confirm every booking by phone
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

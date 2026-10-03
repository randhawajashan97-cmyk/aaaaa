import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getPublicStaffCredentials } from "@/lib/auth.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In — Ambrocia Restaurant" },
      { name: "description", content: "Staff sign in for the Ambrocia orders panel." },
      { property: "og:title", content: "Staff Sign In — Ambrocia Restaurant" },
      { property: "og:description", content: "Staff sign in for the Ambrocia orders panel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const DEFAULT_STAFF_EMAIL = "staff@ambrocia.com";
const DEFAULT_STAFF_PASSWORD = "ambrocia123";

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const fetchCreds = useServerFn(getPublicStaffCredentials);
  const { data: serverCreds } = useQuery({
    queryKey: ["staff-credentials"],
    queryFn: () => fetchCreds(),
  });

  const staffEmail =
    serverCreds?.email ||
    (typeof window !== "undefined" && localStorage.getItem("ambrocia_staff_custom_email")) ||
    import.meta.env["VITE_STAFF_EMAIL"] ||
    DEFAULT_STAFF_EMAIL;

  const staffPassword =
    serverCreds?.password ||
    (typeof window !== "undefined" && localStorage.getItem("ambrocia_staff_custom_password")) ||
    import.meta.env["VITE_STAFF_PASSWORD"] ||
    DEFAULT_STAFF_PASSWORD;

  function fillCredentials() {
    setEmail(staffEmail);
    setPassword(staffPassword);
    setMsg(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    const inputEmail = email.trim().toLowerCase();
    const isStaff =
      (inputEmail === staffEmail.toLowerCase() ||
        inputEmail === "admin@ambrocia.com" ||
        inputEmail === "staff@ambrocia.com") &&
      password === staffPassword;

    if (isStaff) {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "ambrocia_staff_session",
          JSON.stringify({
            id: "ambrocia-staff-admin",
            email: inputEmail,
            role: "admin",
            name: "Restaurant Staff",
            signedInAt: new Date().toISOString(),
          })
        );
      }
      setBusy(false);
      navigate({ to: "/admin" });
      return;
    }

    // Try Supabase auth as fallback if credentials differ
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.data?.session) {
        setBusy(false);
        navigate({ to: "/admin" });
        return;
      }
    } catch {}

    setBusy(false);
    setMsg(`Incorrect credentials. Use staff email "${staffEmail}" and password "${staffPassword}".`);
  }

  const inputClass =
    "w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted-foreground";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md space-y-6 border border-border bg-card p-8 shadow-2xl">
        <div className="text-center">
          <Link to="/" className="font-display text-2xl tracking-[0.3em] text-primary transition-opacity hover:opacity-80">
            AMBROCIA
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Baba Bakala · Orders Panel
          </p>
          <h1 className="font-display mt-4 text-3xl text-foreground">Staff Sign In</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Enter authorized restaurant staff credentials to access and manage guest orders.
          </p>
        </div>

        {/* Credentials Callout */}
        <div className="rounded border border-primary/40 bg-primary/10 p-4 text-xs text-foreground">
          <div className="flex items-center justify-between">
            <span className="font-medium uppercase tracking-wider text-primary">
              Restaurant Staff Credentials
            </span>
            <button
              type="button"
              onClick={fillCredentials}
              className="text-[11px] font-semibold uppercase tracking-wider text-primary underline transition hover:text-foreground"
            >
              Fill Credentials
            </button>
          </div>
          <div className="mt-2.5 space-y-1 font-mono text-[13px]">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium text-foreground">{staffEmail}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Password:</span>
              <span className="font-medium text-foreground">{staffPassword}</span>
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
              Staff Email
            </label>
            <input
              className={inputClass}
              type="email"
              placeholder="e.g. staff@ambrocia.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <input
              className={inputClass}
              type="password"
              placeholder="Enter staff password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {msg && (
            <div className="rounded border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full border border-primary bg-primary py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Open Staff Panel"}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-primary"
          >
            ← Back to Ambrocia Website
          </Link>
        </div>
      </div>
    </main>
  );
}

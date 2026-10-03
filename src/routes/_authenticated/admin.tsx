import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Key, Lock, Mail, X, Check, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { listOrders, updateOrderStatus, ORDER_STATUSES, type OrderStatus } from "@/lib/orders.functions";
import { changeStaffCredentials, getPublicStaffCredentials } from "@/lib/auth.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Orders Panel — Ambrocia Restaurant" },
      { name: "description", content: "Manage confirmed, pending, preparing and cancelled orders." },
      { property: "og:title", content: "Orders Panel — Ambrocia Restaurant" },
      { property: "og:description", content: "Manage Ambrocia orders by status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  cancelled: "Cancelled",
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchOrders = useServerFn(listOrders);
  const setStatus = useServerFn(updateOrderStatus);
  const updateCredsServer = useServerFn(changeStaffCredentials);
  const getCredsServer = useServerFn(getPublicStaffCredentials);
  const { data: credsData } = useQuery({ queryKey: ["staff-credentials"], queryFn: () => getCredsServer() });

  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const { data, isLoading, error } = useQuery({ queryKey: ["orders"], queryFn: () => fetchOrders() });

  // Credentials change modal state
  const [showCredsModal, setShowCredsModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [credsLoading, setCredsLoading] = useState(false);
  const [credsError, setCredsError] = useState<string | null>(null);
  const [credsSuccess, setCredsSuccess] = useState<string | null>(null);

  const orders = data ?? [];
  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;
  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  async function change(id: string, status: OrderStatus) {
    await setStatus({ data: { id, status } });
    qc.invalidateQueries({ queryKey: ["orders"] });
  }

  const staffEmail =
    credsData?.email ||
    (typeof window !== "undefined"
      ? (() => {
          try {
            return JSON.parse(localStorage.getItem("ambrocia_staff_session") || "{}").email || "staff@ambrocia.com";
          } catch {
            return "staff@ambrocia.com";
          }
        })()
      : "staff@ambrocia.com");

  async function handleUpdateCredentials(e: React.FormEvent) {
    e.preventDefault();
    setCredsError(null);
    setCredsSuccess(null);

    if (newPassword.length < 6) {
      setCredsError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setCredsError("New passwords do not match.");
      return;
    }

    setCredsLoading(true);
    try {
      const res = await updateCredsServer({
        data: {
          currentPassword,
          newEmail: newEmail.trim().toLowerCase(),
          newPassword,
        },
      });

      if (res?.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("ambrocia_staff_custom_email", res.email);
          localStorage.setItem("ambrocia_staff_custom_password", newPassword);
          const existingSession = localStorage.getItem("ambrocia_staff_session");
          if (existingSession) {
            try {
              const parsed = JSON.parse(existingSession);
              parsed.email = res.email;
              localStorage.setItem("ambrocia_staff_session", JSON.stringify(parsed));
            } catch {}
          }
        }
        await qc.invalidateQueries({ queryKey: ["staff-credentials"] });
        setCredsSuccess(`Credentials updated successfully! New Email: ${res.email}`);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setShowCredsModal(false);
          setCredsSuccess(null);
        }, 1800);
      }
    } catch (err: any) {
      setCredsError(err?.message || "Failed to update credentials. Please verify current password.");
    } finally {
      setCredsLoading(false);
    }
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    if (typeof window !== "undefined") {
      localStorage.removeItem("ambrocia_staff_session");
    }
    try {
      await supabase.auth.signOut();
    } catch {}
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <Link to="/" className="font-display text-xl tracking-[0.3em] text-primary hover:opacity-80">
                AMBROCIA
              </Link>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">· Staff Portal</span>
            </div>
            <h1 className="font-display mt-2 text-4xl">Orders Panel</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:block text-right pr-2">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="font-mono text-xs text-primary">{staffEmail}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCredsSuccess(null);
                setCredsError(null);
                setNewEmail(staffEmail);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setShowCredsModal(true);
              }}
              className="flex items-center gap-1.5 border border-primary/50 bg-primary/10 px-3.5 py-2 text-xs uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground transition"
              title="Change Staff Email & Password"
            >
              <Key className="h-3.5 w-3.5" />
              <span>Change Credentials</span>
            </button>
            <Link
              to="/"
              className="border border-border px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary transition"
            >
              Website
            </Link>
            <button
              onClick={signOut}
              className="border border-border px-3.5 py-2 text-xs uppercase tracking-wider text-muted-foreground hover:border-destructive hover:text-destructive transition"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Change Credentials Modal */}
        {showCredsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md border border-border bg-card p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/30">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl text-foreground">Change Credentials</h2>
                    <p className="text-xs text-muted-foreground">Update Staff Email & Password</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCredsModal(false)}
                  className="text-muted-foreground hover:text-foreground transition p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateCredentials} className="space-y-4">
                {credsError && (
                  <div className="rounded border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                    {credsError}
                  </div>
                )}
                {credsSuccess && (
                  <div className="flex items-center gap-2 rounded border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>{credsSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary placeholder:text-muted-foreground/60"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Default is <span className="font-mono text-primary">ambrocia123</span> if not changed yet.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                    New Staff Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. staff@ambrocia.com"
                    className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary placeholder:text-muted-foreground/60"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary placeholder:text-muted-foreground/60"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary placeholder:text-muted-foreground/60"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/50">
                  <button
                    type="button"
                    onClick={() => setShowCredsModal(false)}
                    className="border border-border px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={credsLoading}
                    className="border border-primary bg-primary px-5 py-2 text-xs uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {credsLoading ? "Saving…" : "Save New Credentials"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatCard label="All" value={orders.length} active={filter === "all"} onClick={() => setFilter("all")} />
          {ORDER_STATUSES.map((s) => (
            <StatCard key={s} label={LABELS[s]} value={count(s)} active={filter === s} onClick={() => setFilter(s)} />
          ))}
        </div>

        {isLoading && <p className="text-muted-foreground">Loading orders…</p>}
        {error && <p className="text-primary">{(error as Error).message}</p>}
        {!isLoading && !error && shown.length === 0 && <p className="text-muted-foreground">No orders here yet.</p>}

        <div className="space-y-3">
          {shown.map((o) => (
            <div key={o.id} className="flex flex-col gap-4 border border-border bg-card p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-display text-xl">{o.name} <span className="text-sm text-muted-foreground">· {o.guests} guests</span></p>
                <p className="text-sm text-muted-foreground">
                  {o.date} at {o.time} · <a href={`tel:${o.phone}`} className="hover:text-primary">{o.phone}</a>
                </p>
                {o.notes && <p className="mt-1 text-sm italic text-muted-foreground">“{o.notes}”</p>}
              </div>
              <select
                value={o.status}
                onChange={(e) => change(o.id, e.target.value as OrderStatus)}
                className="border border-border bg-background px-3 py-2 text-sm text-primary outline-none focus:border-primary"
              >
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, active, onClick }: { label: string; value: number; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`border bg-card p-5 text-left transition ${active ? "border-primary" : "border-border hover:border-primary/60"}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="font-display mt-2 text-4xl text-primary">{value}</p>
    </button>
  );
}

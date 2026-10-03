import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { OrderStatus } from "./orders.functions";

export interface OrderRecord {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "orders.json");

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Gurpreet Singh",
    phone: "098765 43210",
    date: new Date().toISOString().slice(0, 10),
    time: "20:00",
    guests: 4,
    notes: "Window seating preferred, celebrating anniversary with family",
    status: "confirmed",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    name: "Amanpreet Kaur",
    phone: "098123 45678",
    date: new Date().toISOString().slice(0, 10),
    time: "19:30",
    guests: 2,
    notes: "Candlelight table, please prepare butter chicken & kulcha",
    status: "preparing",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    name: "Harjit Dhillon",
    phone: "098877 66554",
    date: new Date().toISOString().slice(0, 10),
    time: "21:00",
    guests: 6,
    notes: "Birthday party reservation",
    status: "pending",
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: "6ba7b811-9dad-11d1-80b4-00c04fd430c9",
    name: "Vikramjit Sharma",
    phone: "098234 56789",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: "13:30",
    guests: 3,
    notes: "Lunch reservation",
    status: "pending",
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

function ensureStorage(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_ORDERS, null, 2), "utf-8");
  }
}

export async function getOrdersList(): Promise<OrderRecord[]> {
  ensureStorage();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const orders: OrderRecord[] = JSON.parse(raw);
    return orders.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (err) {
    console.error("Failed to read orders from file:", err);
    return INITIAL_ORDERS;
  }
}

export async function addOrder(
  data: Omit<OrderRecord, "id" | "created_at">
): Promise<OrderRecord> {
  ensureStorage();
  const newOrder: OrderRecord = {
    ...data,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  try {
    const orders = await getOrdersList();
    orders.unshift(newOrder);
    fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save order to file:", err);
  }

  return newOrder;
}

export async function updateOrder(
  id: string,
  status: OrderStatus
): Promise<boolean> {
  ensureStorage();
  try {
    const orders = await getOrdersList();
    const target = orders.find((o) => o.id === id);
    if (!target) return false;
    target.status = status;
    fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to update order in file:", err);
    return false;
  }
}

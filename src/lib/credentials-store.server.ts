import fs from "node:fs";
import path from "node:path";

export interface StaffCredentials {
  email: string;
  password: string;
  updated_at: string;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const CREDS_FILE = path.join(DATA_DIR, "credentials.json");

const DEFAULT_CREDENTIALS: StaffCredentials = {
  email: process.env["VITE_STAFF_EMAIL"] || "staff@ambrocia.com",
  password: process.env["VITE_STAFF_PASSWORD"] || "ambrocia123",
  updated_at: new Date().toISOString(),
};

function ensureStorage(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CREDS_FILE)) {
    fs.writeFileSync(CREDS_FILE, JSON.stringify(DEFAULT_CREDENTIALS, null, 2), "utf-8");
  }
}

export function getStoredCredentials(): StaffCredentials {
  ensureStorage();
  try {
    const raw = fs.readFileSync(CREDS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read credentials file:", err);
    return DEFAULT_CREDENTIALS;
  }
}

export function updateStoredCredentials(email: string, password: string): StaffCredentials {
  ensureStorage();
  const updated: StaffCredentials = {
    email: email.trim().toLowerCase(),
    password,
    updated_at: new Date().toISOString(),
  };
  fs.writeFileSync(CREDS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

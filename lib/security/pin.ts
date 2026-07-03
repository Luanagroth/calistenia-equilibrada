const PIN_ENABLED_KEY = "ce_pin_enabled";
const PIN_HASH_KEY = "ce_pin_hash";
const PIN_SALT_KEY = "ce_pin_salt";

function isBrowser() {
  return typeof window !== "undefined";
}

export function generatePinSalt(): string {
  if (!isBrowser()) return "";
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function savePin(pin: string): Promise<void> {
  if (!isBrowser()) return;
  const salt = generatePinSalt();
  const hash = await hashPin(pin, salt);
  localStorage.setItem(PIN_ENABLED_KEY, "1");
  localStorage.setItem(PIN_SALT_KEY, salt);
  localStorage.setItem(PIN_HASH_KEY, hash);
}

export async function verifyPin(pin: string): Promise<boolean> {
  if (!isBrowser()) return false;
  const salt = localStorage.getItem(PIN_SALT_KEY);
  const hash = localStorage.getItem(PIN_HASH_KEY);
  if (!salt || !hash) return false;
  const inputHash = await hashPin(pin, salt);
  return inputHash === hash;
}

export function isPinEnabled(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(PIN_ENABLED_KEY) === "1";
}

export function disablePin(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(PIN_ENABLED_KEY);
  localStorage.removeItem(PIN_HASH_KEY);
  localStorage.removeItem(PIN_SALT_KEY);
}

export function markPinUnlocked(): void {
  if (!isBrowser()) return;
  sessionStorage.setItem("ce_pin_unlocked", "1");
}

export function isPinUnlocked(): boolean {
  if (!isBrowser()) return false;
  return sessionStorage.getItem("ce_pin_unlocked") === "1";
}

export function clearPinUnlock(): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem("ce_pin_unlocked");
}

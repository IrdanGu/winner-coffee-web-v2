import type { BookingRecord } from "../types/index.ts";

const STORAGE_KEY = "winner_coffee_bookings_v1";

// Memory fallback for SSR & testing environments where window / localStorage is unavailable
const memoryStore = new Map<string, BookingRecord>();

function isStorageAvailable(): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function getAllBookings(): BookingRecord[] {
  if (isStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.from(memoryStore.values());
}

export function saveBookingRecord(record: BookingRecord): void {
  memoryStore.set(record.code, record);

  if (isStorageAvailable()) {
    try {
      const current = getAllBookings();
      const filtered = current.filter((b) => b.code !== record.code);
      filtered.unshift(record);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn("Gagal menyimpan ke localStorage:", e);
    }
  }
}

export function getBookingRecord(code: string): BookingRecord | null {
  if (!code) return null;
  const upperCode = code.trim().toUpperCase();

  if (isStorageAvailable()) {
    const list = getAllBookings();
    const found = list.find((b) => b.code.toUpperCase() === upperCode);
    if (found) return found;
  }

  return memoryStore.get(upperCode) || null;
}

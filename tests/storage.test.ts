import test from "node:test";
import assert from "node:assert/strict";
import { saveBookingRecord, getBookingRecord } from "../lib/storage.ts";
import type { BookingRecord } from "../types/index.ts";

test("storage: menyimpan dan membaca kembali booking record berdasarkan kode", () => {
  const record: BookingRecord = {
    code: "WIN-2026-TEST1",
    customerName: "Ahmad",
    customerPhone: "081234567890",
    roomType: "karaoke",
    date: "2026-11-10",
    startTime: "13:00",
    durationHours: 3,
    guestCount: 6,
    estimate: {
      roomType: "karaoke",
      durationHours: 3,
      baseHours: 3,
      basePrice: 400000,
      extraHours: 0,
      extraHourPrice: 120000,
      totalEstimate: 400000,
      isAssumption: true,
    },
    createdAt: new Date().toISOString(),
    status: "menunggu-konfirmasi",
  };

  saveBookingRecord(record);
  const retrieved = getBookingRecord("WIN-2026-TEST1");
  assert.ok(retrieved !== null);
  assert.equal(retrieved?.code, "WIN-2026-TEST1");
  assert.equal(retrieved?.customerName, "Ahmad");
});

test("storage: mengembalikan null jika kode booking tidak ditemukan", () => {
  const nonExistent = getBookingRecord("WIN-NONEXISTENT");
  assert.equal(nonExistent, null);
});

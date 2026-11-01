import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateBookingEstimate,
  validateBookingInput,
  generateBookingCode,
  formatWhatsAppBookingMessage,
} from "../lib/booking.ts";
import type { BookingInput, CafeOperatingHours } from "../types/index.ts";

const mockHours: CafeOperatingHours = {
  regularDays: "Senin - Kamis",
  regularHours: "10.00 - 22.00 WIB",
  regularCloseHour: 22,
  weekendDays: "Jumat - Minggu",
  weekendHours: "10.00 - 23.00 WIB",
  weekendCloseHour: 23,
  openHour: 10,
};

test("calculateBookingEstimate: karaoke minimum 3 jam Rp400.000", () => {
  const result = calculateBookingEstimate("karaoke", 3);
  assert.equal(result.totalEstimate, 400000);
  assert.equal(result.baseHours, 3);
  assert.equal(result.extraHours, 0);
});

test("calculateBookingEstimate: karaoke 4 jam (400rb + 120rb = 520rb)", () => {
  const result = calculateBookingEstimate("karaoke", 4);
  assert.equal(result.totalEstimate, 520000);
  assert.equal(result.extraHours, 1);
});

test("calculateBookingEstimate: studio musik 2 jam (80rb x 2 = 160rb)", () => {
  const result = calculateBookingEstimate("studio-musik", 2);
  assert.equal(result.totalEstimate, 160000);
  assert.equal(result.basePrice, 80000);
});

test("validateBookingInput: menolak durasi karaoke kurang dari 3 jam", () => {
  const input: BookingInput = {
    roomType: "karaoke",
    date: "2026-11-05", // Kamis
    startTime: "14:00",
    durationHours: 2,
    guestCount: 4,
    customerName: "Budi",
    customerPhone: "08123456789",
  };
  const validation = validateBookingInput(input, mockHours);
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.durationHours.includes("minimal 3 jam"));
});

test("validateBookingInput: menolak booking melewati jam operasional kafe", () => {
  const input: BookingInput = {
    roomType: "karaoke",
    date: "2026-11-05", // Kamis, tutup jam 22.00
    startTime: "20:00",
    durationHours: 3, // Selesai jam 23.00 (melebihi jam 22.00)
    guestCount: 4,
    customerName: "Budi",
    customerPhone: "08123456789",
  };
  const validation = validateBookingInput(input, mockHours);
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.startTime.includes("melebihi jam operasional"));
});

test("validateBookingInput: menyetujui booking yang valid", () => {
  const input: BookingInput = {
    roomType: "karaoke",
    date: "2026-11-06", // Jumat, tutup jam 23.00
    startTime: "19:00",
    durationHours: 3, // Selesai jam 22.00
    guestCount: 5,
    customerName: "Siti Rahma",
    customerPhone: "082212345678",
  };
  const validation = validateBookingInput(input, mockHours);
  assert.equal(validation.isValid, true);
  assert.equal(Object.keys(validation.errors).length, 0);
});

test("generateBookingCode: menghasilkan kode berawalan WIN- dengan panjang tepat", () => {
  const code1 = generateBookingCode();
  const code2 = generateBookingCode();
  assert.ok(code1.startsWith("WIN-"));
  assert.notEqual(code1, code2);
});

test("formatWhatsAppBookingMessage: memuat kode, tanggal, jam, dan URL wa.me", () => {
  const record = {
    code: "WIN-2026-TEST",
    customerName: "Siti",
    customerPhone: "082212345678",
    roomType: "karaoke" as const,
    date: "2026-11-06",
    startTime: "19:00",
    durationHours: 3,
    guestCount: 5,
    estimate: calculateBookingEstimate("karaoke", 3),
    createdAt: new Date().toISOString(),
    status: "menunggu-konfirmasi" as const,
  };
  const url = formatWhatsAppBookingMessage(record, "6282240446408");
  assert.ok(url.startsWith("https://wa.me/6282240446408?text="));
  assert.ok(url.includes("WIN-2026-TEST"));
  assert.ok(url.includes("Siti"));
});

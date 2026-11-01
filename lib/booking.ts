import roomsData from "../data/rooms.json" with { type: "json" };
import { formatRupiah } from "./format.ts";
import type {
  BookingEstimate,
  BookingInput,
  BookingRecord,
  CafeOperatingHours,
  RoomInfo,
  RoomType,
  ValidationResult,
} from "../types/index.ts";

export function getRoomMeta(roomType: RoomType): RoomInfo {
  const found = (roomsData as RoomInfo[]).find((r) => r.type === roomType);
  if (!found) {
    throw new Error(`Unknown room type: ${roomType}`);
  }
  return found;
}

export function calculateBookingEstimate(
  roomType: RoomType,
  durationHours: number
): BookingEstimate {
  const room = getRoomMeta(roomType);
  const baseHours = room.minHours;
  const basePrice = room.basePrice;
  const extraHourPrice = room.extraHourPrice;

  if (roomType === "karaoke") {
    const extraHours = Math.max(0, durationHours - baseHours);
    const totalEstimate = basePrice + extraHours * extraHourPrice;

    return {
      roomType,
      durationHours,
      baseHours,
      basePrice,
      extraHours,
      extraHourPrice,
      totalEstimate,
      isAssumption: room.isAssumption,
    };
  }

  // studio-musik: durationHours * basePrice
  const extraHours = Math.max(0, durationHours - baseHours);
  const totalEstimate = durationHours * basePrice;

  return {
    roomType,
    durationHours,
    baseHours,
    basePrice,
    extraHours,
    extraHourPrice,
    totalEstimate,
    isAssumption: room.isAssumption,
  };
}

export function validateBookingInput(
  input: BookingInput,
  hours: CafeOperatingHours
): ValidationResult {
  const errors: Record<string, string> = {};
  const room = getRoomMeta(input.roomType);

  if (!input.customerName || input.customerName.trim().length < 2) {
    errors.customerName = "Nama lengkap wajib diisi (minimal 2 karakter).";
  }

  const cleanPhone = (input.customerPhone || "").replace(/[^0-9]/g, "");
  if (!cleanPhone || cleanPhone.length < 9) {
    errors.customerPhone = "Nomor WhatsApp aktif wajib diisi (minimal 9 digit).";
  }

  if (!input.date) {
    errors.date = "Tanggal booking wajib dipilih.";
  } else {
    const [year, month, day] = input.date.split("-").map(Number);
    const bookingDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(bookingDate.getTime())) {
      errors.date = "Format tanggal tidak valid.";
    } else if (bookingDate < today) {
      errors.date = "Tanggal booking tidak boleh di masa lalu.";
    }
  }

  if (input.durationHours < room.minHours) {
    errors.durationHours = `${room.name} memiliki ketentuan sewa minimal ${room.minHours} jam.`;
  }

  if (!input.startTime) {
    errors.startTime = "Waktu mulai wajib dipilih.";
  } else {
    const startHour = parseInt(input.startTime.split(":")[0], 10);
    if (isNaN(startHour) || startHour < hours.openHour) {
      errors.startTime = `Waktu mulai tidak boleh sebelum jam buka (${hours.openHour}.00 WIB).`;
    } else if (input.date) {
      const [year, month, day] = input.date.split("-").map(Number);
      const bookingDate = new Date(year, month - 1, day);
      const dayOfWeek = bookingDate.getDay(); // 0: Sun, 1-4: Mon-Thu, 5-6: Fri-Sat
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
      const maxCloseHour = isWeekend ? hours.weekendCloseHour : hours.regularCloseHour;

      const endHour = startHour + input.durationHours;
      if (endHour > maxCloseHour) {
        errors.startTime = `Durasi pemesanan selesai pukul ${endHour}.00 WIB, melebihi jam operasional tutup kafe (${maxCloseHour}.00 WIB).`;
      }
    }
  }

  if (!input.guestCount || input.guestCount < 1) {
    errors.guestCount = "Jumlah orang minimal 1.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateBookingCode(): string {
  const year = new Date().getFullYear();
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `WIN-${year}-${randomChars}`;
}

export function formatWhatsAppBookingMessage(
  booking: BookingRecord,
  cafePhone: string
): string {
  const room = getRoomMeta(booking.roomType);
  const roomLabel = `${room.name} (Min. ${room.minHours} Jam)`;
  const formattedPrice = formatRupiah(booking.estimate.totalEstimate);
  const cleanPhone = cafePhone.replace(/[^0-9]/g, "");

  const textLines = [
    `*HALO WINNER COFFEE — KONFIRMASI BOOKING*`,
    ``,
    `Saya ingin mengonfirmasi pengajuan reservasi ruangan melalui website:`,
    `• *Kode Booking*: ${booking.code}`,
    `• *Layanan*: ${roomLabel}`,
    `• *Nama Pemesan*: ${booking.customerName}`,
    `• *No. WhatsApp*: ${booking.customerPhone}`,
    `• *Tanggal*: ${booking.date}`,
    `• *Waktu*: Pukul ${booking.startTime} WIB`,
    `• *Durasi*: ${booking.durationHours} Jam`,
    `• *Jumlah Orang*: ${booking.guestCount} Orang`,
    `• *Estimasi Biaya*: ${formattedPrice} _(Asumsi/Belum Final)_`,
    booking.notes ? `• *Catatan Tambahan*: ${booking.notes}` : null,
    ``,
    `Mohon konfirmasi ketersediaan ruangan dan informasi verifikasi reservasinya. Terima kasih!`,
  ].filter(Boolean);

  const fullText = textLines.join("\n");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullText)}`;
}

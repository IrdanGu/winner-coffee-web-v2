"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Mic2,
  Music2,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import cafeInfo from "../../data/cafe-info.json" with { type: "json" };
import roomsData from "../../data/rooms.json" with { type: "json" };
import {
  calculateBookingEstimate,
  validateBookingInput,
  generateBookingCode,
  getRoomMeta,
} from "../../lib/booking";
import { saveBookingRecord } from "../../lib/storage";
import { formatRupiah, getTodayDateString } from "../../lib/format";
import { DisclaimerBadge } from "../../components/disclaimer-badge";
import { BookingConfirmationCard } from "../../components/booking-confirmation-card";
import type { BookingInput, BookingRecord, RoomType } from "../../types";

function BookingFormInner() {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("room");

  // Determine initial room type from URL query parameter
  const initialRoom: RoomType =
    roomParam === "studio-musik" ? "studio-musik" : "karaoke";

  const [roomType, setRoomType] = useState<RoomType>(initialRoom);
  const [date, setDate] = useState<string>(() => getTodayDateString());
  const [startTime, setStartTime] = useState<string>("13:00");
  const [durationHours, setDurationHours] = useState<number>(
    initialRoom === "karaoke" ? 3 : 2
  );
  const [guestCount, setGuestCount] = useState<number>(
    initialRoom === "karaoke" ? 6 : 4
  );
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedBooking, setSubmittedBooking] = useState<BookingRecord | null>(null);

  const activeRoom = useMemo(() => getRoomMeta(roomType), [roomType]);

  // When room type changes, ensure valid duration
  const handleRoomChange = (type: RoomType) => {
    setRoomType(type);
    const targetRoom = getRoomMeta(type);
    if (durationHours < targetRoom.minHours) {
      setDurationHours(targetRoom.minHours);
    }
    if (type === "karaoke") {
      setGuestCount(6);
    } else {
      setGuestCount(4);
    }
    setErrors({});
  };

  // Real-time calculated estimate
  const estimate = useMemo(() => {
    return calculateBookingEstimate(roomType, durationHours);
  }, [roomType, durationHours]);

  // Determine day-specific closing hour
  const closeHour = useMemo(() => {
    if (!date) return cafeInfo.hours.regularCloseHour;
    const [year, month, day] = date.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    return isWeekend ? cafeInfo.hours.weekendCloseHour : cafeInfo.hours.regularCloseHour;
  }, [date]);

  // Generate valid time slots
  const timeSlots = useMemo(() => {
    const slots = [];
    const maxStart = closeHour - activeRoom.minHours;
    for (let h = cafeInfo.hours.openHour; h <= maxStart; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
    }
    return slots;
  }, [closeHour, activeRoom.minHours]);

  // Generate duration options dynamically from room metadata
  const durationOptions = useMemo(() => {
    const options = [];
    const maxDuration = Math.min(6, closeHour - cafeInfo.hours.openHour);
    for (let d = activeRoom.minHours; d <= maxDuration; d++) {
      const calc = calculateBookingEstimate(roomType, d);
      const isBase = d === activeRoom.minHours;
      const label = isBase
        ? `${d} Jam (Paket Minimal - ${formatRupiah(calc.totalEstimate)})`
        : `${d} Jam (+${d - activeRoom.minHours} Jam - ${formatRupiah(calc.totalEstimate)})`;
      options.push({ value: d, label });
    }
    return options;
  }, [activeRoom, closeHour, roomType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const inputData: BookingInput = {
      roomType,
      date,
      startTime,
      durationHours: Number(durationHours),
      guestCount: Number(guestCount),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      notes: notes.trim() || undefined,
    };

    const validation = validateBookingInput(inputData, cafeInfo.hours);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const code = generateBookingCode();
    const newRecord: BookingRecord = {
      ...inputData,
      code,
      estimate,
      createdAt: new Date().toISOString(),
      status: "menunggu-konfirmasi",
    };

    // Save client side
    saveBookingRecord(newRecord);
    setSubmittedBooking(newRecord);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // SUCCESS STATE VIEW
  if (submittedBooking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-20">
        <BookingConfirmationCard
          booking={submittedBooking}
          onReset={() => setSubmittedBooking(null)}
        />
      </div>
    );
  }

  // FORM INPUT VIEW
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-20">
      {/* Editorial Header */}
      <div className="mb-12 border-b border-[#E5DFD7] pb-8 space-y-3">
        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[#766E65] block">
          Layanan Reservasi
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#111111]">
          Reservasi Ruangan.
        </h1>
        <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-[#665F55]">
          Pilih ruang karaoke privat atau studio musik. Sistem akan menghitung estimasi biaya
          dan menyiapkan pesan konfirmasi langsung ke WhatsApp Admin kafe.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="space-y-8 border-y border-[#111111] py-8 sm:py-10"
          >
            {/* Step 1: Select Room Type */}
            <div className="space-y-4">
              <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#766E65]">
                1. Pilih Jenis Layanan
              </span>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {roomsData.map((room) => {
                  const isSelected = roomType === room.type;
                  const isKaraoke = room.type === "karaoke";
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => handleRoomChange(room.type as RoomType)}
                      className={`flex flex-col items-start gap-1.5 border p-5 text-left transition-all ${
                        isSelected
                          ? "border-[#111111] bg-[#111111] text-[#F9F4EE] shadow-sm"
                          : "border-[#D9D2C7] bg-[#EFE8DD] text-[#111111] hover:border-[#111111]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isKaraoke ? (
                          <Mic2
                            className={`h-4 w-4 ${
                              isSelected ? "text-[#108474]" : "text-[#766E65]"
                            }`}
                          />
                        ) : (
                          <Music2
                            className={`h-4 w-4 ${
                              isSelected ? "text-[#108474]" : "text-[#766E65]"
                            }`}
                          />
                        )}
                        <span
                          className={`font-serif font-normal text-base ${
                            isSelected ? "text-[#F9F4EE]" : "text-[#111111]"
                          }`}
                        >
                          {room.name}.
                        </span>
                      </div>
                      <span
                        className={`text-xs font-sans font-medium tabular-nums ${
                          isSelected ? "text-[#D9D2C7]" : "text-[#111111]"
                        }`}
                      >
                        {isKaraoke
                          ? `Min. ${room.minHours} Jam • ${formatRupiah(room.basePrice)}`
                          : `Mulai 1 Jam • ${formatRupiah(room.basePrice)}/jam`}
                      </span>
                      <span
                        className={`text-[10px] ${
                          isSelected ? "text-[#A0988E]" : "text-[#766E65]"
                        }`}
                      >
                        Kapasitas {room.capacity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date and Time */}
            <div className="space-y-5 pt-6 border-t border-[#E5DFD7]">
              <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#766E65]">
                2. Jadwal Pemakaian
              </span>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Date */}
                <div>
                  <label htmlFor="booking-date" className="mb-1.5 block text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#665F55]">
                    Tanggal Booking
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={getTodayDateString()}
                    className="w-full border-y border-[#D9D2C7] bg-transparent py-2.5 px-1 text-xs text-[#111111] focus:border-[#111111] focus:outline-none rounded-none transition-colors"
                  />
                  {errors.date && (
                    <p className="mt-1 text-[11px] text-[#991B1B]">{errors.date}</p>
                  )}
                </div>

                {/* Start Time */}
                <div>
                  <label htmlFor="booking-time" className="mb-1.5 block text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#665F55]">
                    Waktu Mulai
                  </label>
                  <select
                    id="booking-time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border-y border-[#D9D2C7] bg-transparent py-2.5 px-1 text-xs text-[#111111] focus:border-[#111111] focus:outline-none rounded-none transition-colors"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        Pukul {slot} WIB
                      </option>
                    ))}
                  </select>
                  {errors.startTime && (
                    <p className="mt-1 text-[11px] text-[#991B1B]">{errors.startTime}</p>
                  )}
                </div>
              </div>

              {/* Duration and Guests */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Duration */}
                <div>
                  <label htmlFor="booking-duration" className="mb-1.5 block text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#665F55]">
                    Durasi Sewa
                  </label>
                  <select
                    id="booking-duration"
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full border-y border-[#D9D2C7] bg-transparent py-2.5 px-1 text-xs text-[#111111] focus:border-[#111111] focus:outline-none rounded-none transition-colors"
                  >
                    {durationOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.durationHours && (
                    <p className="mt-1 text-[11px] text-[#991B1B]">{errors.durationHours}</p>
                  )}
                </div>

                {/* Guest Count */}
                <div>
                  <label htmlFor="booking-guests" className="mb-1.5 block text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#665F55]">
                    Jumlah Tamu
                  </label>
                  <input
                    id="booking-guests"
                    type="number"
                    min={1}
                    max={25}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full border-y border-[#D9D2C7] bg-transparent py-2.5 px-1 text-xs text-[#111111] focus:border-[#111111] focus:outline-none rounded-none transition-colors"
                  />
                  {errors.guestCount && (
                    <p className="mt-1 text-[11px] text-[#991B1B]">{errors.guestCount}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Customer Details */}
            <div className="space-y-4 pt-6 border-t border-[#E5DFD7]">
              <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#766E65]">
                3. Data Pemesan
              </span>

              <div>
                <label htmlFor="booking-customer-name" className="mb-1.5 block text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#665F55]">
                  Nama Lengkap
                </label>
                <input
                  id="booking-customer-name"
                  type="text"
                  placeholder="Nama pemesan..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border-y border-[#D9D2C7] bg-transparent py-2.5 px-1 text-xs text-[#111111] focus:border-[#111111] focus:outline-none rounded-none transition-colors"
                />
                {errors.customerName && (
                  <p className="mt-1 text-[11px] text-[#991B1B]">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label htmlFor="booking-customer-phone" className="mb-1.5 block text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#665F55]">
                  Nomor WhatsApp Aktif
                </label>
                <input
                  id="booking-customer-phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border-y border-[#D9D2C7] bg-transparent py-2.5 px-1 text-xs text-[#111111] focus:border-[#111111] focus:outline-none rounded-none transition-colors"
                />
                {errors.customerPhone && (
                  <p className="mt-1 text-[11px] text-[#991B1B]">{errors.customerPhone}</p>
                )}
              </div>

              <div>
                <label htmlFor="booking-notes" className="mb-1.5 block text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#665F55]">
                  Catatan Khusus (Opsional)
                </label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  placeholder="Permintaan tambahan, mic ekstra, atau perayaan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border-y border-[#D9D2C7] bg-transparent py-2.5 px-1 text-xs text-[#111111] focus:border-[#111111] focus:outline-none rounded-none resize-y transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-between border border-[#111111] bg-[#111111] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#F9F4EE] hover:bg-[#108474] hover:border-[#108474] transition-all"
            >
              <span>Ajukan Booking & Dapatkan Kode</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right Sidebar: 5 cols (Summary & Guidance) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Real-time Calculation Card */}
          <div className="border-y border-[#111111] py-8 sm:py-10 space-y-6">
            <h3 className="font-serif text-xl font-normal text-[#111111]">
              Ringkasan Estimasi Biaya.
            </h3>

            <div className="space-y-3 text-xs text-[#443F3A] border-b border-[#E5DFD7] pb-6">
              <div className="flex justify-between">
                <span className="text-[#766E65]">Layanan:</span>
                <span className="font-medium text-[#111111]">
                  {activeRoom.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#766E65]">Durasi:</span>
                <span className="font-medium text-[#111111]">
                  {durationHours} Jam
                </span>
              </div>
              {roomType === "karaoke" ? (
                <>
                  <div className="flex justify-between text-[#766E65]">
                    <span>Paket {activeRoom.minHours} Jam Pertama:</span>
                    <span>{formatRupiah(activeRoom.basePrice)}</span>
                  </div>
                  {estimate.extraHours > 0 && (
                    <div className="flex justify-between text-[#766E65]">
                      <span>Jam Tambahan ({estimate.extraHours} Jam):</span>
                      <span>
                        +{formatRupiah(estimate.extraHours * estimate.extraHourPrice)}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-between text-[#766E65]">
                  <span>Tarif ({durationHours} Jam x {formatRupiah(activeRoom.basePrice)}):</span>
                  <span>
                    {formatRupiah(estimate.totalEstimate)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#766E65]">
                Total Estimasi:
              </span>
              <span className="font-serif text-2xl font-medium text-[#111111]">
                {formatRupiah(estimate.totalEstimate)}
              </span>
            </div>

            <DisclaimerBadge />
          </div>

          {/* Quick Notice Card */}
          <div className="border-y border-[#D9D2C7] py-6 space-y-4">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#766E65]">
              Ketentuan Reservasi:
            </h4>
            <ul className="space-y-2 text-xs text-[#665F55] leading-relaxed">
              <li>
                <strong className="text-[#111111]">• Ruang Karaoke:</strong> Wajib minimal sewa 3 jam.
              </li>
              <li>
                <strong className="text-[#111111]">• Verifikasi WhatsApp:</strong> Setelah mengisi form, kirim kode booking ke WhatsApp Admin untuk memastikan ruangan belum terisi oleh tamu lain.
              </li>
              <li>
                <strong className="text-[#111111]">• Pembayaran & Menu:</strong> Pembayaran sewa dan pemesanan makanan/minuman dilakukan langsung di kasir Winner Coffee.
              </li>
            </ul>

            <div className="pt-4 border-t border-[#E5DFD7]">
              <a
                href={`https://wa.me/${cafeInfo.whatsAppNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border border-[#111111] bg-[#111111] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F9F4EE] hover:bg-[#108474] hover:border-[#108474] transition-all"
              >
                <span>Ada pertanyaan? Hubungi Admin</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs font-sans uppercase tracking-[0.16em] text-[#766E65]">
          Memuat form reservasi ruangan...
        </div>
      }
    >
      <BookingFormInner />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Copy,
  Check,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";
import cafeInfo from "../data/cafe-info.json" with { type: "json" };
import { formatWhatsAppBookingMessage } from "../lib/booking";
import { formatRupiah } from "../lib/format";
import { DisclaimerBadge } from "./disclaimer-badge";
import type { BookingRecord } from "../types";

interface BookingConfirmationCardProps {
  booking: BookingRecord;
  onReset?: () => void;
  showBackToFormButton?: boolean;
}

export function BookingConfirmationCard({
  booking,
  onReset,
  showBackToFormButton = false,
}: BookingConfirmationCardProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const waUrl = formatWhatsAppBookingMessage(
    booking,
    cafeInfo.whatsAppNumber
  );

  const formattedPrice = formatRupiah(booking.estimate.totalEstimate);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="border-y border-[#111111] py-8 sm:py-12 space-y-8">
      {/* Status Header */}
      <div className="space-y-3 border-b border-[#E5DFD7] pb-6">
        <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#108474] font-semibold block">
          Status: Menunggu Konfirmasi Admin.
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111]">
          Pengajuan Reservasi Diterima.
        </h1>
        <p className="text-xs leading-relaxed text-[#665F55] max-w-lg">
          Kode referensi berikut telah dihasilkan. Silakan teruskan detail reservasi ini
          ke WhatsApp Admin untuk memeriksa ketersediaan ruangan dan konfirmasi jadwal.
        </p>
      </div>

      {/* Booking Code Callout */}
      <div className="border-y border-[#111111] py-6 text-center space-y-2">
        <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#766E65] font-medium block">
          Kode Referensi Booking
        </span>
        <div className="flex items-center justify-center gap-4">
          <span className="font-sans text-3xl sm:text-4xl font-semibold tracking-wider tabular-nums text-[#111111]">
            {booking.code}
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            aria-label="Salin kode booking"
            className="flex items-center gap-1.5 border-y border-[#111111] px-3 py-1.5 text-xs font-sans uppercase tracking-[0.14em] font-medium text-[#111111] hover:opacity-60 transition-opacity"
          >
            {isCopied ? (
              <>
                <Check className="h-3 w-3 text-[#108474]" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Booking Details Summary */}
      <div className="space-y-3 border-y border-[#E5DFD7] py-6 text-xs text-[#443F3A]">
        <div className="flex justify-between border-b border-[#E5DFD7] pb-2.5">
          <span className="text-[#766E65]">Layanan:</span>
          <span className="font-medium text-[#111111]">
            {booking.roomType === "karaoke" ? "Ruang Karaoke (Min. 3 Jam)" : "Studio Musik"}
          </span>
        </div>
        <div className="flex justify-between border-b border-[#E5DFD7] pb-2.5">
          <span className="text-[#766E65]">Nama Pemesan:</span>
          <span className="font-medium text-[#111111]">{booking.customerName}</span>
        </div>
        <div className="flex justify-between border-b border-[#E5DFD7] pb-2.5">
          <span className="text-[#766E65]">Jadwal:</span>
          <span className="font-medium text-[#111111]">
            {booking.date} • Pukul {booking.startTime} WIB ({booking.durationHours} Jam)
          </span>
        </div>
        <div className="flex justify-between border-b border-[#E5DFD7] pb-2.5">
          <span className="text-[#766E65]">Jumlah Tamu:</span>
          <span className="font-medium text-[#111111]">{booking.guestCount} Orang</span>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-[#766E65]">Estimasi Biaya:</span>
          <span className="font-serif text-xl font-medium text-[#111111]">
            {formattedPrice}
          </span>
        </div>
      </div>

      <DisclaimerBadge />

      {/* Action WhatsApp Button */}
      <div className="pt-2 flex flex-col gap-3">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-between border border-[#111111] bg-[#111111] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#F9F4EE] hover:bg-[#108474] hover:border-[#108474] transition-all"
        >
          <span className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-[#108474]" />
            <span>Kirim Konfirmasi ke WhatsApp Admin</span>
          </span>
          <ArrowUpRight className="h-4 w-4" />
        </a>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-between border-y border-[#D9D2C7] py-2.5 text-xs font-sans uppercase tracking-[0.14em] font-medium text-[#766E65] hover:border-[#111111] hover:text-[#111111] transition-colors"
          >
            <span>Buat Pengajuan Booking Lain</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
        )}

        {showBackToFormButton && (
          <Link
            href="/booking"
            className="flex items-center justify-between border-y border-[#D9D2C7] py-2.5 text-xs font-sans uppercase tracking-[0.14em] font-medium text-[#766E65] hover:border-[#111111] hover:text-[#111111] transition-colors"
          >
            <span>Kembali ke Form Booking</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

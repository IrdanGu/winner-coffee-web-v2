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
    <div className="border border-[#D9D2C7] bg-[#F4EFE6] p-8 sm:p-12 space-y-8">
      {/* Status Header */}
      <div className="space-y-3 border-b border-[#E5DFD7] pb-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#108474] font-semibold block">
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
      <div className="border border-[#111111] bg-[#F9F4EE] p-6 text-center space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#766E65] block">
          Kode Referensi Booking
        </span>
        <div className="flex items-center justify-center gap-4">
          <span className="font-mono text-3xl sm:text-4xl font-bold tracking-wider text-[#111111]">
            {booking.code}
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            aria-label="Salin kode booking"
            className="flex items-center gap-1.5 border border-[#111111] px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[#111111] hover:bg-[#111111] hover:text-[#F9F4EE] transition-colors"
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
      <div className="space-y-3 border border-[#E5DFD7] bg-[#F9F4EE] p-6 text-xs text-[#443F3A]">
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
          className="flex w-full items-center justify-center gap-2 border border-[#111111] bg-[#111111] py-4 text-xs font-semibold uppercase tracking-widest text-[#F9F4EE] hover:bg-[#108474] hover:border-[#108474] transition-all"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Kirim Konfirmasi ke WhatsApp Admin</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 py-2 text-xs font-mono uppercase tracking-wider text-[#766E65] hover:text-[#111111]"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Buat Pengajuan Booking Lain</span>
          </button>
        )}

        {showBackToFormButton && (
          <Link
            href="/booking"
            className="flex items-center justify-center gap-1.5 py-2 text-xs font-mono uppercase tracking-wider text-[#766E65] hover:text-[#111111]"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Kembali ke Form Booking</span>
          </Link>
        )}
      </div>
    </div>
  );
}

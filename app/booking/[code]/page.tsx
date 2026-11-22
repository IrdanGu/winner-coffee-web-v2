"use client";

import { use, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
  MessageCircle,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import cafeInfo from "../../../data/cafe-info.json" with { type: "json" };
import { getBookingRecord } from "../../../lib/storage";
import { BookingConfirmationCard } from "../../../components/booking-confirmation-card";
import type { BookingRecord } from "../../../types";

function BookingDetailContent({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const resolvedParams = use(params);
  const code = resolvedParams.code;

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Read from client-side storage asynchronously
    const frameId = requestAnimationFrame(() => {
      const record = getBookingRecord(code);
      setBooking(record);
      setLoading(false);
    });

    return () => cancelAnimationFrame(frameId);
  }, [code]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-[#766E65]">Memeriksa data reservasi...</p>
      </div>
    );
  }

  // If not found in local client storage
  if (!booking) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="border-y border-[#111111] py-12 space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center border-y border-[#111111]">
            <AlertCircle className="h-6 w-6 text-[#111111]" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
              Data Booking Tidak Ditemukan.
            </h1>
            <p className="text-xs text-[#665F55] max-w-sm mx-auto leading-relaxed">
              Kode booking <span className="font-semibold tracking-wider tabular-nums text-[#111111]">{code}</span> belum tercatat pada
              perangkat ini atau sesi telah berakhir.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking"
              className="flex w-full sm:w-auto items-center justify-between gap-3 border-y border-[#111111] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#111111] hover:opacity-60 transition-opacity"
            >
              <span>Buat Reservasi Baru</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href={`https://wa.me/${cafeInfo.whatsAppNumber}?text=Halo%20Admin%20Winner%20Coffee,%20saya%20ingin%20cek%20kode%20booking%20${code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full sm:w-auto items-center justify-between gap-3 border-y border-[#D9D2C7] px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#111111] hover:border-[#111111] hover:opacity-60 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-[#108474]" />
                <span>Tanya Admin</span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-20">
      <BookingConfirmationCard booking={booking} showBackToFormButton={true} />
    </div>
  );
}

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.16em] text-[#766E65]">Memeriksa data reservasi...</p>
        </div>
      }
    >
      <BookingDetailContent params={params} />
    </Suspense>
  );
}

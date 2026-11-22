import { MessageCircle, ArrowUpRight, Clock, MapPin } from "lucide-react";
import cafeInfo from "../data/cafe-info.json" with { type: "json" };

export function Footer() {
  return (
    <footer className="bg-[#111111] px-5 py-12 text-[#F9F4EE]">
      <div className="bg-[#111111] px-5 py-10 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 pb-16 border-b border-[#262626]">
          {/* Brand & Manifesto: 7 cols */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-serif text-2xl tracking-tight text-[#F9F4EE]">
              {cafeInfo.name}.
            </h2>
            <p className="text-xs leading-relaxed text-[#A0988E] max-w-md">
              Tempat yang dirancang cermat untuk bersantai, nugas, dan berkumpul di Kuningan.
              Menyajikan kopi pilihan, sajian khas, ruang karaoke privat berstandar audio tinggi,
              serta studio musik akustik terawat.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${cafeInfo.whatsAppNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#333333] px-3.5 py-2 text-xs uppercase tracking-wider text-[#F9F4EE] hover:border-[#F9F4EE] transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#108474]" />
                <span>Hubungi Admin WhatsApp</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Lokasi & Jam Operasional: 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#7E766D] mb-2">
                <Clock className="h-3.5 w-3.5" />
                <span>Jam Operasional.</span>
              </div>
              <div className="text-xs space-y-1 text-[#D9D2C7]">
                <p>
                  <span className="text-[#8E867C]">{cafeInfo.hours.regularDays}:</span>{" "}
                  {cafeInfo.hours.regularHours}
                </p>
                <p>
                  <span className="text-[#8E867C]">{cafeInfo.hours.weekendDays}:</span>{" "}
                  {cafeInfo.hours.weekendHours}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#7E766D] mb-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>Lokasi Kafe.</span>
              </div>
              <p className="text-xs leading-relaxed text-[#D9D2C7]">
                {cafeInfo.address}
              </p>
              <a
                href={cafeInfo.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#108474] hover:underline"
              >
                <span>Buka Petunjuk Google Maps</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7E766D]">
          <p>© 2026 {cafeInfo.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p className="tracking-wide">
              Considered Coffee, Karaoke & Music Studio • Kuningan, Jawa Barat
            </p>
            <span className="hidden sm:inline">•</span>
            <a
              href="/admin"
              className="text-[#A0988E] hover:text-[#F9F4EE] transition-colors underline-offset-4 hover:underline"
            >
              Portal Pengelola
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

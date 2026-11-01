"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, MessageCircle, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda." },
    { href: "/menu", label: "Menu." },
    { href: "/booking", label: "Reservasi." },
  ];

  return (
    <>
      {/* Announcement bar — WatchHouse black strip */}
      <div className="relative w-full bg-black px-5 py-1.5 text-center text-[13px] font-medium text-white">
        <p>Reservasi ruang karaoke & studio musik kini lewat website.</p>
        <span className="absolute right-5 top-1/2 hidden -translate-y-1/2 sm:block">
          Kuningan | ID
        </span>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-black bg-[#F9F4EE]">
        <div className="grid grid-cols-[1fr_auto] items-end gap-6 px-5 pb-2 pt-3 md:grid-cols-[1fr_auto_1fr]">
          {/* Brand */}
          <Link
            href="/"
            className="font-serif text-2xl font-medium leading-none tracking-[-0.03em] text-black"
          >
            Winner Coffee.
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm font-medium text-black transition-opacity hover:opacity-60 ${
                    isActive ? "underline underline-offset-4" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Utilities */}
          <div className="hidden items-center justify-end gap-8 text-sm font-medium md:flex">
            <Link href="/booking" className="hover:opacity-60">
              Pesan ruangan.
            </Link>
            <a
              href="https://wa.me/6282240446408"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:opacity-60"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>WA Admin.</span>
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="justify-self-end p-1 text-black md:hidden"
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[#E5DFD7] bg-[#F9F4EE] px-6 py-6 md:hidden space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-serif text-xl py-1 transition-colors ${
                      isActive
                        ? "text-[#108474] font-medium"
                        : "text-[#111111] hover:text-[#108474]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#E5DFD7] flex flex-col gap-3">
              <Link
                href="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center border border-[#111111] bg-[#111111] py-3 text-xs uppercase tracking-widest text-[#F9F4EE]"
              >
                Pesan Ruangan Sekarang
              </Link>
              <a
                href="https://wa.me/6282240446408"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-[#D9D2C7] py-2.5 text-xs uppercase tracking-wider text-[#108474]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Admin (0822-4044-6408)</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

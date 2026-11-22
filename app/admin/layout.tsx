import React from 'react';
import Link from 'next/link';
import { Coffee, ExternalLink, LogOut } from 'lucide-react';
import { connection } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { logoutAdminAction } from './actions';

export const metadata = {
  title: 'Admin Dashboard — Winner Coffee',
  description: 'Portal Manajemen Menu dan Kategori Winner Coffee',
};

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const authed = await isAuthenticated();

  if (!authed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#F9F4EE] flex flex-col font-sans selection:bg-[#108474] selection:text-white">
      {/* Top Architectural Navbar */}
      <header className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur-md border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Mark & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 border border-[#2A2A2A] bg-[#171717] text-[#108474] flex items-center justify-center shrink-0">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-serif text-lg font-medium tracking-tight text-[#F9F4EE]">
                  Winner Coffee.
                </span>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.16em] px-2 py-0.5 bg-[#108474]/15 text-[#108474] border border-[#108474]/30">
                  Control
                </span>
              </div>
              <p className="text-[11px] font-sans font-medium tracking-[0.14em] text-[#8E867C] hidden sm:block uppercase">
                Katalog Menu & Ketersediaan Kasir
              </p>
            </div>
          </div>

          {/* Action Links & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/menu"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#D9D2C7] hover:text-[#F9F4EE] border border-[#333333] hover:border-[#F9F4EE] transition-colors"
            >
              <span>Lihat Menu Publik</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#8E867C]" />
            </Link>

            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium uppercase tracking-[0.14em] text-rose-300 hover:text-white border border-rose-900/50 hover:border-rose-600/80 bg-rose-950/30 transition-colors cursor-pointer"
                title="Keluar dari sesi admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Architectural Minimal Footer */}
      <footer className="border-t border-[#222222] py-5 text-center text-[11px] font-sans font-medium tracking-[0.16em] text-[#665F55] uppercase">
        Winner Coffee &bull; Sistem Dashboard Kasir &bull; Kuningan, Jawa Barat
      </footer>
    </div>
  );
}

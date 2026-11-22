'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, KeyRound, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginAdminAction } from '../actions';

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const triggerLogin = (targetPin: string) => {
    if (!targetPin.trim() || isPending) return;
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append('pin', targetPin);
      const res = await loginAdminAction(formData);
      if (res && res.success) {
        window.location.href = '/admin';
      } else if (res && !res.success) {
        setError(res.error || 'PIN salah.');
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Silakan masukkan PIN pengelola.');
      return;
    }
    triggerLogin(pin);
  };

  const handleQuickKey = (digit: string) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
    if (pin.length < 10) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 6) {
        triggerLogin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#F9F4EE] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#108474] selection:text-white">
      
      {/* Decorative top announcement */}
      <div className="text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#8E867C] mb-8 text-center">
        Sistem Manajemen Internal &bull; Kuningan, ID
      </div>

      <div className="w-full max-w-md bg-[#171717] border border-[#2A2A2A] p-7 sm:p-9 shadow-2xl relative">
        
        {/* Architectural hairline accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#108474] to-transparent opacity-80" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1F1F1F] text-[#108474] border border-[#333333] mb-4">
            <Coffee className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[#F9F4EE]">
            Winner Coffee.
          </h1>
          <p className="text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#8E867C] mt-1.5">
            Portal Akses Kasir & Barista.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-950/40 border border-rose-900/60 flex items-center gap-2.5 text-rose-300 text-xs font-sans">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#D9D2C7]">
                Masukkan PIN Admin
              </label>
              <span className="text-[10px] font-sans font-medium uppercase text-[#7E766D] tracking-[0.14em] tabular-nums">
                Default: 123456
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E766D]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                name="pin"
                inputMode="numeric"
                maxLength={10}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#0D0D0D] border border-[#333333] text-center text-2xl tracking-[0.45em] font-sans font-semibold tabular-nums focus:outline-none focus:border-[#108474] focus:ring-1 focus:ring-[#108474] transition-all text-[#F9F4EE] placeholder-[#444444]"
                autoFocus
              />
            </div>
          </div>

          {/* Touch-Friendly Architectural Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleQuickKey(digit)}
                className="h-12 bg-[#202020] hover:bg-[#2A2A2A] active:bg-[#108474]/25 text-lg font-sans font-semibold tabular-nums text-[#F9F4EE] transition-colors border border-[#2E2E2E] cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPin('')}
              className="h-12 bg-[#1A1A1A] hover:bg-[#222222] text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#8E867C] transition-colors border border-[#2A2A2A] cursor-pointer"
            >
              CLEAR
            </button>
            <button
              type="button"
              onClick={() => handleQuickKey('0')}
              className="h-12 bg-[#202020] hover:bg-[#2A2A2A] active:bg-[#108474]/25 text-lg font-sans font-semibold tabular-nums text-[#F9F4EE] transition-colors border border-[#2E2E2E] cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 bg-[#1A1A1A] hover:bg-[#222222] text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#8E867C] transition-colors border border-[#2A2A2A] cursor-pointer"
            >
              HAPUS
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || !pin}
            className="w-full py-3.5 px-4 bg-[#108474] hover:bg-[#0E6E60] active:scale-[0.99] text-white font-sans text-xs uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 border border-[#108474] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-[#262626] flex items-center justify-center gap-2 text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-[#7E766D]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#108474]" />
          <span>Sesi terenkripsi &bull; Akses internal resmi</span>
        </div>
      </div>
    </div>
  );
}

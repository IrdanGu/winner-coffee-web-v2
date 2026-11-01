"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export interface FavouriteCard {
  id: string;
  name: string;
  description?: string;
  price: string;
  image: string;
  tag: string;
  isPromo?: boolean;
}

export interface FavouriteTab {
  id: string;
  label: string;
  items: FavouriteCard[];
}

export function HouseFavourites({ tabs }: { tabs: FavouriteTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  if (!active) return null;

  return (
    <section aria-labelledby="house-favourites-title" className="px-5 py-16 md:py-20">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2
            id="house-favourites-title"
            className="font-serif text-xl font-medium tracking-[-0.02em]"
          >
            Favorit rumah.
          </h2>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1" role="group" aria-label="Kategori menu">
            {tabs.map((tab) => {
              const isActive = tab.id === active.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveId(tab.id)}
                  className={`font-serif text-sm font-medium tracking-[-0.02em] transition-opacity ${
                    isActive ? "underline underline-offset-4" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        <Link
          href="/menu"
          className="shrink-0 border-b border-black pb-0.5 text-sm font-medium hover:opacity-60"
        >
          Lihat semua
        </Link>
      </div>

      <ul
        key={active.id}
        className="-mx-5 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none]"
      >
        {active.items.map((item) => (
          <li key={item.id} className="w-[78vw] max-w-[320px] shrink-0 snap-start">
            <article className="group flex h-full flex-col">
              <div className="relative aspect-[320/431] overflow-hidden bg-[#7E7975]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/35" />
                <p className="absolute left-2.5 top-2.5 bg-[#F9F4EE] px-2 py-1 text-[13px] font-medium">
                  {item.tag}
                </p>
                <p className="absolute bottom-2.5 left-2.5 text-sm font-medium text-white">
                  {item.isPromo ? "Promo rumah." : "Favorit rumah."}
                </p>
              </div>

              <h3 className="mt-3 font-serif text-lg font-medium tracking-[-0.02em]">
                {item.name}.
              </h3>
              <div className="mt-3 grid flex-1 grid-cols-[1fr_auto] content-start gap-2 text-[13px] leading-tight">
                <div>
                  <p className="font-medium">Catatan.</p>
                  <p className="mt-1 line-clamp-2 font-light">
                    {item.description ?? "Tanyakan barista kami."}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Harga.</p>
                  <p className="mt-1 font-light">{item.price}</p>
                </div>
              </div>
              <Link
                href="/menu"
                className="mt-5 flex items-center justify-between border-y border-black py-2 text-sm font-medium hover:opacity-60"
              >
                <span>Pesan di kasir.</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

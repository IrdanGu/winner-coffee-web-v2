"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import menuData from "../../data/menu.json";
import { formatRupiah } from "../../lib/format";

// ─── Data ──────────────────────────────────────────────────────────────────────
const itemMap = Object.fromEntries(menuData.items.map((i) => [i.id, i]));

type Group = { id: string; label: string; image: string; itemIds: string[] };
type Tab = { id: string; label: string; groups: Group[] };

const TABS: Tab[] = [
  {
    id: "drink",
    label: "Drink.",
    groups: [
      {
        id: "coffee",
        label: "Coffee.",
        image: "/assets/menu-icons/coffee.png",
        itemIds: [
          "double-espresso",
          "americano",
          "cappucino",
          "cafe-latte",
          "affogato",
          "mochacino",
          "piccolo",
          "creme-brulee-coffee",
          "coffee-matcha-latte",
          "caramel-latte",
          "salted-caramel",
          "macadamia-latte",
        ],
      },
      {
        id: "tea",
        label: "Tea.",
        image: "/assets/menu-icons/tea.png",
        itemIds: [
          "lychee-tea",
          "lemon-tea",
          "peach-tea",
          "thai-tea",
          "strawberry-tea",
          "regular-tea",
        ],
      },
      {
        id: "refresher",
        label: "Refresher.",
        image: "/assets/menu-icons/snacks.png",
        itemIds: ["air-mineral"],
      },
    ],
  },
  {
    id: "main-course",
    label: "Main Course.",
    groups: [
      {
        id: "chicken",
        label: "Chicken.",
        image: "/assets/menu-icons/main-course.png",
        itemIds: ["ayam-bakar-madu", "ayam-penyet-cabe-hijau", "ayam-goreng"],
      },
      {
        id: "ribs",
        label: "Ribs.",
        image: "/assets/menu-icons/spaghetti.png",
        itemIds: ["iga-bakar-madu", "iga-empok-bakar"],
      },
      {
        id: "rice-bowl",
        label: "Rice Bowl.",
        image: "/assets/menu-icons/rice-bowl.png",
        itemIds: [
          "nasi-goreng-seafood",
          "nasi-goreng-ayam",
          "chicken-katsu-rice-bowl",
          "beef-black-pepper-rice-bowl",
          "karaage-rice-bowl",
        ],
      },
    ],
  },
  {
    id: "pastry-snacks",
    label: "Pastry & Snacks.",
    groups: [
      {
        id: "pastry",
        label: "Pastry.",
        image: "/assets/menu-icons/pastry.png",
        itemIds: [
          "creamy-strawberry-croissant",
          "double-chocolate-croissant",
          "almond-croissant",
          "plain-butter-croissant",
        ],
      },
      {
        id: "dessert",
        label: "Dessert.",
        image: "/assets/menu-icons/dessert.png",
        itemIds: [
          "cheesecake-original",
          "strawberry-cheesecake-brulee",
          "tempura-ice-cream",
        ],
      },
      {
        id: "snacks",
        label: "Snacks & Bites.",
        image: "/assets/menu-icons/snacks.png",
        itemIds: ["churros-selection", "karaage-fries", "tempe-mendoan"],
      },
    ],
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<string>("drink");
  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="flex flex-col">

      {/* ── HERO ── */}
      <section className="relative min-h-[320px] sm:min-h-[420px] overflow-hidden border-b border-[#E5DFD7]">
        <Image
          src="/assets/instagram/C50uWakSiBJ/C50uWakSiBJ-02.jpg"
          alt="Winner Coffee — menu"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/80 via-[#0D0B09]/30 to-[#0D0B09]/10" />
        <div className="relative flex h-full min-h-[320px] sm:min-h-[420px] flex-col justify-end p-8 sm:p-16 text-[#F9F4EE]">
          <div className="space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#A0988E]">
              Winner Coffee • Kuningan
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-normal leading-[1.05] tracking-tight text-[#F9F4EE]">
              Plates and pours.
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-[#D2C9BE]">
              Kopi pilihan, teh aromatik, hidangan utama, dan pastry segar —
              disiapkan dengan penuh perhatian setiap hari.
            </p>
          </div>
        </div>
      </section>

      {/* ── TAB NAV — WatchHouse "Drinks / Counter / Brunch" style ── */}
      <nav
        className="sticky top-[57px] z-40 bg-[#F9F4EE]/95 backdrop-blur-sm border-b border-[#E5DFD7]"
        aria-label="Kategori menu"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex items-stretch overflow-x-auto gap-0 scrollbar-none">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 px-6 sm:px-8 py-5 text-sm tracking-wide transition-all border-b-2 ${
                    isActive
                      ? "border-[#111111] text-[#111111] font-semibold"
                      : "border-transparent text-[#766E65] hover:text-[#111111]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── MENU CONTENT ── */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-12 sm:py-16 space-y-0">
        {currentTab.groups.map((group, gIdx) => {
          const items = group.itemIds.map((id) => itemMap[id]).filter(Boolean);
          return (
            <div
              key={group.id}
              className={`${gIdx > 0 ? "border-t border-[#E5DFD7] pt-12 mt-12" : ""}`}
            >
              {/* Sub-group header: image left, title right — WatchHouse style */}
              <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-0 border border-[#E5DFD7] mb-0">
                {/* Image */}
                <div className="relative h-[180px] sm:h-auto overflow-hidden bg-[#F4EFE6]">
                  <Image
                    src={group.image}
                    alt={group.label}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, 220px"
                  />
                </div>
                {/* Title block */}
                <div className="flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-[#E5DFD7] bg-[#F9F4EE] p-8 sm:p-10">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#766E65] block mb-2">
                      {currentTab.label.replace(".", "")}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111]">
                      {group.label}
                    </h2>
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A0988E] mt-4">
                    {items.length} pilihan
                  </p>
                </div>
              </div>

              {/* Item rows */}
              <div className="border-x border-b border-[#E5DFD7]">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`group flex items-start justify-between gap-6 px-8 sm:px-10 py-6 bg-[#F9F4EE] transition-colors hover:bg-[#F4EFE6] ${
                      idx > 0 ? "border-t border-[#E5DFD7]" : ""
                    }`}
                  >
                    {/* Left: name + description */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-serif text-lg font-normal text-[#111111] group-hover:text-[#108474] transition-colors">
                          {item.name}.
                        </h3>
                        {item.isPromo && (
                          <span className="font-mono text-[10px] uppercase tracking-widest text-[#B45309] border border-[#B45309]/30 px-1.5 py-0.5">
                            Promo
                          </span>
                        )}
                        {item.isFavorite && (
                          <span className="font-mono text-[10px] uppercase tracking-widest text-[#108474] border border-[#108474]/30 px-1.5 py-0.5">
                            Favorit
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs leading-relaxed text-[#766E65] max-w-lg">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Right: price */}
                    <div className="shrink-0 text-right">
                      <span className="font-serif text-base font-medium text-[#111111]">
                        {formatRupiah(item.price)}
                      </span>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#A0988E] mt-0.5">
                        Kasir
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── BOTTOM CTA ── */}
      <div className="border-t border-[#E5DFD7] bg-[#F4EFE6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-normal text-[#111111]">
              Ingin berkunjung dan menyewa ruangan?
            </h3>
            <p className="text-xs text-[#665F55]">
              Pesan ruang karaoke privat (minimal 3 jam) atau studio musik sekarang.
            </p>
          </div>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 border border-[#111111] bg-[#111111] px-6 py-3 text-xs uppercase tracking-widest text-[#F9F4EE] hover:bg-transparent hover:text-[#111111] transition-all shrink-0"
          >
            <span>Pesan Ruangan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}

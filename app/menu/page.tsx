"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import menuData from "../../data/menu.json";

// ─── Data ──────────────────────────────────────────────────────────────────────
type Item = (typeof menuData.items)[number] & { isPromo?: boolean; isFavorite?: boolean };
const itemMap: Record<string, Item> = Object.fromEntries(menuData.items.map((i) => [i.id, i]));

type Group = { id: string; label: string; image: string; itemIds: string[] };
type Tab = { id: string; label: string; subheading: string; groups: Group[] };

const PHOTO = "/assets/menu-photos";

const TABS: Tab[] = [
  {
    id: "drink",
    label: "Drink.",
    subheading: "Kopi, teh, dan minuman segar lainnya.",
    groups: [
      {
        id: "coffee",
        label: "Coffee",
        image: `${PHOTO}/coffee.jpg`,
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
        label: "Tea",
        image: `${PHOTO}/tea.jpg`,
        itemIds: ["lychee-tea", "lemon-tea", "peach-tea", "thai-tea", "strawberry-tea", "regular-tea"],
      },
      {
        id: "refresher",
        label: "Refresher",
        image: `${PHOTO}/refresher.jpg`,
        itemIds: ["air-mineral"],
      },
    ],
  },
  {
    id: "main-course",
    label: "Main Course.",
    subheading: "Hidangan utama: ayam, iga, dan nasi.",
    groups: [
      {
        id: "chicken",
        label: "Chicken",
        image: `${PHOTO}/chicken.jpg`,
        itemIds: ["ayam-bakar-madu", "ayam-penyet-cabe-hijau", "ayam-goreng"],
      },
      {
        id: "ribs",
        label: "Ribs",
        image: `${PHOTO}/ribs.jpg`,
        itemIds: ["iga-bakar-madu", "iga-empok-bakar"],
      },
      {
        id: "rice-bowl",
        label: "Rice + Bowls",
        image: `${PHOTO}/rice-bowl.jpg`,
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
    subheading: "Croissant, dessert, dan camilan pendamping nongkrong.",
    groups: [
      {
        id: "pastry",
        label: "Pastry",
        image: `${PHOTO}/pastry.jpg`,
        itemIds: [
          "creamy-strawberry-croissant",
          "double-chocolate-croissant",
          "almond-croissant",
          "plain-butter-croissant",
        ],
      },
      {
        id: "dessert",
        label: "Dessert",
        image: `${PHOTO}/dessert.jpg`,
        itemIds: ["cheesecake-original", "strawberry-cheesecake-brulee", "tempura-ice-cream"],
      },
      {
        id: "snacks",
        label: "Snacks + Bites",
        image: `${PHOTO}/snacks.jpg`,
        itemIds: ["churros-selection", "karaage-fries", "tempe-mendoan"],
      },
    ],
  },
];

// Matches the printed Winner menu: 23000 -> "23K"
const formatPrice = (price: number) => `${price / 1000}K`;

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<string>("drink");
  const currentTab = TABS.find((t) => t.id === activeTab)!;

  const selectTab = (id: string) => {
    setActiveTab(id);
    document.getElementById("menu-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col px-5">
      {/* ── PAGE HEADER: blurred background, title bottom-left, portrait card right ── */}
      <section className="relative mt-0 h-[300px] overflow-hidden lg:h-[350px]">
        <Image
          src={`${PHOTO}/hero-bg.jpg`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative flex h-full items-end justify-between gap-6 p-5">
          <div className="text-[#F9F4EE]">
            <p className="text-[11px] uppercase tracking-[0.12em]">Menu</p>
            <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight lg:text-5xl">
              Plates and pours.
            </h1>
          </div>
          <div className="relative hidden h-[280px] w-[216px] shrink-0 sm:block">
            <Image
              src={`${PHOTO}/hero-card.jpg`}
              alt="Creamy Mango, minuman Winner Cafe"
              fill
              sizes="216px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORY NAVIGATION: black strip, 4-up like Drinks/Rarities/Counter/Brunch ── */}
      <nav aria-label="Kategori menu" className="mt-5 bg-[#000000] p-5">
        <div role="tablist" className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="menu-content"
                onClick={() => selectTab(tab.id)}
                className={`group flex flex-col text-left transition-colors ${
                  isActive ? "text-[#F9F4EE]" : "text-[#F9F4EE]/45 hover:text-[#F9F4EE]/80"
                }`}
              >
                <span className="font-serif text-[28px] font-medium leading-[1.1] tracking-tight">
                  {tab.label}
                </span>
                <span className="mt-6 text-sm leading-snug sm:mt-12">{tab.subheading}</span>
                <span
                  className={`mt-3 flex items-center justify-between border-t pt-3 text-[11px] uppercase tracking-[0.12em] ${
                    isActive ? "border-[#F9F4EE]" : "border-[#F9F4EE]/45"
                  }`}
                >
                  Discover
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── MENU SECTIONS: label + photo left, items with price right ── */}
      <div id="menu-content" role="tabpanel" className="scroll-mt-24">
        {currentTab.groups.map((group, gIdx) => {
          const items = group.itemIds.map((id) => itemMap[id]).filter(Boolean);
          const featured = gIdx === 0;
          return (
            <section
              key={group.id}
              aria-labelledby={`group-${group.id}`}
              className={featured ? "mt-14 bg-[#E1DCD6] px-5 py-6" : "mt-14"}
            >
              <div className="grid grid-cols-1 gap-y-7 border-t border-[#000000] pt-4 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8">
                <h2
                  id={`group-${group.id}`}
                  className="text-[11px] uppercase tracking-[0.12em] lg:col-span-6 lg:col-start-1 lg:row-start-1"
                >
                  {group.label}
                </h2>

                <ul className="lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
                  {items.map((item, idx) => {
                    const tag = item.isPromo ? "Promo" : item.isFavorite ? "Favorit" : null;
                    return (
                      <li
                        key={item.id}
                        className={`grid grid-cols-[1fr_auto_3.5rem] gap-x-6 gap-y-2 pb-8 ${
                          idx > 0 ? "border-t border-[#000000] pt-2" : ""
                        }`}
                      >
                        <p className="text-sm font-medium leading-[1.2]">{item.name}</p>
                        <p className="text-sm font-light leading-[1.2] text-[#111111]">
                          {tag && `○ ${tag}`}
                        </p>
                        <p className="text-right text-sm font-light leading-[1.2]">
                          {formatPrice(item.price)}
                        </p>
                        {item.description && (
                          <p className="col-span-2 max-w-xl text-sm font-light leading-[1.25]">
                            {item.description}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="relative aspect-[275/362] w-full max-w-[275px] lg:col-span-3 lg:col-start-1 lg:row-start-2 lg:self-end">
                  <Image
                    src={group.image}
                    alt={`${group.label} di Winner Cafe`}
                    fill
                    sizes="275px"
                    className="object-cover"
                  />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-10 text-xs font-light text-[#665F55]">
        ○ Favorit = pilihan favorit pelanggan. Harga dalam ribuan rupiah dan sudah termasuk PBJT.
      </p>

      {/* ── BOTTOM CTA ── */}
      <div className="mt-14 mb-14 flex flex-col items-start justify-between gap-6 border-t border-[#000000] pt-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h3 className="font-serif text-2xl font-medium tracking-tight">Mau sekalian sewa ruangan?</h3>
          <p className="text-sm font-light text-[#665F55]">
            Ruang karaoke privat (minimal 3 jam) atau studio musik per jam.
          </p>
        </div>
        <Link
          href="/booking"
          className="inline-flex shrink-0 items-center gap-2 border border-[#111111] bg-[#111111] px-6 py-3 text-[11px] uppercase tracking-[0.12em] text-[#F9F4EE] transition-colors hover:bg-transparent hover:text-[#111111]"
        >
          Pesan Ruangan
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

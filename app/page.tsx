import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import roomsData from "../data/rooms.json" with { type: "json" };
import cafeInfo from "../data/cafe-info.json" with { type: "json" };
import { getAllMenuItems, getMenuCategories } from "../lib/menu";
import { formatRupiah } from "../lib/format";
import { DisclaimerBadge } from "../components/disclaimer-badge";
import { HeroSlider, type HeroSlide } from "../components/home/hero-slider";
import { HouseFavourites, type FavouriteTab } from "../components/home/house-favourites";

const IG = "/assets/instagram";
// Keys describe what each photo shows (Instagram file names don't).
// Clean shots (no baked-in promo text) go in the large hero/banner slots.
const photo = {
  lounge: `${IG}/C50uWakSiBJ/C50uWakSiBJ-05.jpg`,
  barCounter: `${IG}/C50uWakSiBJ/C50uWakSiBJ-01.jpg`,
  terraceDuo: `${IG}/C50uWakSiBJ/C50uWakSiBJ-02.jpg`,
  tableTalk: `${IG}/C50uWakSiBJ/C50uWakSiBJ-04.jpg`,
  terraceGroup: `${IG}/C50uWakSiBJ/C50uWakSiBJ-06.jpg`,
  pourOver: `${IG}/winner-saved/C7v3OjvyKkf.jpg`,
  latteArt: `${IG}/winner-saved/C5Iq4InSm4C.jpg`,
  icedLatte: `${IG}/winner-saved/C8zDa1CS1oX.jpg`,
  pickYourBrew: `${IG}/winner-saved/DUYJ5sHkxzA.jpg`,
  karaoke: `${IG}/winner-saved/C9othFySFvB.jpg`,
  lunchtime: `${IG}/winner-saved/DK_OEEBzVoo.jpg`,
  cozyCorner: `${IG}/winner-saved/DA8S2PlzhkH.jpg`,
  melodyStairs: `${IG}/winner-saved/C4xogqmynb-.jpg`,
  baristaBarNight: "/assets/suasana/tempat-barista-warm-night-clean.jpg",
  laptopNight: "/assets/suasana/girl-front-laptop-night.jpg",
  espressoGrind: "/assets/suasana/barista-grinding-coffee-clean.jpg",
};

const heroSlides: HeroSlide[] = [
  {
    title: "Rumah kami.",
    linkLabel: "Temukan lokasi kami.",
    href: cafeInfo.mapsUrl,
    external: true,
    caption: "Satu rumah untuk kopi, karaoke, dan studio musik di Kuningan.",
    images: [
      { src: photo.baristaBarNight, alt: "Meja barista Winner Coffee dengan mesin espresso dan lampu hangat" },
      { src: photo.laptopNight, alt: "Pengunjung bekerja dengan laptop di meja bar pada malam hari" },
    ],
  },
  {
    title: "Seduh pilihanmu.",
    linkLabel: "Lihat katalog menu.",
    href: "/menu",
    caption: "Espresso dan manual brew, diseduh barista kami setiap hari.",
    images: [
      { src: photo.pourOver, alt: "Barista menyeduh kopi manual brew di meja bar" },
      { src: photo.espressoGrind, alt: "Barista menggiling biji kopi ke portafilter espresso" },
    ],
  },
];

// Category photo pools; cards rotate through them so the row stays varied.
const categoryPhotos: Record<string, string[]> = {
  coffee: [photo.pourOver, photo.icedLatte, photo.latteArt, photo.pickYourBrew],
  "non-coffee": [photo.pickYourBrew, photo.terraceDuo],
  "main-course": [photo.lunchtime, photo.tableTalk],
  "pastry-snacks": [photo.barCounter, photo.terraceGroup],
};

const collectionPhotos: Record<string, string> = {
  coffee: photo.icedLatte,
  "non-coffee": photo.pickYourBrew,
  "main-course": photo.lunchtime,
  "pastry-snacks": photo.barCounter,
};

function buildFavouriteTabs(): FavouriteTab[] {
  const items = getAllMenuItems().filter((item) => item.isAvailable);
  return getMenuCategories().map((category) => {
    const inCategory = items.filter((item) => item.categoryId === category.id);
    const highlighted = inCategory.filter((item) => item.isFavorite || item.isPromo);
    const pool = categoryPhotos[category.id] ?? [photo.lounge];
    return {
      id: category.id,
      label: `${category.name}.`,
      items: (highlighted.length > 0 ? highlighted : inCategory).slice(0, 6).map((item, i) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: formatRupiah(item.price),
        image: pool[i % pool.length],
        tag: category.name,
        isPromo: item.isPromo,
      })),
    };
  });
}

const roomPhotos: Record<string, string> = {
  karaoke: photo.karaoke,
  "studio-musik": photo.melodyStairs,
};

export default function HomePage() {
  const favouriteTabs = buildFavouriteTabs();
  const categories = getMenuCategories();

  return (
    <div className="flex flex-col bg-[#F9F4EE] text-black">
      {/* 1. Split hero slider */}
      <HeroSlider slides={heroSlides} />

      {/* 2. Text banner — label left, serif statement right */}
      <section className="grid grid-cols-1 gap-4 px-5 py-14 md:grid-cols-12 md:gap-[22px] md:py-20">
        <h2 className="font-serif text-sm font-medium tracking-[-0.02em] md:col-span-4">
          Kopi modern.
        </h2>
        <p className="font-serif text-xl font-medium leading-[1.2] tracking-[-0.02em] md:col-span-8 md:text-[40px]">
          Dedikasi kami: kopi yang diseduh cermat, ruang yang dirancang untuk berkumpul,
          dan pengalaman yang memperhatikan setiap detail.
        </p>
      </section>

      {/* 3. Favourites carousel with category tabs */}
      <HouseFavourites tabs={favouriteTabs} />

      {/* 4. Room rental banner — mirrors the subscription block */}
      <section className="mx-5 bg-[#E1DCD6] px-5 py-10 md:py-14" aria-labelledby="rooms-title">
        <h2 id="rooms-title" className="font-serif text-sm font-medium tracking-[-0.02em]">
          Ruang untuk bersuara.
        </h2>
        <p className="mt-3 max-w-3xl font-serif text-xl font-medium leading-[1.2] tracking-[-0.02em] md:text-[32px]">
          Untuk latihan band di sore hari dan nyanyian panjang di malam akhir pekan.
          Pilih ruangnya, kami siapkan sisanya.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr_1fr]">
          <div className="relative hidden aspect-[4/5] lg:block">
            <Image
              src={photo.cozyCorner}
              alt="Sudut duduk Winner Coffee dengan kursi bar"
              fill
              sizes="30vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-6">
            <ul className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              {roomsData.map((room) => (
                <li key={room.id} className="border-t border-black py-2 text-sm font-light">
                  <span className="font-medium">{room.name}.</span>{" "}
                  {room.type === "karaoke"
                    ? `Paket ${room.minHours} jam ${formatRupiah(room.basePrice)}`
                    : `Mulai ${formatRupiah(room.basePrice)}/jam`}
                  {" · "}Kapasitas {room.capacity}
                </li>
              ))}
            </ul>

            <p className="font-serif text-sm font-medium tracking-[-0.02em]">
              Pilih salah satu ruangan untuk memulai.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {roomsData.map((room) => (
                <Link
                  key={room.id}
                  href={`/booking?room=${room.type}`}
                  className="group relative aspect-[4/5] overflow-hidden border border-[#F8F2DE] bg-[#F9F4EE] text-white"
                >
                  <Image
                    src={roomPhotos[room.type] ?? photo.lounge}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute inset-x-3 bottom-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em]">
                    {room.name}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
            <DisclaimerBadge />
          </div>

          <div className="flex items-end">
            <Link
              href="/booking"
              className="flex w-full items-center justify-between border-y border-black py-2 text-[11px] uppercase tracking-[0.2em] hover:opacity-60"
            >
              Buat reservasi
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Featured house — full-width photo with location card */}
      <section className="px-5 pt-20 md:pt-28" aria-labelledby="house-title">
        <div className="relative h-[clamp(480px,70vh,700px)] overflow-hidden bg-[#7E7975]">
          <Image
            src={photo.terraceDuo}
            alt="Dua pengunjung berbincang di teras lantai atas Winner Coffee pada malam hari"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-5 left-5 hidden aspect-[4/5] w-[180px] overflow-hidden md:block">
            <Image src={photo.barCounter} alt="" fill sizes="180px" className="object-cover" />
          </div>

          <div className="absolute bottom-5 right-5 w-[min(100%-40px,360px)] text-white">
            <h2 id="house-title" className="font-serif text-xl font-medium tracking-[-0.02em]">
              Rumah kami.
            </h2>
            <dl className="mt-3 text-sm font-light">
              <div className="flex justify-between gap-4 border-t border-white/40 py-2">
                <dt className="font-medium">Kuningan.</dt>
                <dd className="text-right">Purwawinangun</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-white/40 py-2">
                <dt>{cafeInfo.hours.regularDays}</dt>
                <dd>{cafeInfo.hours.regularHours}</dd>
              </div>
              <div className="flex justify-between gap-4 border-y border-white/40 py-2">
                <dt>{cafeInfo.hours.weekendDays}</dt>
                <dd>{cafeInfo.hours.weekendHours}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs font-light leading-relaxed text-white/80">
              {cafeInfo.address}
            </p>
            <a
              href={cafeInfo.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-between border-b border-white py-2 text-[11px] uppercase tracking-[0.2em] hover:opacity-70"
            >
              Kunjungi rumah
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* 6. Collections — "WatchHouse at home." equivalent */}
      <section className="px-5 py-20 md:py-28" aria-labelledby="collections-title">
        <div className="grid grid-cols-1 gap-5 border-t border-black pt-3 lg:grid-cols-[1fr_2fr]">
          <h2
            id="collections-title"
            className="font-serif text-xl font-medium tracking-[-0.02em] md:text-[36px] md:leading-tight"
          >
            Winner di mejamu.
          </h2>
          <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:px-0">
            {categories.map((category) => (
              <li key={category.id} className="w-[70vw] max-w-[290px] shrink-0 snap-start">
                <Link href="/menu" className="group block">
                  <span className="relative block aspect-[290/403] overflow-hidden bg-[#7E7975]">
                    <Image
                      src={collectionPhotos[category.id] ?? photo.lounge}
                      alt=""
                      fill
                      sizes="290px"
                      className="object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.03]"
                    />
                  </span>
                  <span className="mt-2 block text-sm font-medium">{category.name}.</span>
                  <span className="mt-1 line-clamp-2 block text-[13px] font-light text-black/70">
                    {category.description}
                  </span>
                  <span className="mt-3 flex items-center justify-between border-y border-black py-2 text-[11px] uppercase tracking-[0.2em] group-hover:opacity-60">
                    Lihat
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Full-bleed story banner — "Point of Origin" equivalent */}
      <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden px-5 py-24 text-center text-[#F9F4EE]">
        <Image src={photo.latteArt} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-2xl">
          <h2 className="font-serif text-[40px] font-medium leading-none tracking-[-0.02em] md:text-[64px]">
            Dengarkan kopimu.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed">
            Dari meja bar ke studio musik: setiap cangkir disajikan untuk momen
            berkumpul, bernyanyi, dan berkarya.
          </p>
          <Link
            href="/booking"
            className="mx-auto mt-8 flex w-[248px] items-center justify-between border-y border-[#F9F4EE] py-2 text-[11px] uppercase tracking-[0.2em] hover:opacity-70"
          >
            Reservasi ruangan
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* 8. Half banners — "Our menu." / "Our story." */}
      <section className="grid grid-cols-1 gap-2.5 px-5 py-20 md:grid-cols-2 md:py-28">
        {[
          { title: "Menu kami.", href: "/menu", src: photo.tableTalk, alt: "Tiga pengunjung menikmati minuman dan hidangan di meja kafe" },
          { title: "Ruang kami.", href: "/booking", src: photo.terraceGroup, alt: "Pengunjung berkumpul di teras lantai atas Winner Coffee" },
        ].map((banner) => (
          <Link
            key={banner.title}
            href={banner.href}
            className="group relative aspect-[3/4] overflow-hidden bg-[#696561] text-white md:aspect-[4/5]"
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
            <span className="absolute left-5 top-3">
              <span className="block font-serif text-[36px] font-medium tracking-[-0.02em]">
                {banner.title}
              </span>
              <span className="mt-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
                Lihat lebih
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

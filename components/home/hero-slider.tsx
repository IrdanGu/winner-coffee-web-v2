"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";

export interface HeroImage {
  src: string;
  alt: string;
}

export interface HeroSlide {
  title: string;
  linkLabel: string;
  href: string;
  external?: boolean;
  caption: string;
  images: [HeroImage, HeroImage];
}

const AUTOPLAY_MS = 7000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    // Server render: assume reduced motion so autoplay only starts after hydration.
    () => true,
  );
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const autoplay = !paused && !reducedMotion && slides.length > 1;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % slides.length),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, autoplay, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Sorotan Winner Coffee"
      className="px-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative h-[clamp(520px,76vh,720px)] overflow-hidden bg-[#7E7975]">
        {slides.map((slide, index) => {
          const isActive = index === active;
          const linkClass =
            "flex items-center justify-between py-3 text-sm font-medium hover:opacity-70";
          const linkContent = (
            <>
              <span>{slide.linkLabel}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          );

          return (
            <div
              key={slide.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} dari ${slides.length}`}
              aria-hidden={!isActive}
              inert={!isActive}
              className={`absolute inset-0 grid grid-cols-1 md:grid-cols-2 motion-safe:transition-opacity motion-safe:duration-700 ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {slide.images.map((image, imageIndex) => (
                <div
                  key={image.src}
                  className={`relative h-full ${imageIndex === 1 ? "hidden md:block" : ""}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    preload={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
                </div>
              ))}

              {/* Bottom-left: headline + progress link */}
              <div className="absolute bottom-5 left-5 right-5 text-white md:right-auto md:max-w-[calc(50%-40px)]">
                <h2 className="font-serif text-[40px] font-medium leading-none tracking-[-0.02em] sm:text-[56px]">
                  {slide.title}
                </h2>
                <div className="relative mt-8 w-[248px] max-w-full border-t border-white/40">
                  {isActive && autoplay && (
                    <span
                      key={`${active}-${autoplay}`}
                      aria-hidden="true"
                      className="absolute -top-px left-0 h-px w-full origin-left bg-white animate-[hero-progress_7s_linear_forwards]"
                    />
                  )}
                  {slide.external ? (
                    <a
                      href={slide.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {linkContent}
                    </a>
                  ) : (
                    <Link href={slide.href} className={linkClass}>
                      {linkContent}
                    </Link>
                  )}
                </div>
              </div>

              {/* Bottom-left of the right image: editorial caption */}
              <p className="absolute bottom-[72px] left-[calc(50%+20px)] hidden max-w-sm font-serif text-lg font-medium leading-snug tracking-[-0.01em] text-white md:block">
                {slide.caption}
              </p>
            </div>
          );
        })}

        {/* Slide index — WatchHouse "01 02" */}
        <div className="absolute left-5 top-5 z-10 flex gap-3 text-sm">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Tampilkan slide ${index + 1}: ${slide.title}`}
              aria-current={index === active}
              className={`text-white transition-opacity hover:opacity-100 ${
                index === active ? "opacity-100" : "opacity-50"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

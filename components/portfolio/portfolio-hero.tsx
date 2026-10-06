import Image from "next/image"
import type { Property } from "@/lib/properties"

export function PortfolioHero({ property }: { property?: Property }) {
  const hero = property?.heroImage

  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-[var(--hg-black)]">
      {hero && (
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--hg-black)] via-[var(--hg-black)]/50 to-[var(--hg-black)]/25" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-40 md:px-12">
        <p className="hg-eyebrow">
          H GROUP ASSOCIATES & INVESTORS
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
          Find a home that feels right.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
          Explore H Group rental homes through authentic photography, detailed
          property information, and a closer look at each space. When you find the
          right fit, request a private tour.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#properties"
            className="hg-btn-primary rounded-full px-6 py-3 text-sm font-semibold"
          >
            Explore Properties
          </a>
          <a
            href="#book"
            className="hg-btn-outline rounded-full px-6 py-3 text-sm font-semibold"
          >
            Request a Tour
          </a>
        </div>

        {property && (
          <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--hg-line-dark)] pt-6 text-sm text-white/70">
            <span className="hg-eyebrow tracking-[0.24em]">
              Featured Property
            </span>
            <span className="font-display text-lg text-white">{property.name}</span>
            <span className="text-white/60">Ask About Availability</span>
          </div>
        )}
      </div>
    </section>
  )
}

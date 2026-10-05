import Image from "next/image"
import type { Property } from "@/lib/properties"

export function PortfolioHero({ property }: { property?: Property }) {
  const hero = property?.heroImage

  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-[#1a1614]">
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
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1614] via-[#1a1614]/45 to-[#1a1614]/20" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-40 md:px-12">
        <p className="text-xs uppercase tracking-[0.3em] text-[#e2b65a]">
          H Group Rentals
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] text-[#f7f3ec] md:text-7xl">
          Homes for rent, shown as they stand.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#f7f3ec]/80">
          Explore H Group rental homes through real photographs. See the rooms,
          understand the space, and request a tour when a home is right for you.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#properties"
            className="gold-gradient rounded-full px-6 py-3 text-sm font-semibold text-[#1a1614]"
          >
            Explore the properties
          </a>
          <a
            href="#book"
            className="rounded-full border border-[#f7f3ec]/40 px-6 py-3 text-sm font-semibold text-[#f7f3ec] hover:border-[#e2b65a] hover:text-[#e2b65a]"
          >
            Request a tour
          </a>
        </div>

        {property && (
          <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#f7f3ec]/15 pt-6 text-sm text-[#f7f3ec]/70">
            <span className="text-xs uppercase tracking-[0.24em] text-[#e2b65a]">
              Featured Property
            </span>
            <span className="font-display text-lg text-[#f7f3ec]">{property.name}</span>
            <span className="text-[#f7f3ec]/50">Ask About Availability</span>
          </div>
        )}
      </div>
    </section>
  )
}

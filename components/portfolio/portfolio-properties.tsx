import Image from "next/image"
import type { Property } from "@/lib/properties"
import { Reveal } from "./reveal"

export function PortfolioProperties({
  properties,
  onView,
  onInquire,
}: {
  properties: Property[]
  onView: (property: Property) => void
  onInquire: (property: Property) => void
}) {
  return (
    <section id="properties" className="border-t border-[var(--hg-line)] bg-[var(--hg-offwhite)] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal>
          <p className="hg-eyebrow">
            The Properties
          </p>
          <h2 className="font-display mt-3 text-4xl font-semibold text-[var(--hg-ink)] md:text-6xl">
            Rent a home you&rsquo;ve actually seen.
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--hg-muted)]">
            H Group gives prospective residents a clear view of its homes before
            scheduling a tour — real photographs, room by room, exactly as the
            property stands.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8">
          {properties.map((property, index) => (
            <Reveal key={property.id} delay={index * 100}>
              <article className="group grid overflow-hidden rounded-[2rem] border border-[var(--hg-line)] bg-white md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onView(property)}
                  className="relative aspect-[4/3] cursor-pointer overflow-hidden text-left md:aspect-auto md:min-h-[28rem]"
                  aria-label={`View photos and details for ${property.name}`}
                >
                  {property.heroImage && (
                    <Image
                      src={property.heroImage.src}
                      alt={property.heroImage.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  )}
                  <span className="absolute left-5 top-5 rounded-full bg-[var(--hg-black)]/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--hg-gold)] backdrop-blur-sm">
                    Featured Property
                  </span>
                </button>

                <div className="flex flex-col justify-between gap-8 p-8 md:p-10">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--hg-teal-ui)]">
                      {property.inquiryReference}
                    </p>
                    <h3 className="font-display mt-2 text-3xl font-semibold md:text-4xl">
                      {property.name}
                    </h3>
                    <p className="mt-4 leading-relaxed text-[var(--hg-muted)]">
                      {property.description}
                    </p>
                    {property.highlights && property.highlights.length > 0 && (
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {property.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="rounded-full border border-[var(--hg-line)] px-3 py-1.5 text-xs text-[var(--hg-muted)]"
                          >
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => onView(property)}
                      className="hg-btn-primary rounded-full px-6 py-3 text-sm font-semibold"
                    >
                      View this home
                    </button>
                    <button
                      type="button"
                      onClick={() => onInquire(property)}
                      className="hg-btn-outline-dark rounded-full px-6 py-3 text-sm font-semibold"
                    >
                      Ask about availability
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

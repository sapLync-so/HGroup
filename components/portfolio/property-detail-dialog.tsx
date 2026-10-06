"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { propertyFacts, type Property } from "@/lib/properties"

export function PropertyDetailDialog({
  property,
  onClose,
  onInquire,
}: {
  property: Property | null
  onClose: () => void
  onInquire: (property: Property) => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [lastProperty, setLastProperty] = useState<Property | null>(property)

  if (property !== lastProperty) {
    setLastProperty(property)
    setPhotoIndex(0)
  }

  useEffect(() => {
    if (!property) return

    const previous = document.activeElement as HTMLElement | null
    document.body.style.overflow = "hidden"
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>("button")?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
        return
      }
      if (event.key !== "Tab" || !panel) return
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      previous?.focus?.()
    }
  }, [property, onClose])

  if (!property) return null

  const gallery = property.gallery ?? []
  const photo = gallery[photoIndex] ?? property.heroImage
  const facts = propertyFacts(property)

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6" role="presentation">
      <button
        type="button"
        aria-label="Close property details"
        onClick={onClose}
        className="absolute inset-0 bg-[var(--hg-black)]/75 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-dialog-title"
        className="pp-dialog relative grid max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-[2rem] bg-[var(--hg-offwhite)] md:grid-cols-2 md:rounded-[2rem]"
      >
        <div className="relative">
          <div className="relative aspect-[4/3] bg-[var(--hg-charcoal)] md:aspect-auto md:h-full md:min-h-[32rem]">
            {photo && (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-center"
              />
            )}
            {photo?.staged && (
              <span className="absolute left-4 top-4 rounded-full bg-[var(--hg-black)]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--hg-gold)] backdrop-blur-sm">
                {photo.caption}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-[var(--hg-black)]/80 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-[var(--hg-black)]"
            >
              Close
            </button>
          </div>
          {gallery.length > 1 && (
            <div className="absolute inset-x-0 bottom-0 flex gap-2 overflow-x-auto bg-gradient-to-t from-black/70 to-transparent p-4">
              {gallery.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setPhotoIndex(index)}
                  aria-label={`Show photo ${index + 1}: ${item.caption}`}
                  aria-current={index === photoIndex}
                  className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                    index === photoIndex ? "border-[var(--hg-teal)]" : "border-transparent opacity-70"
                  }`}
                >
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 p-8 md:p-10">
          <div>
            <p className="hg-eyebrow tracking-[0.24em]">
              Featured Property · Ask About Availability
            </p>
            <h3
              id="property-dialog-title"
              className="font-display mt-2 text-3xl font-semibold text-[var(--hg-ink)] md:text-4xl"
            >
              {property.name}
            </h3>
            <p className="mt-4 leading-relaxed text-[var(--hg-muted)]">{property.description}</p>
          </div>

          {facts.length > 0 && (
            <dl className="grid grid-cols-2 gap-3">
              {facts.map((fact) => (
                <div key={fact.label} className="rounded-xl border border-[var(--hg-line)] px-4 py-3">
                  <dt className="text-xs uppercase tracking-[0.18em] text-[var(--hg-teal-ui)]">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {property.highlights && property.highlights.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] text-[var(--hg-teal-ui)]">Highlights</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {property.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="rounded-full border border-[var(--hg-line)] px-3 py-1.5 text-xs text-[var(--hg-muted)]"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {property.features && property.features.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] text-[var(--hg-teal-ui)]">
                Shown in the photographs
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-[var(--hg-muted)]">
                {property.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span aria-hidden="true" className="text-[var(--hg-teal)]">—</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-4 border-t border-[var(--hg-line)] pt-6">
            <button
              type="button"
              onClick={() => onInquire(property)}
              className="hg-btn-primary rounded-full px-6 py-3 text-sm font-semibold"
            >
              Request a tour of this home
            </button>
            <button
              type="button"
              onClick={onClose}
              className="hg-btn-outline-dark rounded-full px-6 py-3 text-sm font-semibold"
            >
              Keep browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

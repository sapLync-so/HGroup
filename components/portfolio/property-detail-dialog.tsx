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
        className="absolute inset-0 bg-[#1a1614]/70 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-dialog-title"
        className="pp-dialog relative grid max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-[2rem] bg-[#f7f3ec] md:grid-cols-2 md:rounded-[2rem]"
      >
        <div className="relative">
          <div className="relative aspect-[4/3] bg-[#1a1614] md:aspect-auto md:h-full md:min-h-[32rem]">
            {photo && (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-center"
              />
            )}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-[#1a1614]/80 px-4 py-2 text-sm font-semibold text-[#f7f3ec] backdrop-blur-sm hover:bg-[#1a1614]"
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
                    index === photoIndex ? "border-[#e2b65a]" : "border-transparent opacity-70"
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
            <p className="text-xs uppercase tracking-[0.24em] text-[#8a7040]">
              Featured Property · Ask About Availability
            </p>
            <h3
              id="property-dialog-title"
              className="font-display mt-2 text-3xl font-semibold md:text-4xl"
            >
              {property.name}
            </h3>
            <p className="mt-4 leading-relaxed text-[#5c534c]">{property.description}</p>
          </div>

          {facts.length > 0 && (
            <dl className="grid grid-cols-2 gap-3">
              {facts.map((fact) => (
                <div key={fact.label} className="rounded-xl border border-[#e6dccb] px-4 py-3">
                  <dt className="text-xs uppercase tracking-[0.18em] text-[#8a7040]">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {property.highlights && property.highlights.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] text-[#8a7040]">Highlights</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {property.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="rounded-full border border-[#e6dccb] px-3 py-1.5 text-xs text-[#5c534c]"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {property.features && property.features.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] text-[#8a7040]">
                Shown in the photographs
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-[#5c534c]">
                {property.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span aria-hidden="true" className="text-[#b8882f]">—</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-4 border-t border-[#e6dccb] pt-6">
            <button
              type="button"
              onClick={() => onInquire(property)}
              className="gold-gradient rounded-full px-6 py-3 text-sm font-semibold text-[#1a1614]"
            >
              Request a tour of this home
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#e6dccb] px-6 py-3 text-sm font-semibold text-[#5c534c] hover:border-[#b8882f]"
            >
              Keep browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

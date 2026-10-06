import type { Property } from "@/lib/properties"
import { Inquiry } from "@/components/inquiry"
import { Reveal } from "./reveal"

export function PortfolioCta({
  properties,
  selectedPropertyId,
}: {
  properties: Property[]
  selectedPropertyId: string | null
}) {
  return (
    <Reveal>
      <div className="bg-[var(--hg-offwhite)] px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <Inquiry
            id="book"
            heading="Request a tour"
            copy="Tell us which home you're interested in and we'll help arrange a tour."
            submitLabel="Request a tour"
            properties={properties}
            selectedPropertyId={selectedPropertyId}
            tone="hgroup"
          />
        </div>
      </div>
    </Reveal>
  )
}

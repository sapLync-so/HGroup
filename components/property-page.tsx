import { galleryPhotos, heroPhotos, stagedPhotos } from "@/lib/gallery"
import { Inquiry } from "@/components/inquiry"
import { PhotoGallery } from "@/components/photo-gallery"
import { ScrollHero } from "@/components/scroll-hero"
import { SiteFooter } from "@/components/site-footer"
import { SiteNav } from "@/components/site-nav"
import { StickyCta } from "@/components/sticky-cta"
import { TurnTour } from "@/components/turn-tour"
import Image from "next/image"

export function PropertyPage() {
  return (
    <div className="bg-[#f7f3ec] text-[#1c1612]">
      <ScrollHero photos={heroPhotos} />
      <SiteNav />
      <main>
        <section id="residence" className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
          <p className="text-xs uppercase tracking-[0.28em] text-[#8a7040]">
            The residence
          </p>
          <h2 className="font-display mt-3 max-w-3xl text-5xl font-semibold md:text-6xl">
            Photographed empty, shown in order
          </h2>
          <div className="mt-8 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-start">
            <p className="max-w-2xl text-lg leading-relaxed text-[#5c534c]">
              These frames come from the supplied photographs of a brick
              residence. The set includes the facade, a yellow door marked 2,
              empty rooms with gray walls and wood-look floors, a white
              kitchen, a bath with marble-pattern tile, and a laundry room.
              Duplicate angles, screenshots, and frames with people were left
              out. Each file was rotated upright and sharpened at its original
              resolution.
            </p>
            <ul className="space-y-4 text-sm text-[#5c534c]">
              <li className="border-t border-[#e6dccb] pt-4">
                Facade photographs stay in shooting order so the building does
                not jump.
              </li>
              <li className="border-t border-[#e6dccb] pt-4">
                Room frames used in the tour are landscape and share the same
                framing.
              </li>
              <li className="border-t border-[#e6dccb] pt-4">
                Furniture appears only in the staged section, and it is labeled
                as a preview.
              </li>
            </ul>
          </div>
        </section>

        <section id="staged" className="bg-[#1a1614] py-20 text-[#f7f3ec] md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <p className="text-xs uppercase tracking-[0.28em] text-[#e2b65a]">
              Virtually staged
            </p>
            <h2 className="font-display mt-3 text-5xl font-semibold md:text-6xl">
              Furnished as a preview
            </h2>
            <p className="mt-4 max-w-2xl text-[#f7f3ec]/75">
              The furniture in these three views was added for the page. The
              walls, windows, doors, fan, cabinets, and floors follow the
              empty photographs. The residence was not photographed furnished.
            </p>
            <ul className="mt-12 grid gap-8 lg:grid-cols-3">
              {stagedPhotos.map((photo) => (
                <li key={photo.src}>
                  <div className="relative aspect-video overflow-hidden rounded-[1.5rem]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-[#e2b65a]">
                    Preview
                  </p>
                  <h3 className="font-display mt-1 text-3xl">{photo.caption}</h3>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="portfolio" className="mx-auto max-w-7xl px-6 py-20 md:px-12">
          <p className="text-xs uppercase tracking-[0.28em] text-[#8a7040]">
            Gallery
          </p>
          <h2 className="font-display mt-3 text-5xl font-semibold">
            The photographs
          </h2>
          <p className="mt-4 max-w-2xl text-[#5c534c]">
            {galleryPhotos.length} photographs kept from the supplied sets.
            Select one to view it larger.
          </p>
          <div className="mt-12">
            <PhotoGallery photos={galleryPhotos} />
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <TurnTour />
          <Inquiry />
        </div>
      </main>
      <SiteFooter />
      <StickyCta />
    </div>
  )
}

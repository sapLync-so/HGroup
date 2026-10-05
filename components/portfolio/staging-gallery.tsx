import Image from "next/image"
import type { GalleryPhoto } from "@/lib/gallery"
import { Reveal } from "./reveal"

export function StagingGallery({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) return null

  return (
    <section id="staged" className="border-t border-[#e6dccb] bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-[#8a7040]">
            Visualization
          </p>
          <h2 className="font-display mt-3 text-4xl font-semibold md:text-6xl">
            See how it could live
          </h2>
          <p className="mt-4 max-w-2xl text-[#5c534c]">
            These rooms are virtually staged to show one possible arrangement.
            The furniture is not in the home — the residence is rented as
            photographed in the property gallery.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {photos.map((photo, index) => (
            <Reveal key={photo.src} delay={index * 100}>
              <figure className="overflow-hidden rounded-[1.5rem] border border-[#e6dccb]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover object-center"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#1a1614]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#e2b65a] backdrop-blur-sm">
                    Virtual staging
                  </span>
                </div>
                <figcaption className="bg-[#f7f3ec] px-5 py-4 text-sm text-[#5c534c]">
                  {photo.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

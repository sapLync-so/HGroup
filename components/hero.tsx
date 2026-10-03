import Image from "next/image"
import type { GalleryPhoto } from "@/lib/gallery"

export function Hero({ photo }: { photo: GalleryPhoto }) {
  return (
    <section className="bg-[#f6f4f1]">
      <div className="relative h-[70vh] min-h-[22rem] bg-neutral-200">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="px-6 py-8 text-neutral-950 sm:px-10">
        <p className="text-xs uppercase tracking-[0.22em]">H Group</p>
        <h1 className="mt-2 max-w-xl text-4xl font-medium tracking-tight sm:text-6xl">
          Photographs
        </h1>
        <p className="mt-3 max-w-lg text-sm text-neutral-600 sm:text-base">
          Still photographs from the supplied set. No address, price, or room
          count is shown, because none was provided.
        </p>
      </div>
    </section>
  )
}

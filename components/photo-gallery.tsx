"use client"

import { useState } from "react"
import Image from "next/image"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import type { GalleryPhoto } from "@/lib/gallery"

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [index, setIndex] = useState(-1)

  return (
    <>
      <ul className="columns-1 gap-6 sm:columns-2">
        {photos.map((photo, photoIndex) => (
          <li key={photo.src} className="mb-6 break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(photoIndex)}
              className="block w-full text-left"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="h-auto w-full"
              />
              <span className="font-display mt-3 block text-xl">
                {photo.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={photos.map((photo) => ({
          src: photo.src,
          alt: photo.alt,
          width: photo.width,
          height: photo.height,
        }))}
      />
    </>
  )
}

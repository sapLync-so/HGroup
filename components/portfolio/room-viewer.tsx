"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import type { PhotoRoom } from "@/lib/properties"
import { Reveal } from "./reveal"

export function RoomViewer({
  rooms,
  propertyName,
}: {
  rooms: PhotoRoom[]
  propertyName: string
}) {
  const [room, setRoom] = useState(0)
  const [frame, setFrame] = useState(0)
  const drag = useRef<{ x: number; frame: number } | null>(null)

  if (rooms.length === 0) return null

  const active = rooms[room] ?? rooms[0]
  const photo = active.frames[frame] ?? active.frames[0]

  function selectRoom(nextRoom: number) {
    setRoom(nextRoom)
    setFrame(0)
  }

  function move(delta: number) {
    setFrame((current) => {
      const count = active.frames.length
      return (current + delta + count) % count
    })
  }

  return (
    <section id="tour" className="border-t border-[var(--hg-line)] bg-[var(--hg-offwhite)] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal>
          <p className="hg-eyebrow">Tour</p>
          <h2 className="font-display mt-3 text-4xl font-semibold text-[var(--hg-ink)] md:text-6xl">
            Walk the rooms
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--hg-muted)]">
            {propertyName}, photographed in sequence. Drag sideways or use the
            arrows — every frame is a real photograph of the home as it stands.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Rooms">
            {rooms.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={itemIndex === room}
                onClick={() => selectRoom(itemIndex)}
                className={`rounded-full px-4 py-2 text-sm ${
                  itemIndex === room
                    ? "hg-btn-primary font-semibold"
                    : "border border-[var(--hg-line)] text-[var(--hg-muted)] hover:border-[var(--hg-teal-ui)]"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          <div
            className="relative mt-6 aspect-[4/5] cursor-ew-resize select-none overflow-hidden rounded-[2rem] bg-[var(--hg-charcoal)] md:aspect-[16/10]"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              drag.current = { x: event.clientX, frame }
            }}
            onPointerMove={(event) => {
              if (!drag.current) return
              const delta = event.clientX - drag.current.x
              const steps = Math.trunc(delta / 48)
              if (steps === 0) return
              const count = active.frames.length
              const next = (drag.current.frame + steps + count * 8) % count
              setFrame(next)
            }}
            onPointerUp={() => {
              drag.current = null
            }}
            onPointerCancel={() => {
              drag.current = null
            }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 1100px, 100vw"
              className="object-cover object-center"
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">
                Photo {frame + 1} of {active.frames.length}
              </p>
              <p className="font-display mt-1 text-3xl">{active.title}</p>
              <p className="mt-1 max-w-xl text-sm text-white/80">{active.detail}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label={`Previous photo of ${active.title}`}
              className="rounded-full border border-[var(--hg-line)] px-4 py-2 text-sm hover:border-[var(--hg-teal-ui)]"
            >
              Previous photo
            </button>
            <p className="text-sm text-[var(--hg-muted)]" aria-live="polite">
              {frame + 1} of {active.frames.length}
            </p>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label={`Next photo of ${active.title}`}
              className="rounded-full border border-[var(--hg-line)] px-4 py-2 text-sm hover:border-[var(--hg-teal-ui)]"
            >
              Next photo
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

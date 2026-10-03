"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { turns } from "@/lib/gallery"

export function TurnTour() {
  const [room, setRoom] = useState(0)
  const [frame, setFrame] = useState(0)
  const drag = useRef<{ x: number; frame: number } | null>(null)
  const active = turns[room]
  const photo = active.frames[frame] ?? active.frames[0]
  const degrees =
    active.frames.length > 1
      ? Math.round((frame / (active.frames.length - 1)) * 360)
      : 0

  function selectRoom(nextRoom: number) {
    setRoom(nextRoom)
    setFrame(0)
  }

  function move(delta: number) {
    setFrame((current) => {
      const count = turns[room].frames.length
      return (current + delta + count) % count
    })
  }

  return (
    <section id="tour" className="border-t border-[#e6dccb] py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-[#8a7040]">Tour</p>
      <h2 className="font-display mt-3 text-4xl font-semibold md:text-6xl">
        Turn through the photographs
      </h2>
      <p className="mt-4 max-w-2xl text-[#5c534c]">
        Drag sideways, or use the arrows. Each stop is a real photograph,
        centered in the frame. This is not a stitched 360 panorama.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {turns.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectRoom(itemIndex)}
            className={`rounded-full px-4 py-2 text-sm ${
              itemIndex === room
                ? "gold-gradient font-semibold text-[#1a1614]"
                : "border border-[#e6dccb] text-[#5c534c]"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div
        className="relative mt-6 aspect-[4/5] cursor-ew-resize overflow-hidden rounded-[2rem] bg-[#1a1614] select-none md:aspect-[16/10]"
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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-[#f7f3ec]">
          <p className="text-xs uppercase tracking-[0.28em] text-[#f7f3ec]/70">
            {degrees}°
          </p>
          <p className="font-display mt-1 text-3xl">{active.title}</p>
          <p className="mt-1 max-w-xl text-sm text-[#f7f3ec]/80">{active.detail}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => move(-1)}
          className="rounded-full border border-[#e6dccb] px-4 py-2 text-sm"
        >
          Turn left
        </button>
        <p className="text-sm text-[#5c534c]">
          {frame + 1} of {active.frames.length}
        </p>
        <button
          type="button"
          onClick={() => move(1)}
          className="rounded-full border border-[#e6dccb] px-4 py-2 text-sm"
        >
          Turn right
        </button>
      </div>
    </section>
  )
}

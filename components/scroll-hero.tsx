"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowDown } from "lucide-react"
import type { GalleryPhoto } from "@/lib/gallery"

export function ScrollHero({ photos }: { photos: GalleryPhoto[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let frame = 0
    const update = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(scrollable, 0))
      const nextProgress = scrollable > 0 ? scrolled / scrollable : 0
      const nextIndex = Math.min(
        photos.length - 1,
        Math.floor(nextProgress * photos.length),
      )
      setProgress(nextProgress)
      setIndex(nextIndex)
      frame = 0
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [photos.length])

  const stage = progress < 0.28 ? 0 : progress < 0.62 ? 1 : 2
  const fade = (active: boolean) =>
    `transition-all duration-700 ease-out ${
      active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
    }`

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative h-[320vh] bg-[#1a1614] motion-reduce:h-auto"
      aria-label="Scroll through the residence"
    >
      <div className="sticky top-0 h-screen overflow-hidden motion-reduce:relative motion-reduce:h-[80vh]">
        <div
          className="scroll-stage absolute inset-0"
          style={{
            transform: `perspective(1400px) rotateX(${(0.5 - progress) * 5}deg) scale(1.05)`,
          }}
        >
          {photos.map((item, itemIndex) => (
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt}
              fill
              priority={itemIndex < 2}
              sizes="100vw"
              className={`object-cover object-center transition-opacity duration-500 ${
                itemIndex === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/75" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 text-[#f7f3ec] md:px-12">
          <a href="#home" className="font-display text-2xl font-semibold tracking-wide md:text-3xl">
            H <span className="gold-text">Group</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a href="#residence" className="hover:text-[#e2b65a]">
              Residence
            </a>
            <a href="#staged" className="hover:text-[#e2b65a]">
              Staged
            </a>
            <a href="#portfolio" className="hover:text-[#e2b65a]">
              Gallery
            </a>
            <a href="#tour" className="hover:text-[#e2b65a]">
              Tour
            </a>
          </nav>
          <a
            href="#book"
            className="gold-gradient rounded-full px-5 py-2 text-sm font-semibold text-[#1a1614]"
          >
            Inquire
          </a>
        </div>

        <div className="absolute inset-x-0 bottom-[8vh] z-10 h-56 px-6 text-[#f7f3ec] md:h-64 md:px-12">
          <div className={`absolute inset-x-6 text-center md:inset-x-12 ${fade(stage === 0)}`}>
            <p className="text-xs uppercase tracking-[0.28em] text-[#f7f3ec]/80">
              H Group Associates & Investors
            </p>
            <h1 className="font-display mt-4 text-5xl font-semibold leading-[1.05] md:text-7xl">
              A brick residence,
              <br />
              <span className="gold-text">offered for rent</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[#f7f3ec]/85">
              Scroll to walk the photographs. The rooms were empty when they
              were taken.
            </p>
          </div>
          <div className={`absolute inset-x-6 mx-auto grid max-w-2xl grid-cols-3 gap-6 text-center md:inset-x-12 ${fade(stage === 1)}`}>
            {[
              ["Brick", "Facade"],
              [String(photos.length), "Frames"],
              ["Empty", "When photographed"],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="font-display text-3xl font-semibold md:text-5xl">
                  <span className="gold-text">{value}</span>
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest text-[#f7f3ec]/70">
                  {label}
                </div>
              </div>
            ))}
          </div>
          <div className={`absolute inset-x-6 mx-auto flex max-w-xl flex-col items-center text-center md:inset-x-12 ${fade(stage === 2)}`}>
            <p className="text-lg text-[#f7f3ec]/90">
              Turn through the rooms below, then leave an inquiry on this page.
            </p>
            <a
              href="#tour"
              className="gold-gradient mt-5 rounded-full px-8 py-3 text-sm font-semibold text-[#1a1614]"
            >
              Open the tour
            </a>
          </div>
        </div>

        <div
          className={`absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[#f7f3ec]/80 transition-opacity ${
            progress < 0.04 ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em]">
            <span>Scroll</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>

        <div className="absolute top-1/2 right-4 z-10 hidden h-40 w-1 -translate-y-1/2 overflow-hidden rounded-full bg-[#f7f3ec]/20 md:block">
          <div className="gold-gradient w-full" style={{ height: `${progress * 100}%` }} />
        </div>
      </div>
    </section>
  )
}

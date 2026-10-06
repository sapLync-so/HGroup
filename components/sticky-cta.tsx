"use client"

import { useEffect, useState } from "react"

export function StickyCta({
  className,
  label = "Inquire",
}: {
  className?: string
  label?: string
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const book = document.getElementById("book")
      const bookTop = book ? book.getBoundingClientRect().top : Number.POSITIVE_INFINITY
      const bookBottom = book
        ? bookTop + book.offsetHeight
        : Number.POSITIVE_INFINITY
      const pastHero = window.scrollY > window.innerHeight
      const bookVisible = bookTop < window.innerHeight && bookBottom > 0
      setShow(pastHero && !bookVisible)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl justify-end">
        <a
          href="#book"
          className={
            className ??
            "gold-gradient rounded-full px-5 py-3 text-sm font-semibold text-[#1a1614] shadow-lg"
          }
        >
          {label}
        </a>
      </div>
    </div>
  )
}

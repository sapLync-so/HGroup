"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const links = [
  { label: "Properties", href: "#properties" },
  { label: "Staging", href: "#staged" },
]

export function PortfolioNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-[var(--hg-line-dark)] bg-[var(--hg-black)]/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-12">
        <a href="#top" aria-label="H Group Associates & Investors — back to top">
          <Image
            src="/brand/hgroup-logo-dark-bg.png"
            alt="H Group Associates & Investors"
            width={550}
            height={292}
            priority
            className="h-10 w-auto md:h-12"
          />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Portfolio sections">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hg-link-dark text-sm text-white/85">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#book"
          className="hg-btn-primary rounded-full px-5 py-2 text-sm font-semibold"
        >
          Request a Tour
        </a>
      </div>
      {scrolled && (
        <nav
          className="mx-auto flex max-w-7xl items-center gap-6 px-6 pb-3 md:hidden"
          aria-label="Portfolio sections"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hg-link-dark text-xs text-white/85">
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

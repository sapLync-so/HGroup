"use client"

import { useEffect, useState } from "react"

const links = [
  { label: "Residence", href: "#residence" },
  { label: "Staged", href: "#staged" },
  { label: "Gallery", href: "#portfolio" },
  { label: "Tour", href: "#tour" },
]

export function SiteNav() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("home")
      if (!hero) return
      const threshold = hero.offsetTop + hero.offsetHeight - window.innerHeight
      setShow(window.scrollY > threshold)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-[#e6dccb] bg-[#f7f3ec]/80 backdrop-blur-md transition-transform duration-500 ${
        show ? "translate-y-0" : "pointer-events-none -translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-12">
        <a href="#home" className="font-display text-2xl font-semibold">
          H <span className="gold-text">Group</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-[#b8882f]">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#book"
          className="gold-gradient rounded-full px-5 py-2 text-sm font-semibold text-[#1a1614]"
        >
          Inquire
        </a>
      </div>
    </header>
  )
}

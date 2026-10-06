import Image from "next/image"

const links = [
  { label: "Properties", href: "#properties" },
  { label: "Staging", href: "#staged" },
  { label: "Request a Tour", href: "#book" },
]

export function PortfolioFooter() {
  return (
    <footer className="border-t border-[var(--hg-line-dark)] bg-[var(--hg-black)] text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-14 md:flex-row md:px-12">
        <div>
          <a href="#top" aria-label="H Group Associates & Investors — back to top">
            <Image
              src="/brand/hgroup-logo-dark-bg.png"
              alt="H Group Associates & Investors"
              width={550}
              height={292}
              className="h-12 w-auto md:h-14"
            />
          </a>
          <p className="mt-4 max-w-sm text-white/70">
            A portfolio of rental homes, shown as they stand. Photographs are of
            the actual properties; staged previews are always labeled.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-white/70">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hg-link-dark">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

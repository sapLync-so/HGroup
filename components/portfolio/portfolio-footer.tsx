const links = [
  { label: "Properties", href: "#properties" },
  { label: "Staging", href: "#staged" },
  { label: "Request a tour", href: "#book" },
]

export function PortfolioFooter() {
  return (
    <footer className="bg-[#1a1614] text-[#f7f3ec]">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-14 md:flex-row md:px-12">
        <div>
          <a href="#top" className="font-display text-4xl font-semibold">
            H <span className="gold-text">Group</span>
            <span className="ml-2 text-base font-normal uppercase tracking-[0.2em] text-[#e2b65a]">
              Rentals
            </span>
          </a>
          <p className="mt-4 max-w-sm text-[#f7f3ec]/70">
            A portfolio of rental homes, shown as they stand. Photographs are of
            the actual properties; staged previews are always labeled.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-[#f7f3ec]/70">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-[#e2b65a]">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

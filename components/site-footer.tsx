const links = [
  { label: "Residence", href: "#residence" },
  { label: "Staged", href: "#staged" },
  { label: "Gallery", href: "#portfolio" },
  { label: "Tour", href: "#tour" },
  { label: "Inquire", href: "#book" },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#1a1614] text-[#f7f3ec]">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-14 md:flex-row md:px-12">
        <div>
          <a href="#home" className="font-display text-4xl font-semibold">
            H <span className="gold-text">Group</span>
          </a>
          <p className="mt-4 max-w-sm text-[#f7f3ec]/70">
            H Group Associates & Investors. The photographs show a brick
            residence offered for rent. Staged furniture is a preview.
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

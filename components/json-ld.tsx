import {
  BUSINESS_BRAND_NAME,
  BUSINESS_EMAIL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site"

/** Organization + WebSite JSON-LD using only on-site facts (see lib/site.ts for TODOs). */
export function JsonLd() {
  const organizationId = `${SITE_URL}/#organization`
  const websiteId = `${SITE_URL}/#website`

  const graph = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: BUSINESS_BRAND_NAME,
      url: SITE_URL,
      email: BUSINESS_EMAIL,
      logo: absoluteUrl("/brand/hgroup-logo-dark-bg.png"),
      description:
        "A portfolio of rental homes, shown as they stand. Photographs are of the actual properties; staged previews are always labeled.",
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
      publisher: { "@id": organizationId },
    },
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

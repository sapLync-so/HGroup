/**
 * Site-wide SEO / structured-data configuration.
 * Fill TODO values with client-approved facts before treating JSON-LD as complete.
 */

const DEFAULT_SITE_URL = "https://hgroup.rentals"

/** Canonical production URL (no trailing slash). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || DEFAULT_SITE_URL
) as `https://${string}` | `http://${string}`

/** True when this deployment should be indexed (production custom domain). */
export const isProductionSite =
  process.env.VERCEL_ENV === "production" ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production")

/** TODO(daniylle): Confirm legal / display name for schema and legal footers. */
export const BUSINESS_LEGAL_NAME =
  "TODO: confirm legal name (e.g. H Group Rentals vs H Group Associates & Investors)"

/** Name used in visible site copy and branding. */
export const BUSINESS_BRAND_NAME = "H Group Associates & Investors"

/** Public inquiry email (also used server-side for tour requests). */
export const BUSINESS_EMAIL = "info@hgroup.rentals"

/** TODO(daniylle): Add a public phone number when the client wants it on the site. */
export const BUSINESS_PHONE: string | null = null

/** TODO(daniylle): Complete mailing address for LocalBusiness / NAP consistency. */
export const BUSINESS_ADDRESS = {
  streetAddress: "TODO: street address",
  addressLocality: "TODO: city",
  addressRegion: "TODO: state code",
  postalCode: "TODO: ZIP",
  addressCountry: "US",
} as const

/** TODO(daniylle): Cities or region where H Group offers rental homes. */
export const SERVICE_AREA_DESCRIPTION =
  "TODO: confirm rental service area (city, county, or state)"

export const SITE_DESCRIPTION =
  "Explore H Group's rental-home portfolio through real photography: the featured brick residence, room-by-room views, and a clear path to request a tour."

export const SITE_TITLE =
  "H Group Rentals — Homes for rent, shown as they stand"

/** Hero image used for Open Graph / Twitter previews (existing gallery asset). */
export const OG_IMAGE = {
  path: "/media/hero/refined-urban-rowhouse-facade-105.png",
  width: 1086,
  height: 1448,
  alt: "Daylight view of the brick rowhouse facade marked 105, with white window trim and entrance railings.",
} as const

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

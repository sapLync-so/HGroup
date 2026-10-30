import { NextResponse } from "next/server"
import {
  BUSINESS_BRAND_NAME,
  BUSINESS_EMAIL,
  SERVICE_AREA_DESCRIPTION,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site"

export function GET() {
  const body = `# ${BUSINESS_BRAND_NAME}

> ${SITE_DESCRIPTION}

## About
${BUSINESS_BRAND_NAME} publishes rental homes with authentic photography, room-by-room views, and virtually staged previews that are always labeled. Prospective residents can explore properties online and request a private tour.

## Service area
${SERVICE_AREA_DESCRIPTION}

## Contact
- Email: ${BUSINESS_EMAIL}
- Tour requests: ${SITE_URL}/#book

## Key pages
- Home / portfolio: ${SITE_URL}/
- Featured listing: "The Brick Residence" — brick exterior, yellow entry, white kitchen, marble-pattern bath (see ${SITE_URL}/#properties)

## Crawling
- Sitemap: ${SITE_URL}/sitemap.xml
- robots.txt: ${SITE_URL}/robots.txt

## Site title
${SITE_TITLE}
`

  return new NextResponse(body.trim() + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}

import { galleryPhotos, heroPhotos, stagedPhotos, turns, type GalleryPhoto } from "./gallery"

export type PhotoRoom = { id: string; title: string; detail: string; frames: GalleryPhoto[] }
export type Property = {
  id: string
  name: string
  description: string
  inquiryReference: string
  location?: string
  availability?: "unknown" | "available" | "unavailable"
  bedrooms?: number
  bathrooms?: number
  rent?: { amount: number; currency: string; period: string }
  features?: string[]
  highlights?: string[]
  heroImage?: GalleryPhoto
  gallery?: GalleryPhoto[]
  video?: { src: string; poster?: string; label: string }
  virtualTour?: { kind: "photo-sequence"; rooms: PhotoRoom[] }
  stagedGallery?: GalleryPhoto[]
  featured?: boolean
}

export const properties: Property[] = [{
  id: "property-01",
  name: "The Brick Residence",
  description: "A brick exterior. A yellow door. A place to make your own. Take a closer look at the rooms, white kitchen and marble-pattern bath in our featured H Group residence.",
  inquiryReference: "HGR-01",
  availability: "unknown",
  featured: true,
  heroImage: heroPhotos[0],
  gallery: galleryPhotos,
  highlights: ["A distinctive yellow entry", "White kitchen cabinetry", "Wood-look flooring"],
  features: ["Brick exterior", "Gray interiors", "Marble-pattern bathroom tile", "Laundry room shown in gallery"],
  virtualTour: { kind: "photo-sequence", rooms: turns },
  stagedGallery: stagedPhotos,
}]

export function propertyFacts(property: Property): { label: string; value: string }[] {
  const facts = []
  if (property.bedrooms !== undefined) facts.push({ label: "Bedrooms", value: property.bedrooms === 0 ? "Studio" : String(property.bedrooms) })
  if (property.bathrooms !== undefined) facts.push({ label: "Bathrooms", value: String(property.bathrooms) })
  if (property.rent) facts.push({ label: "Rent", value: `${new Intl.NumberFormat("en-US", { style: "currency", currency: property.rent.currency, maximumFractionDigits: 0 }).format(property.rent.amount)} / ${property.rent.period}` })
  return facts
}

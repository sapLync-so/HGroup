import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { test } from "node:test"

test("portfolio exports one real property with neutral availability and no invented facts", async () => {
  const path = new URL("../lib/properties.ts", import.meta.url)
  assert.ok(existsSync(path), "Missing reusable property model")
  const { properties } = await import(path.href)
  assert.equal(properties.length, 1)
  const property = properties[0]
  assert.equal(property.id, "property-01")
  assert.equal(property.name, "The Brick Residence")
  assert.equal(property.availability, "unknown")
  for (const field of ["rent", "bedrooms", "bathrooms", "location", "video"]) {
    assert.equal(property[field], undefined, `${field} must not be fabricated`)
  }
  assert.equal(new Set(properties.map((p: { id: string }) => p.id)).size, properties.length)
})

test("Property 01 reuses existing actual photography and labels staging separately", async () => {
  const path = new URL("../lib/properties.ts", import.meta.url)
  assert.ok(existsSync(path), "Missing reusable property model")
  const { properties } = await import(path.href)
  const p = properties[0]
  const { galleryPhotos, heroPhotos } = await import(new URL("../lib/gallery.ts", import.meta.url).href)
  assert.equal(p.heroImage.src, "/media/hero/refined-urban-rowhouse-facade-105.png")
  assert.deepEqual(p.gallery.slice(0, 2).map((image: { src: string }) => image.src), [
    "/media/hero/refined-urban-rowhouse-facade-105.png",
    "/media/hero/urban-rowhouse-entrance-at-105.png",
  ])
  assert.deepEqual(p.gallery.slice(2), galleryPhotos)
  assert.equal(heroPhotos[0].src, "/media/hero/facade-dusk.jpg")
  assert.equal(p.gallery.length, 14)
  assert.equal(p.stagedGallery.length, 3)
  assert.equal(p.virtualTour.kind, "photo-sequence")
  const images = [p.heroImage, ...p.gallery, ...p.stagedGallery, ...p.virtualTour.rooms.flatMap((room: { frames: unknown[] }) => room.frames)]
  for (const image of images) {
    assert.ok(existsSync(new URL(`../public${image.src}`, import.meta.url)), image.src)
    assert.ok(image.alt && image.width > 0 && image.height > 0)
  }
  assert.ok(p.gallery.every((image: { src: string }) => !image.src.includes("/staged/")))
})

test("property facts omit unknown values and preserve legitimate zero bedroom counts", async () => {
  const path = new URL("../lib/properties.ts", import.meta.url)
  assert.ok(existsSync(path), "Missing reusable property model")
  const { propertyFacts, properties } = await import(path.href)
  assert.deepEqual(propertyFacts(properties[0]), [])
  assert.deepEqual(propertyFacts({ ...properties[0], bedrooms: 0, bathrooms: 1 }), [
    { label: "Bedrooms", value: "Studio" }, { label: "Bathrooms", value: "1" },
  ])
})

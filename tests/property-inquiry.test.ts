import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { test } from "node:test"

async function formatter() {
  const path = new URL("../lib/property-inquiry.ts", import.meta.url)
  assert.ok(existsSync(path), "Missing property-aware inquiry formatter")
  return (await import(path.href)).propertyInquiryNote
}

const property = { id: "property-01", name: "The Brick Residence", inquiryReference: "HGR-01" }

test("inquiry includes the chosen home's reference and name without changing the API fields", async () => {
  const format = await formatter()
  assert.equal(format("Please arrange a visit.", property), "Property: The Brick Residence [HGR-01]\n\nPlease arrange a visit.")
})

test("general inquiry stays unprefixed", async () => {
  const format = await formatter()
  assert.equal(format("  Just looking  "), "Just looking")
  assert.equal(format(""), "")
})

test("long inquiry preserves property reference within the existing 2000 character limit", async () => {
  const format = await formatter()
  const result = format("x".repeat(3000), property)
  assert.equal(result.length, 2000)
  assert.ok(result.startsWith("Property: The Brick Residence [HGR-01]"))
})

test("changing properties uses only the new reference", async () => {
  const format = await formatter()
  const next = { id: "fixture-02", name: "Test fixture", inquiryReference: "TEST-02" }
  assert.ok(format("Tour request", next).includes("TEST-02"))
  assert.ok(!format("Tour request", next).includes("HGR-01"))
})

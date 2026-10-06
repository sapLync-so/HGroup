import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

type RGB = [number, number, number]

function hexToRgb(hex: string): RGB {
  const value = hex.replace("#", "")
  assert.equal(value.length, 6, `expected 6-digit hex, got ${hex}`)
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ]
}

function channel(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function luminance([r, g, b]: RGB): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrast(fg: string, bg: string): number {
  const l1 = luminance(hexToRgb(fg))
  const l2 = luminance(hexToRgb(bg))
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

const pairs: Array<[string, string, number, string]> = [
  ["#FFFFFF", "#197A83", 4.5, "white on teal-ui buttons"],
  ["#FFFFFF", "#146770", 4.5, "white on teal-ui-hover buttons"],
  ["#D7A332", "#080A0A", 4.5, "gold eyebrow on black"],
  ["#4A5052", "#F7F6F2", 4.5, "muted text on offwhite"],
  ["#4A5052", "#FFFFFF", 4.5, "muted text on white"],
  ["#171A1A", "#F7F6F2", 7, "ink body text on offwhite"],
  ["#197A83", "#F7F6F2", 4.5, "teal-ui labels on offwhite"],
  ["#197A83", "#FFFFFF", 4.5, "teal-ui labels on white"],
  ["#FFFFFF", "#080A0A", 7, "white on black"],
]

for (const [fg, bg, min, label] of pairs) {
  test(`contrast ${label}: ${fg} on ${bg} >= ${min}`, () => {
    const ratio = contrast(fg, bg)
    assert.ok(
      ratio >= min,
      `${label}: contrast ${ratio.toFixed(2)}:1 is below required ${min}:1`,
    )
  })
}

test("brand tokens in portfolio-preview.css carry the tested hex values", () => {
  const css = readFileSync(
    new URL("../app/portfolio-preview/portfolio-preview.css", import.meta.url),
    "utf8",
  )
  const hexes = new Set(pairs.flatMap(([fg, bg]) => [fg, bg]))
  for (const hex of hexes) {
    assert.ok(css.includes(hex), `portfolio-preview.css is missing token ${hex}`)
  }
})

export type GalleryPhoto = {
  src: string
  alt: string
  caption: string
  width: number
  height: number
  staged?: boolean
}

function photo(
  src: string,
  alt: string,
  caption: string,
  width: number,
  height: number,
  staged = false,
): GalleryPhoto {
  return { src, alt, caption, width, height, staged }
}

function series(
  folder: string,
  count: number,
  caption: string,
  alt: string,
  width = 1536,
  height = 2048,
): GalleryPhoto[] {
  return Array.from({ length: count }, (_, index) =>
    photo(
      `/media/turns/${folder}/${String(index + 1).padStart(2, "0")}.jpg`,
      `${alt}, frame ${index + 1} of ${count}`,
      caption,
      width,
      height,
    ),
  )
}

export const heroPhotos: GalleryPhoto[] = [
  photo(
    "/media/hero/facade-dusk.jpg",
    "Brick residence at dusk, with a for-rent sign in a first-floor window.",
    "Facade",
    1536,
    2048,
  ),
  photo(
    "/media/hero/front-entry.jpg",
    "The same brick residence after dark, with front steps and utility meters.",
    "Facade",
    1536,
    2048,
  ),
  photo(
    "/media/hero/yellow-door.jpg",
    "Yellow entry door marked 2, set in a gray hall.",
    "Unit 2",
    1536,
    2048,
  ),
  photo(
    "/media/hero/living-wide.jpg",
    "Empty living room facing two windows, with a ceiling fan and baseboard heat.",
    "Living room",
    2048,
    1536,
  ),
  photo(
    "/media/hero/living-corner.jpg",
    "Empty living room from the corner, with two windows and a white door.",
    "Living room",
    2048,
    1536,
  ),
  photo(
    "/media/hero/living-fan.jpg",
    "Empty room with a ceiling fan, a white door, and the edge of a window.",
    "Living room",
    1536,
    2048,
  ),
  photo(
    "/media/hero/living-windows.jpg",
    "Empty room with one window, two white doors, and a ceiling fan.",
    "Living room",
    2048,
    1536,
  ),
  photo(
    "/media/hero/laundry.jpg",
    "Empty room with two white doors, gray walls, and a ceiling fan.",
    "Living room",
    2048,
    1536,
  ),
  photo(
    "/media/hero/kitchen.jpg",
    "Kitchen with white cabinets, a refrigerator, a black sink, and a white range.",
    "Kitchen",
    2048,
    1536,
  ),
  photo(
    "/media/hero/bath.jpg",
    "Bathroom with a white tub, marble-pattern tile, and a small window.",
    "Bath",
    1536,
    2048,
  ),
  photo(
    "/media/hero/living-length.jpg",
    "Laundry room with rows of white washers and dryers.",
    "Laundry",
    1536,
    2048,
  ),
]

export const galleryPhotos: GalleryPhoto[] = [
  ...heroPhotos,
  photo(
    "/media/hero/kitchen-sink.jpg",
    "Black double-basin kitchen sink in a light stone counter.",
    "Kitchen sink",
    1536,
    2048,
  ),
]

const laundryFrames = series(
  "laundry",
  7,
  "Laundry",
  "Laundry room photographed while turning",
)
laundryFrames[2] = {
  ...laundryFrames[2],
  width: 2048,
  height: 1536,
}

export const turns: {
  id: string
  title: string
  detail: string
  frames: GalleryPhoto[]
}[] = [
  {
    id: "facade",
    title: "Facade",
    detail: "Consecutive photographs along the front of the building.",
    frames: series(
      "facade",
      8,
      "Facade",
      "Front of the brick residence photographed while moving along the facade",
    ),
  },
  {
    id: "rooms",
    title: "Rooms",
    detail:
      "Landscape frames of the empty rooms, ordered from the window wall toward the doors.",
    frames: [
      heroPhotos[3],
      heroPhotos[4],
      heroPhotos[6],
      heroPhotos[7],
    ],
  },
  {
    id: "laundry",
    title: "Laundry",
    detail: "A turn through the laundry room. One frame is a wider angle.",
    frames: laundryFrames,
  },
  {
    id: "bath",
    title: "Bath",
    detail: "Close views of the tub and marble-pattern tile.",
    frames: series("bath", 7, "Bath", "Bathroom photographed while turning"),
  },
]

export const stagedPhotos: GalleryPhoto[] = [
  photo(
    "/media/staged/living.jpg",
    "Virtually staged living room. The sofa, table, lamp, and rug are not in the residence.",
    "Living room",
    1280,
    720,
    true,
  ),
  photo(
    "/media/staged/bedroom.jpg",
    "Virtually staged bedroom. The bed, nightstand, and rug are not in the residence.",
    "Bedroom",
    1280,
    720,
    true,
  ),
  photo(
    "/media/staged/kitchen.jpg",
    "Virtually staged kitchen. The table, chairs, bowl, and runner are not in the residence.",
    "Kitchen",
    1280,
    720,
    true,
  ),
]

export const heroPhoto = heroPhotos[0]

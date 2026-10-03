import json
import os
import zipfile
from io import BytesIO

from PIL import Image, ImageEnhance, ImageOps

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
work = os.path.join(os.environ["TEMP"], "hgroup-photos")
catalog = json.load(open(os.path.join(work, "catalog.json"), encoding="utf-8"))
photos = catalog["photos"]

sources = {
    "icloud": os.path.join(root, "iCloud Photos.zip"),
    "photo2": os.path.join(root, "photo2.zip"),
    "photos": os.path.join(root, "photos.zip"),
}
zips = {key: zipfile.ZipFile(path) for key, path in sources.items()}
name_to_entry = {}
for key, z in zips.items():
    for info in z.infolist():
        name_to_entry[(key, os.path.basename(info.filename))] = info.filename


def load_index(index: int) -> Image.Image:
    rec = photos[index]
    z = zips[rec["source"]]
    data = z.read(name_to_entry[(rec["source"], rec["name"])])
    im = Image.open(BytesIO(data))
    im = ImageOps.exif_transpose(im).convert("RGB")
    im = ImageOps.autocontrast(im, cutoff=0.4)
    im = ImageEnhance.Color(im).enhance(1.06)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Sharpness(im).enhance(1.18)
    return im


def save(im: Image.Image, path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "JPEG", quality=90, optimize=True, subsampling=1)


hero = [
    (4, "facade-dusk", "Brick residence at dusk, seen from the street.", "Facade"),
    (18, "front-entry", "Front steps, meters, and the entry of the brick residence.", "Entry"),
    (26, "yellow-door", "Yellow entry door opening into a gray hall.", "Entry"),
    (186, "living-corner", "Empty living room with gray walls, a ceiling fan, and windows.", "Living room"),
    (190, "living-length", "Empty living room looking the length of the space.", "Living room"),
    (192, "living-windows", "Empty living room with two windows and a ceiling fan.", "Living room"),
    (197, "living-wide", "Empty living room with wood-look floors and two windows.", "Living room"),
    (199, "living-fan", "Empty living room with a ceiling fan and gray walls.", "Living room"),
    (200, "kitchen", "Kitchen with white cabinets, a range, and wood-look flooring.", "Kitchen"),
    (194, "kitchen-sink", "Black double sink in a light stone counter.", "Kitchen"),
    (185, "bath", "Bathroom with a white tub and marble-pattern tile.", "Bath"),
    (191, "laundry", "Laundry room with white washers and dryers.", "Laundry"),
]

turns = {
    "facade": [16, 17, 18, 19, 20, 21, 22, 23],
    "laundry": [6, 7, 8, 9, 10, 11, 12],
    "bath": [52, 53, 54, 55, 56, 62, 63],
    "living": [186, 190, 192, 197, 199],
}

gallery_extra = [
    (0, "building-side", "Side of the brick residence along the street.", "Facade"),
    (31, "red-door", "Red door at the end of a gray hallway.", "Hall"),
    (34, "bedroom-window", "Empty room with a window, gray walls, and wood-look flooring.", "Bedroom"),
    (44, "closet", "Closet with wire shelves and a hanging rod.", "Closet"),
    (71, "kitchen-run", "Kitchen with white cabinets, a refrigerator, and a sink.", "Kitchen"),
    (96, "bedroom-fan", "Empty bedroom with a ceiling fan and a window.", "Bedroom"),
    (102, "hallway", "Hallway with white doors and gray walls.", "Hall"),
    (117, "kitchen-stove", "Kitchen with a white range and white upper cabinets.", "Kitchen"),
]

manifest = {"hero": [], "turns": {}, "gallery": []}

for index, slug, alt, room in hero:
    im = load_index(index)
    rel = f"media/hero/{slug}.jpg"
    save(im, os.path.join(root, "public", rel.replace("/", os.sep)))
    manifest["hero"].append(
        {
            "src": "/" + rel,
            "alt": alt,
            "caption": room,
            "width": im.width,
            "height": im.height,
            "room": room,
        }
    )
    print("hero", slug, im.size, photos[index]["name"])

for room, indexes in turns.items():
    manifest["turns"][room] = []
    for n, index in enumerate(indexes, start=1):
        im = load_index(index)
        rel = f"media/turns/{room}/{n:02d}.jpg"
        save(im, os.path.join(root, "public", rel.replace("/", os.sep)))
        manifest["turns"][room].append(
            {
                "src": "/" + rel,
                "alt": f"{room} angle {n} of {len(indexes)}",
                "caption": room,
                "width": im.width,
                "height": im.height,
                "room": room,
            }
        )
    print("turn", room, len(indexes))

for index, slug, alt, room in gallery_extra:
    im = load_index(index)
    rel = f"media/gallery/{slug}.jpg"
    save(im, os.path.join(root, "public", rel.replace("/", os.sep)))
    manifest["gallery"].append(
        {
            "src": "/" + rel,
            "alt": alt,
            "caption": room,
            "width": im.width,
            "height": im.height,
            "room": room,
        }
    )

refs = os.path.join(os.environ["TEMP"], "hgroup-refs")
os.makedirs(refs, exist_ok=True)
for index, slug in ((197, "living"), (96, "bedroom"), (200, "kitchen")):
    im = load_index(index)
    path = os.path.join(refs, f"{slug}.jpg")
    save(im, path)
    print("ref", path, im.size)

with open(os.path.join(work, "manifest.json"), "w", encoding="utf-8") as handle:
    json.dump(manifest, handle, indent=2)

for z in zips.values():
    z.close()
print("done", len(manifest["hero"]))

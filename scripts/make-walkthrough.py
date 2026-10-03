"""Assemble iCloud clips into an H Group residence walkthrough."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
CLIPS = ROOT / "icloud videos"
WORK = CLIPS / "_edit"
FRAMES = CLIPS / "_frames"
LOGO_SRC = ROOT / "public" / "h-group-logo.jpeg"
OUT = CLIPS / "H-Group-Residence-Walkthrough.mp4"

W, H = 1080, 1920
FPS = 30
CREAM = (247, 243, 236)
GOLD = (226, 182, 90)
DARK = (26, 22, 20)
MUTED = (245, 241, 234)

FONT_DIR = Path(r"C:\Windows\Fonts")
FONT_DISPLAY = FONT_DIR / "georgia.ttf"
FONT_DISPLAY_B = FONT_DIR / "georgiab.ttf"
FONT_BODY = FONT_DIR / "segoeui.ttf"


def run(cmd: list[str]) -> None:
    print(">", " ".join(str(c) for c in cmd[:8]), "...")
    subprocess.run(cmd, check=True)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    if path.exists():
        return ImageFont.truetype(str(path), size)
    fallback = FONT_DIR / "arial.ttf"
    return ImageFont.truetype(str(fallback), size)


def crop_logo() -> Image.Image:
    im = Image.open(LOGO_SRC).convert("RGB")
    width, height = im.size
    white_rows: list[int] = []
    edge_x = min(24, width - 1)
    for y in range(height):
        r, g, b = im.getpixel((edge_x, y))
        if r > 240 and g > 240 and b > 240:
            white_rows.append(y)
    if not white_rows:
        raise RuntimeError("Could not find the white logo lockup")
    # Longest consecutive near-white run is the middle lockup.
    best: tuple[int, int] = (white_rows[0], white_rows[0])
    run_start = white_rows[0]
    prev = white_rows[0]
    for y in white_rows[1:]:
        if y == prev + 1:
            prev = y
            continue
        if prev - run_start > best[1] - best[0]:
            best = (run_start, prev)
        run_start = y
        prev = y
    if prev - run_start > best[1] - best[0]:
        best = (run_start, prev)
    top = best[0] + 8
    bottom = best[1] - 8
    if bottom <= top:
        top, bottom = best[0], best[1]
    band = im.crop((0, top, width, bottom + 1))
    gray = ImageOps.invert(ImageOps.grayscale(band))
    bbox = gray.point(lambda p: 255 if p > 18 else 0).getbbox()
    if bbox:
        pad = 12
        band = band.crop(
            (
                max(0, bbox[0] - pad),
                max(0, bbox[1] - pad),
                min(band.width, bbox[2] + pad),
                min(band.height, bbox[3] + pad),
            )
        )
    return band


def fit_cover(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(im, size, method=Image.Resampling.LANCZOS)


def darken(im: Image.Image, factor: float = 0.38) -> Image.Image:
    im = ImageEnhance.Brightness(im).enhance(factor)
    overlay = Image.new("RGB", im.size, DARK)
    return Image.blend(im, overlay, 0.35)


def draw_centered(
    draw: ImageDraw.ImageDraw,
    text: str,
    y: int,
    fnt: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
) -> int:
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw = bbox[2] - bbox[0]
    x = (W - tw) // 2
    draw.text((x, y), text, font=fnt, fill=fill)
    return bbox[3] - bbox[1]


def make_cards() -> tuple[Path, Path]:
    WORK.mkdir(parents=True, exist_ok=True)
    bg_src = FRAMES / "IMG_2977_mid.jpg"
    if not bg_src.exists():
        bg_src = FRAMES / "IMG_2976_start.jpg"
    bg = fit_cover(Image.open(bg_src).convert("RGB"), (W, H))
    bg = bg.filter(ImageFilter.GaussianBlur(1.2))
    title_bg = darken(bg, 0.42)

    logo = crop_logo()
    logo_w = 640
    ratio = logo_w / logo.width
    logo = logo.resize((logo_w, int(logo.height * ratio)), Image.Resampling.LANCZOS)

    title = title_bg.copy()
    # Soft vignette
    vignette = Image.new("L", (W, H), 0)
    vdraw = ImageDraw.Draw(vignette)
    vdraw.ellipse((-120, 200, W + 120, H - 80), fill=255)
    vignette = vignette.filter(ImageFilter.GaussianBlur(80))
    darkened = Image.new("RGB", (W, H), DARK)
    title = Image.composite(title, darkened, vignette)

    lx = (W - logo.width) // 2
    ly = 430
    # Place logo on a cream plate so the white lockup stays readable.
    plate = Image.new("RGB", (logo.width + 80, logo.height + 64), CREAM)
    plate.paste(logo, (40, 32))
    title.paste(plate, (lx - 40, ly - 32))

    draw = ImageDraw.Draw(title)
    gold_y = ly + logo.height + 56
    draw.rectangle((W // 2 - 48, gold_y, W // 2 + 48, gold_y + 3), fill=GOLD)
    draw_centered(draw, "RESIDENCE WALKTHROUGH", gold_y + 36, font(FONT_BODY, 34), GOLD)
    draw_centered(draw, "Unit 2", gold_y + 92, font(FONT_DISPLAY, 92), CREAM)
    draw_centered(
        draw,
        "Arrival  ·  Rooms  ·  Kitchen  ·  Bath",
        gold_y + 210,
        font(FONT_BODY, 28),
        MUTED,
    )

    title_path = WORK / "title.png"
    title.save(title_path, quality=95)

    end = Image.new("RGB", (W, H), DARK)
    end.paste(plate, (lx - 40, 620))
    ed = ImageDraw.Draw(end)
    line_y = 620 + plate.height + 48
    ed.rectangle((W // 2 - 48, line_y, W // 2 + 48, line_y + 3), fill=GOLD)
    draw_centered(ed, "Thank you for touring", line_y + 36, font(FONT_DISPLAY, 72), CREAM)
    draw_centered(
        ed,
        "H Group Associates & Investors",
        line_y + 130,
        font(FONT_BODY, 30),
        GOLD,
    )
    draw_centered(
        ed,
        "Inquire to schedule a showing",
        line_y + 186,
        font(FONT_BODY, 30),
        MUTED,
    )

    end_path = WORK / "end.png"
    end.save(end_path, quality=95)
    return title_path, end_path


def still_to_video(png: Path, seconds: float, mp4: Path) -> None:
    run(
        [
            "ffmpeg",
            "-y",
            "-loop",
            "1",
            "-framerate",
            str(FPS),
            "-t",
            f"{seconds:.3f}",
            "-i",
            str(png),
            "-f",
            "lavfi",
            "-t",
            f"{seconds:.3f}",
            "-i",
            "anullsrc=channel_layout=stereo:sample_rate=48000",
            "-vf",
            f"fade=t=in:st=0:d=0.6,fade=t=out:st={seconds - 0.6:.3f}:d=0.6,format=yuv420p",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "18",
            "-r",
            str(FPS),
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-ar",
            "48000",
            "-ac",
            "2",
            "-shortest",
            "-movflags",
            "+faststart",
            str(mp4),
        ]
    )


def label_filter(labels: list[tuple[str, float, float]]) -> str:
    parts: list[str] = []
    fontfile = str(FONT_BODY).replace("\\", "/").replace(":", "\\:")
    for i, (text, start, end) in enumerate(labels):
        safe = text.replace("'", "\\'")
        parts.append(
            "drawtext="
            f"fontfile='{fontfile}':text='{safe}':"
            "fontsize=36:fontcolor=0xF7F3EC:"
            "borderw=0:box=1:boxcolor=0x1A1614@0.62:boxborderw=18:"
            "x=(w-text_w)/2:y=h-160:"
            f"enable='between(t,{start:.2f},{end:.2f})':"
            "shadowcolor=0x000000@0.4:shadowx=0:shadowy=2"
        )
        # Small gold kicker above the label
        if i == 0:
            pass
    return ",".join(parts)


def encode_clip(
    src: Path,
    dest: Path,
    labels: list[tuple[str, float, float]],
    duration: float,
) -> None:
    fade_out = max(0.2, duration - 0.45)
    vf = [
        "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos",
        "crop=1080:1920",
        "eq=contrast=1.06:brightness=0.028:saturation=1.08",
        "unsharp=5:5:0.45:5:5:0.0",
        f"fade=t=in:st=0:d=0.45,fade=t=out:st={fade_out:.3f}:d=0.45",
        "format=yuv420p",
    ]
    if labels:
        vf.insert(-1, label_filter(labels))

    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(src),
            "-vf",
            ",".join(vf),
            "-af",
            f"aformat=sample_fmts=fltp:channel_layouts=stereo,"
            f"aresample=48000,loudnorm=I=-16:TP=-1.5:LRA=11,"
            f"afade=t=in:st=0:d=0.35,afade=t=out:st={fade_out:.3f}:d=0.45",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "18",
            "-r",
            str(FPS),
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-ar",
            "48000",
            "-ac",
            "2",
            "-movflags",
            "+faststart",
            str(dest),
        ]
    )


def concat(files: list[Path], dest: Path) -> None:
    list_path = WORK / "concat.txt"
    list_path.write_text(
        "".join(f"file '{p.resolve().as_posix()}'\n" for p in files),
        encoding="utf-8",
    )
    run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_path),
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "18",
            "-r",
            str(FPS),
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-ar",
            "48000",
            "-ac",
            "2",
            "-movflags",
            "+faststart",
            str(dest),
        ]
    )


def main() -> int:
    WORK.mkdir(parents=True, exist_ok=True)
    title_png, end_png = make_cards()
    title_mp4 = WORK / "00_title.mp4"
    end_mp4 = WORK / "99_end.mp4"
    still_to_video(title_png, 4.2, title_mp4)
    still_to_video(end_png, 5.0, end_mp4)

    segments = [
        (
            CLIPS / "IMG_2976.MP4",
            WORK / "01_arrival.mp4",
            [("Arrival", 0.7, 10.6)],
            11.333,
        ),
        (
            CLIPS / "IMG_2977.MP4",
            WORK / "02_unit.mp4",
            [("Unit 2", 0.6, 9.0)],
            9.633,
        ),
        (
            CLIPS / "IMG_2992.MP4",
            WORK / "03_entering.mp4",
            [("Entering", 0.6, 9.2)],
            9.933,
        ),
        (
            CLIPS / "IMG_9836.MP4",
            WORK / "04_entry.mp4",
            [("Entry", 0.4, 4.2)],
            4.633,
        ),
        (
            CLIPS / "IMG_2978.MP4",
            WORK / "05_interior.mp4",
            [
                ("Hall", 0.5, 3.4),
                ("Kitchen", 3.5, 18.8),
                ("Living room", 19.0, 31.8),
                ("Hall", 32.0, 36.8),
                ("Bath", 37.0, 46.2),
            ],
            46.535,
        ),
    ]

    encoded = [title_mp4]
    for src, dest, labels, duration in segments:
        encode_clip(src, dest, labels, duration)
        encoded.append(dest)
    encoded.append(end_mp4)

    concat(encoded, OUT)
    print(f"Wrote {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

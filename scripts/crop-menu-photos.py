"""Crop portrait photos for /menu from the official Winner menu pages.

Run: uv run --with pillow scripts/crop-menu-photos.py
Boxes are fractions (x0, y0, x1, y1) of the source page.
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src" / "menu-winner"
OUT = ROOT / "public" / "assets" / "menu-photos"
PORTRAIT = (825, 1086)  # 3x of WatchHouse 275x362 slot

CROPS = {
    "coffee": (14, (0.0, 0.37, 0.33, 0.85)),
    "tea": (13, (0.5, 0.03, 1.0, 0.97)),
    "refresher": (11, (0.47, 0.03, 1.0, 0.97)),
    "chicken": (20, (0.56, 0.12, 0.96, 0.7)),
    "ribs": (16, (0.0, 0.0, 0.3, 0.52)),
    "rice-bowl": (15, (0.58, 0.03, 1.0, 0.97)),
    "pastry": (38, (0.0, 0.05, 0.26, 0.66)),
    "dessert": (33, (0.55, 0.36, 0.95, 0.86)),
    "snacks": (29, (0.45, 0.03, 0.95, 0.97)),
    "hero-card": (12, (0.4, 0.03, 0.76, 0.82)),
}


def page(n: int) -> Image.Image:
    return Image.open(SRC / f"UPDATE MENU WINNER JUNE 2026_Page_{n:02d}.png").convert("RGB")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (n, (x0, y0, x1, y1)) in CROPS.items():
        im = page(n)
        w, h = im.size
        box = im.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
        ImageOps.fit(box, PORTRAIT, Image.LANCZOS).save(OUT / f"{name}.jpg", quality=85)

    # Blurred full-width hero background, like WatchHouse page-header__background
    bg = page(9)
    w, h = bg.size
    bg = bg.crop((int(0.3 * w), int(0.03 * h), w, int(0.97 * h)))
    bg = ImageOps.fit(bg, (1600, 500), Image.LANCZOS).filter(ImageFilter.GaussianBlur(18))
    bg.save(OUT / "hero-bg.jpg", quality=80)
    print("ok", len(CROPS) + 1)


if __name__ == "__main__":
    main()

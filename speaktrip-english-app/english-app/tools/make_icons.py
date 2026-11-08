from PIL import Image, ImageDraw, ImageFont
import numpy as np, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'icons')
os.makedirs(OUT, exist_ok=True)
S = 2048

# 1) 背景渐变
top = np.array([26, 125, 110], dtype=np.float64)
bot = np.array([10, 66, 59], dtype=np.float64)
t = np.linspace(0, 1, S)[:, None, None]
arr = (top * (1 - t) + bot * t).astype(np.uint8)
arr = np.repeat(arr, S, axis=1)
bg = Image.fromarray(arr, 'RGB').convert('RGBA')

# 2) 左上柔光
yy, xx = np.mgrid[0:S, 0:S]
cx, cy = S * 0.24, S * 0.12
dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / (S * 0.9)
glow = np.clip(1 - dist, 0, 1) ** 2 * 40
glow_img = Image.fromarray(np.dstack([np.full((S, S), 255, np.uint8)] * 3 + [glow.astype(np.uint8)]), 'RGBA')
bg = Image.alpha_composite(bg, glow_img)

# 3) 圆角遮罩
mask = Image.new('L', (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.224), fill=255)
icon = Image.new('RGBA', (S, S), (0, 0, 0, 0))
icon.paste(bg, (0, 0), mask)

# 4) 对话气泡
d = ImageDraw.Draw(icon)
white = (255, 253, 248, 255)
bx0, by0, bx1, by1 = S * 0.208, S * 0.252, S * 0.792, S * 0.632
d.rounded_rectangle([bx0, by0, bx1, by1], radius=int(S * 0.118), fill=white)
d.polygon([(S * 0.295, S * 0.595), (S * 0.295, S * 0.762), (S * 0.452, S * 0.612)], fill=white)

# 5) 字母 A
font = ImageFont.truetype(r'C:\Windows\Fonts\georgiab.ttf', int(S * 0.305))
text = 'A'
bbox = d.textbbox((0, 0), text, font=font)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
tx = (S - tw) / 2 - bbox[0]
ty = (by0 + by1) / 2 - th / 2 - bbox[1] - S * 0.004
d.text((tx, ty), text, font=font, fill=(13, 75, 68, 255))

# 6) 右下角小圆点（口语节奏感）
r = S * 0.026
cx2, cy2 = S * 0.735, S * 0.585
d.ellipse([cx2 - r, cy2 - r, cx2 + r, cy2 + r], fill=(224, 163, 94, 255))

for size, name in [(1024, 'icon-1024.png'), (512, 'icon-512.png'), (192, 'icon-192.png'), (180, 'apple-touch-icon.png'), (32, 'favicon-32.png')]:
    img = icon.resize((size, size), Image.LANCZOS)
    if name == 'apple-touch-icon.png':
        flat = Image.new('RGB', (size, size), (10, 66, 59))
        flat.paste(img, (0, 0), img)
        flat.save(os.path.join(OUT, name), optimize=True)
    else:
        img.save(os.path.join(OUT, name), optimize=True)
    print('wrote', name, size)

#!/usr/bin/env python3
"""
Generates rich equirectangular 360 panorama scenes (2048x1024)
for Tours360.in:
- living_day.jpg
- living_sunset.jpg
- living_night.jpg
- balcony_day.jpg
- kitchen_day.jpg
- master_day.jpg
- shot-panoramic-composition-bedroom(1).jpg
"""
import math
import os
from PIL import Image, ImageDraw, ImageFilter

OUTPUT_DIR = "/home/admin01/tours360/assets/panos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH = 2048
HEIGHT = 1024

def make_base_equirectangular(sky_top, sky_bot, floor_col, wall_col, time_mode="day"):
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    # 1. Sky & Ceiling (Zenith to Horizon: y 0 to 512)
    for y in range(HEIGHT // 2):
        ratio = y / (HEIGHT // 2)
        r = int(sky_top[0] * (1 - ratio) + sky_bot[0] * ratio)
        g = int(sky_top[1] * (1 - ratio) + sky_bot[1] * ratio)
        b = int(sky_top[2] * (1 - ratio) + sky_bot[2] * ratio)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    # 2. Floor (Horizon to Nadir: y 512 to 1024)
    for y in range(HEIGHT // 2, HEIGHT):
        ratio = (y - HEIGHT // 2) / (HEIGHT // 2)
        # perspective floor gradient
        r = int(floor_col[0] * (1 - ratio * 0.4))
        g = int(floor_col[1] * (1 - ratio * 0.4))
        b = int(floor_col[2] * (1 - ratio * 0.4))
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    return img

def create_living_room(mode="day"):
    if mode == "day":
        sky_top = (18, 22, 28)    # Architectural ceiling
        sky_bot = (30, 36, 45)
        floor_col = (50, 48, 44)  # Warm Italian marble
        window_sky = (135, 206, 235) # Morning bright sky
        sun_color = (255, 250, 220)
        cove_light = (255, 225, 160)
        ambient_tint = (212, 175, 55, 25)
    elif mode == "sunset":
        sky_top = (25, 18, 25)
        sky_bot = (45, 28, 35)
        floor_col = (55, 38, 30)  # Amber reflective marble
        window_sky = (245, 120, 60) # Golden hour crimson sky
        sun_color = (255, 180, 50)
        cove_light = (255, 190, 100)
        ambient_tint = (235, 130, 60, 40)
    else: # night
        sky_top = (10, 12, 16)
        sky_bot = (18, 20, 26)
        floor_col = (20, 22, 28)  # Deep obsidian polished marble
        window_sky = (10, 15, 30) # Indore night skyline
        sun_color = (120, 160, 255)
        cove_light = (255, 215, 130)
        ambient_tint = (20, 30, 60, 30)

    base = make_base_equirectangular(sky_top, sky_bot, floor_col, sky_bot, mode)
    draw = ImageDraw.Draw(base)
    
    # Draw Architectural Walls & Pillars
    # 4 cardinal directions: East (x=512), South (x=1024), West (x=1536), North (x=0/2048)
    
    # Ceiling cove lights (circular ring in equirectangular projection)
    cove_y = int(HEIGHT * 0.28)
    draw.line([(0, cove_y), (WIDTH, cove_y)], fill=cove_light, width=4)
    draw.line([(0, cove_y - 2), (WIDTH, cove_y - 2)], fill=(cove_light[0]//2, cove_light[1]//2, cove_light[2]//2), width=1)
    
    # Grand Floor-to-Ceiling French Windows (East facing: x=300 to x=724)
    # Looking out to Super Corridor Indore skyline
    win_x1, win_x2 = 320, 700
    win_y1, win_y2 = int(HEIGHT * 0.28), int(HEIGHT * 0.72)
    
    # Window glass fill
    for wy in range(win_y1, win_y2):
        w_ratio = (wy - win_y1) / (win_y2 - win_y1)
        r = int(window_sky[0] * (1 - w_ratio * 0.3))
        g = int(window_sky[1] * (1 - w_ratio * 0.3))
        b = int(window_sky[2] * (1 - w_ratio * 0.3))
        draw.line([(win_x1, wy), (win_x2, wy)], fill=(r, g, b))
        
    # Skyline buildings silhouette outside window
    for bx in range(win_x1 + 30, win_x2 - 30, 45):
        bh = 60 + (bx * 37) % 90
        by1 = int(HEIGHT * 0.52) - bh
        by2 = int(HEIGHT * 0.52)
        b_color = (40, 50, 65) if mode != "night" else (15, 20, 35)
        draw.rectangle([bx, by1, bx + 35, by2], fill=b_color)
        if mode == "night":
            # Tiny city building lights
            for ly in range(by1 + 5, by2 - 5, 10):
                draw.rectangle([bx + 5, ly, bx + 10, ly + 4], fill=(255, 240, 180))
                draw.rectangle([bx + 18, ly, bx + 24, ly + 4], fill=(200, 220, 255))
    
    # Sun / Glow outside window
    if mode == "day":
        draw.ellipse([450, int(HEIGHT * 0.35), 530, int(HEIGHT * 0.43)], fill=sun_color)
    elif mode == "sunset":
        draw.ellipse([470, int(HEIGHT * 0.44), 570, int(HEIGHT * 0.52)], fill=sun_color)
        
    # Luxury Balcony Glass Railing & French window mullions (UPVC soundproof sliders)
    for mx in range(win_x1, win_x2 + 1, 95):
        draw.line([(mx, win_y1), (mx, win_y2)], fill=(30, 35, 42), width=6)
        draw.line([(mx + 1, win_y1), (mx + 1, win_y2)], fill=(212, 175, 55), width=1) # gold pinstripe
    draw.line([(win_x1, win_y1), (win_x2, win_y1)], fill=(40, 45, 55), width=8)
    draw.line([(win_x1, win_y2), (win_x2, win_y2)], fill=(40, 45, 55), width=8)
    
    # Fluted Wood & Champagne Gold Feature Wall (South wall: x=850 to x=1350)
    for fx in range(880, 1320, 12):
        draw.line([(fx, int(HEIGHT*0.28)), (fx, int(HEIGHT*0.72))], fill=(45, 35, 28), width=7)
        draw.line([(fx+2, int(HEIGHT*0.28)), (fx+2, int(HEIGHT*0.72))], fill=(70, 55, 42), width=3)
        if fx % 48 == 0:
            draw.line([(fx, int(HEIGHT*0.28)), (fx, int(HEIGHT*0.72))], fill=(212, 175, 55), width=2)
            
    # Floating Italian Marble Console & OLED Display
    draw.rectangle([980, int(HEIGHT * 0.40), 1220, int(HEIGHT * 0.58)], fill=(12, 14, 18), outline=(60, 65, 75), width=2)
    draw.rectangle([940, int(HEIGHT * 0.60), 1260, int(HEIGHT * 0.64)], fill=(180, 175, 165), outline=(212, 175, 55), width=2)
    # Warm backlight behind OLED
    draw.line([(980, int(HEIGHT * 0.39)), (1220, int(HEIGHT * 0.39))], fill=cove_light, width=3)
    
    # Luxury Sectional Sofa (West side: x=1450 to x=1850)
    sofa_y1 = int(HEIGHT * 0.62)
    sofa_y2 = int(HEIGHT * 0.78)
    draw.rectangle([1480, sofa_y1, 1820, sofa_y2], fill=(35, 40, 48), outline=(55, 60, 70), width=2)
    draw.rectangle([1510, sofa_y1 - 30, 1790, sofa_y1], fill=(28, 32, 38))
    # Designer cushions with gold embroidery
    draw.rectangle([1530, sofa_y1 - 25, 1580, sofa_y1 + 10], fill=(212, 175, 55))
    draw.rectangle([1720, sofa_y1 - 25, 1770, sofa_y1 + 10], fill=(180, 145, 40))
    
    # Italian Marble Floor Tile Grid & Reflection (x: 0 to WIDTH, y: 737 to 1024)
    marble_base_y = int(HEIGHT * 0.72)
    for grid_y in [marble_base_y, marble_base_y + 40, marble_base_y + 90, marble_base_y + 155, marble_base_y + 235]:
        draw.line([(0, grid_y), (WIDTH, grid_y)], fill=(75, 70, 65) if mode!="night" else (35, 38, 48), width=1)
    for grid_x in range(0, WIDTH, 160):
        draw.line([(grid_x, marble_base_y), (int(grid_x * 1.2) % WIDTH, HEIGHT)], fill=(65, 60, 55) if mode!="night" else (30, 32, 40), width=1)
        
    # Modern Ring Chandelier at Zenith (x: 900 to 1100, y: 150 to 240)
    chand_color = (255, 230, 160) if mode != "day" else (220, 200, 140)
    draw.ellipse([960, 160, 1080, 210], outline=chand_color, width=4)
    draw.ellipse([990, 175, 1050, 200], outline=chand_color, width=3)
    draw.line([(1020, 0), (1020, 160)], fill=(180, 150, 70), width=2)
    
    # Subtle blur to blend gradients photorealistically
    filtered = base.filter(ImageFilter.GaussianBlur(radius=0.7))
    out_path = os.path.join(OUTPUT_DIR, f"living_{mode}.jpg")
    filtered.save(out_path, quality=92)
    print(f"Generated: {out_path}")

def create_balcony():
    # East-facing sunrise balcony
    sky_top = (70, 140, 220)
    sky_bot = (180, 220, 255)
    floor_col = (110, 95, 80) # Outdoor weather-resistant teak deck
    base = make_base_equirectangular(sky_top, sky_bot, floor_col, (60, 65, 75), "day")
    draw = ImageDraw.Draw(base)
    
    # 360 Open Sky with Morning Sun
    draw.ellipse([980, 280, 1080, 380], fill=(255, 252, 230))
    # Horizon landscape of Indore Bypass green belts
    horizon_y = int(HEIGHT * 0.50)
    for gx in range(0, WIDTH, 15):
        gh = 25 + (gx * 19) % 35
        draw.rectangle([gx, horizon_y - gh, gx + 20, horizon_y], fill=(45, 90, 50))
        
    # Balcony Glass Railing with Champagne Gold Handrail
    rail_y = int(HEIGHT * 0.68)
    draw.line([(0, rail_y), (WIDTH, rail_y)], fill=(212, 175, 55), width=8)
    draw.rectangle([0, rail_y, WIDTH, int(HEIGHT * 0.82)], fill=(120, 160, 190, 80))
    for post_x in range(0, WIDTH, 180):
        draw.line([(post_x, rail_y), (post_x, int(HEIGHT * 0.82))], fill=(180, 180, 190), width=4)
        
    # Teak Deck planks on balcony floor
    for py in range(int(HEIGHT * 0.82), HEIGHT, 22):
        draw.line([(0, py), (WIDTH, py)], fill=(70, 50, 35), width=2)
        
    # Rattan luxury outdoor armchairs & coffee table (x: 880 to 1160)
    draw.ellipse([980, int(HEIGHT * 0.83), 1060, int(HEIGHT * 0.88)], fill=(35, 30, 25), outline=(212, 175, 55), width=2)
    draw.rectangle([880, int(HEIGHT * 0.80), 960, int(HEIGHT * 0.90)], fill=(45, 40, 35))
    draw.rectangle([1080, int(HEIGHT * 0.80), 1160, int(HEIGHT * 0.90)], fill=(45, 40, 35))
    
    filtered = base.filter(ImageFilter.GaussianBlur(radius=0.7))
    out_path = os.path.join(OUTPUT_DIR, "balcony_day.jpg")
    filtered.save(out_path, quality=92)
    print(f"Generated: {out_path}")

def create_kitchen():
    # Modular European Chef Kitchen
    sky_top = (15, 18, 22)
    sky_bot = (25, 30, 38)
    floor_col = (45, 45, 48)
    base = make_base_equirectangular(sky_top, sky_bot, floor_col, (30, 35, 42), "day")
    draw = ImageDraw.Draw(base)
    
    # Recessed warm spot lights
    for sx in range(100, WIDTH, 240):
        draw.ellipse([sx, 120, sx + 25, 135], fill=(255, 235, 180))
        
    # Central Quartz Island (x: 820 to 1220, y: 640 to 860)
    island_y1 = int(HEIGHT * 0.62)
    island_y2 = int(HEIGHT * 0.84)
    draw.rectangle([820, island_y1, 1220, island_y2], fill=(230, 230, 235), outline=(212, 175, 55), width=3)
    # Hafele induction cooktop & sink
    draw.rectangle([870, island_y1 + 15, 990, island_y1 + 65], fill=(25, 28, 35), outline=(100, 105, 115), width=2)
    draw.rectangle([1040, island_y1 + 15, 1170, island_y1 + 65], fill=(170, 175, 185), outline=(80, 85, 95), width=2)
    # Kohler Brushed Brass Gooseneck Faucet
    draw.line([(1105, island_y1 + 15), (1105, island_y1 - 35)], fill=(212, 175, 55), width=5)
    draw.arc([1085, island_y1 - 50, 1115, island_y1 - 25], 180, 0, fill=(212, 175, 55), width=5)
    
    # Upper Matte Anthracite & Fluted Glass Cabinets (y: 280 to 450)
    draw.rectangle([200, int(HEIGHT * 0.28), 750, int(HEIGHT * 0.45)], fill=(32, 36, 44), outline=(212, 175, 55), width=1)
    # LED under-cabinet strip light
    draw.line([(200, int(HEIGHT * 0.45)), (750, int(HEIGHT * 0.45))], fill=(255, 220, 140), width=4)
    # Backsplash in Moroccan subway glazed tile
    draw.rectangle([200, int(HEIGHT * 0.45), 750, int(HEIGHT * 0.62)], fill=(225, 220, 210))
    # Lower Hafele Soft-Close drawers
    draw.rectangle([200, int(HEIGHT * 0.62), 750, int(HEIGHT * 0.85)], fill=(25, 28, 35), outline=(60, 65, 75), width=2)
    
    filtered = base.filter(ImageFilter.GaussianBlur(radius=0.7))
    out_path = os.path.join(OUTPUT_DIR, "kitchen_day.jpg")
    filtered.save(out_path, quality=92)
    print(f"Generated: {out_path}")

def create_master_bedroom():
    # 5-Star Master Suite
    sky_top = (18, 20, 26)
    sky_bot = (32, 36, 45)
    floor_col = (52, 42, 34) # Herringbone Smoked Oak Parquet
    base = make_base_equirectangular(sky_top, sky_bot, floor_col, (35, 38, 48), "day")
    draw = ImageDraw.Draw(base)
    
    # Feature Headboard Wall with Fluted Acoustic Suede Panels (x: 750 to 1300)
    for hx in range(780, 1270, 16):
        draw.line([(hx, int(HEIGHT * 0.30)), (hx, int(HEIGHT * 0.65))], fill=(60, 48, 40), width=10)
        draw.line([(hx+3, int(HEIGHT * 0.30)), (hx+3, int(HEIGHT * 0.65))], fill=(85, 70, 58), width=3)
        if hx % 64 == 0:
            draw.line([(hx, int(HEIGHT * 0.30)), (hx, int(HEIGHT * 0.65))], fill=(212, 175, 55), width=2)
            
    # King Size Bed with Egyptian Cotton Linens
    bed_y1 = int(HEIGHT * 0.58)
    bed_y2 = int(HEIGHT * 0.82)
    draw.rectangle([830, bed_y1, 1210, bed_y2], fill=(240, 238, 232), outline=(180, 175, 165), width=2)
    # Emerald Velvet Bed Runner & Cushions
    draw.rectangle([830, int(HEIGHT * 0.74), 1210, int(HEIGHT * 0.78)], fill=(16, 110, 80))
    draw.rectangle([870, bed_y1 + 10, 980, bed_y1 + 50], fill=(250, 250, 250), outline=(212, 175, 55), width=1)
    draw.rectangle([1060, bed_y1 + 10, 1170, bed_y1 + 50], fill=(250, 250, 250), outline=(212, 175, 55), width=1)
    
    # Pendant Reading Lights hanging from ceiling
    draw.line([(800, 0), (800, int(HEIGHT * 0.45))], fill=(212, 175, 55), width=2)
    draw.ellipse([790, int(HEIGHT * 0.45), 810, int(HEIGHT * 0.48)], fill=(255, 235, 170))
    draw.line([(1240, 0), (1240, int(HEIGHT * 0.45))], fill=(212, 175, 55), width=2)
    draw.ellipse([1230, int(HEIGHT * 0.45), 1250, int(HEIGHT * 0.48)], fill=(255, 235, 170))
    
    # Floor to Ceiling East Balcony Glazing (x: 1450 to 1850)
    draw.rectangle([1450, int(HEIGHT * 0.28), 1850, int(HEIGHT * 0.75)], fill=(140, 200, 240))
    draw.ellipse([1600, int(HEIGHT * 0.35), 1700, int(HEIGHT * 0.45)], fill=(255, 250, 210))
    for mx in range(1450, 1851, 100):
        draw.line([(mx, int(HEIGHT * 0.28)), (mx, int(HEIGHT * 0.75))], fill=(30, 35, 42), width=5)
        
    filtered = base.filter(ImageFilter.GaussianBlur(radius=0.7))
    out_path = os.path.join(OUTPUT_DIR, "master_day.jpg")
    filtered.save(out_path, quality=92)
    print(f"Generated: {out_path}")

if __name__ == "__main__":
    print("Generating Tours360 equirectangular panoramas...")
    create_living_room("day")
    create_living_room("sunset")
    create_living_room("night")
    create_balcony()
    create_kitchen()
    create_master_bedroom()
    print("All panoramas generated successfully!")

# Tours360 — A-to-Z Onboarding Playbook

## 1. Builder / Sample Flat / Villa (Day/Sunset/Night + Multi-Floor SVG)
Folder banayein: `mkdir -p staging_uploads/<slug>`
Files dalein:
- Panoramas: `living_day.webp`, `living_sunset.webp`, `living_night.webp`, `master_day.webp`
- Floorplans & Logo: `ground_floor.svg`, `first_floor.svg`, `logo.svg`
- `info.txt`: Builder Name, RERA, Phone, Project Name, Location, aur har room ke SVG `(x, y)` + Hotspot `(pitch, yaw)`.

## 2. Plotting Colony (Aerial View + Mandir, Main Gate, Main Road + Plot Pins)
Note: Plotting mein Day/Night nahi hota—Aerial Master panorama + Landmark Zones (Main Gate, Mandir, Main Road, Park) + Plot Pins hote hain.
Folder banayein: `mkdir -p staging_uploads/<slug>`
Files dalein:
- Panoramas: `aerial.webp` (aur agar ground views hain to `gate.webp`, `mandir.webp`, `road.webp`)
- Map & Logo: `layout.svg`, `logo.svg`
- `info.txt`: Developer Name, RERA, Phone, Google Sheet ID, Landmarks (Main Gate, Mandir, Main Road ke pitch/yaw), aur Plot Pins (`svg_x, svg_y, pano_pitch, pano_yaw, size, status`).

## 3. Antigravity CLI Command
1. `cd /home/admin01/tours360 && agy`
2. `/agents` se `builder-onboarding` ya `plotting-onboarding` select karein.
3. Run: `/goal staging_uploads/<slug> ko scan karke onboard karo aur go build . se verify karo.`
4. Local test: `go run .` -> Browser mein `http://localhost:8080` check karein.

#!/usr/bin/env bash
# ==============================================================================
# Tours360 Ubuntu CLI Publisher — Cloudflare R2 + WebP Compression + QR Generator
# ==============================================================================
set -euo pipefail

SLUG="${1:-}"
IMAGE_DIR="${2:-}"

if [ -z "$SLUG" ] || [ -z "$IMAGE_DIR" ]; then
  echo "Usage: $0 <project-slug> <path-to-raw-panoramas-dir>"
  echo "Example: $0 tathastu-greens ./raw_panos"
  exit 1
fi

OUT_DIR="static/assets/panos/${SLUG}"
mkdir -p "$OUT_DIR"
mkdir -p configs

echo "==> 1. Compressing 360° Panoramas to 4096x2048 WebP (~450 KB)..."
for img in "$IMAGE_DIR"/*.{jpg,jpeg,png,JPG,PNG}; do
  [ -f "$img" ] || continue
  filename=$(basename "$img")
  base="${filename%.*}"
  target="${OUT_DIR}/${base}.webp"
  echo "  - Compressing: $filename -> $target"
  if command -v cwebp &>/dev/null; then
    cwebp -q 82 -resize 4096 2048 "$img" -o "$target"
  elif command -v convert &>/dev/null; then
    convert "$img" -resize 4096x2048 -quality 82 "$target"
  else
    echo "Warning: cwebp / convert not found, copying raw file as fallback"
    cp "$img" "${OUT_DIR}/${base}.webp"
  fi
done

echo "==> 2. Syncing to Cloudflare R2 (r2://tours360-media/${SLUG}/)..."
if command -v aws &>/dev/null; then
  aws s3 sync "$OUT_DIR" "s3://tours360-media/${SLUG}/" --endpoint-url="${R2_ENDPOINT:-https://cloudflare-r2.com}" || true
else
  echo "aws CLI not configured, skipping R2 sync (stored locally in $OUT_DIR)"
fi

echo "==> 3. Generating lightweight configs/${SLUG}.json..."
cat <<EOF > "configs/${SLUG}.json"
{
  "slug": "${SLUG}",
  "mode": "plot",
  "scenes": {
    "entry": {
      "title": "Main Entrance & 60ft Boulevard",
      "image": "/assets/panos/${SLUG}/entry.webp",
      "plotHotspots": []
    }
  }
}
EOF

echo "==> 4. Generating print-ready Hoarding QR Code (${SLUG}-qr.png)..."
TARGET_URL="https://tours360.in/p/${SLUG}"
if command -v qrencode &>/dev/null; then
  qrencode -o "${SLUG}-qr.png" -s 12 -m 2 "$TARGET_URL"
  echo "Saved ${SLUG}-qr.png"
elif command -v python3 &>/dev/null; then
  python3 -c "
import urllib.request
url = 'https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=' + urllib.parse.quote('$TARGET_URL')
urllib.request.urlretrieve(url, '${SLUG}-qr.png')
print('Downloaded QR to ${SLUG}-qr.png via QR API')
" || true
fi

echo "==> Tours 360 Publish Complete for ${SLUG}!"

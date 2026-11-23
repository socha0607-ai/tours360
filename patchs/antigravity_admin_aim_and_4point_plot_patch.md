# Antigravity (agy) Patch — Admin-Only 360° Precision Aiming Crosshair & 4-Point / Drag Neon Plot Placer

> **Instructions for Antigravity Agent (agy):**  
> Read `static/js/admin.js`, `static/css/admin.css`, and `static/js/app.js`.  
> Implement both Admin-only features below. **CRITICAL:** Both the center aiming crosshair/dot and the 4-Point / Drag Neon Plot Placer must ONLY be visible when `AdminEngine.isUnlocked === true` (strictly hidden for all regular visitors and builders).

---

## Task 1: Admin-Only 360° Precision Aiming Crosshair & Target Dot (`Pitch` & `Yaw`)

### Requirements
1. When Admin Mode is active and the user enables **"🎯 360° Aim Crosshair"** (from the Admin Floating Dock or Pin Studio), render a precision **center aiming reticle** (`pointer-events: none`) dead-center over `#fullscreenPannellumContainer`:
   - A thin gold crosshair (`+`) with a 6px glowing red/gold center dot so the admin sees the exact pixel being aimed at.
   - A compact live coordinate pill directly below the reticle updating at 60fps/on-pan: `Pitch: -14.2° | Yaw: 48.6°`.
2. **Exact Click-to-Target Pin:**
   - When Aim Mode is active and the admin clicks any point on the 360° panorama, use `window.panoViewer.mouseEventToCoords(e)` to get the exact `[pitch, yaw]` under the cursor (not just the center of the screen!).
   - Drop a temporary **Admin-Only Target Pin** (`pnlm-admin-aim-pin`) at that exact `(pitch, yaw)` so the admin can visually verify the dot sits on the exact object/corner.
   - Display a **"Copy Pitch & Yaw"** button with the captured coordinates.
3. Ensure that clicking **"Exit / Lock Admin"** or closing Aim Mode immediately removes the crosshair, live coordinate pill, and all temporary target pins.

### CSS to Add in `static/css/admin.css`:
```css
/* Admin-Only 360 Precision Aiming Crosshair */
.admin-aim-reticle {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999990;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.admin-crosshair-box {
  position: relative;
  width: 44px;
  height: 44px;
}

.admin-crosshair-box::before,
.admin-crosshair-box::after {
  content: "";
  position: absolute;
  background: rgba(212, 175, 55, 0.85);
}

.admin-crosshair-box::before {
  top: 50%;
  left: 0;
  width: 100%;
  height: 1.5px;
  transform: translateY(-50%);
}

.admin-crosshair-box::after {
  left: 50%;
  top: 0;
  height: 100%;
  width: 1.5px;
  transform: translateX(-50%);
}

.admin-aim-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 7px;
  height: 7px;
  background: #EF4444;
  border: 1.5px solid #FFFFFF;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #EF4444;
}

.admin-aim-readout {
  margin-top: 8px;
  background: rgba(11, 13, 16, 0.92);
  border: 1px solid #D4AF37;
  color: #FCEBA7;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 9999px;
  white-space: nowrap;
}

/* Temporary Admin Target / Corner Marker inside Pannellum */
.pnlm-admin-corner-pin {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #D4AF37;
  color: #0B0D10;
  border: 2px solid #FFFFFF;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.72rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 14px rgba(212, 175, 55, 0.95);
  pointer-events: none;
}

/* Drag-Select Overlay Box */
.admin-drag-select-box {
  position: fixed;
  border: 2px dashed #10B981;
  background: rgba(16, 185, 129, 0.18);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
  z-index: 999991;
  pointer-events: none;
}
```

---

## Task 2: Admin-Only 4-Point Polygon & Drag-to-Select Neon Plot Placer (`static/js/admin.js` & `static/js/app.js`)

### Requirements
Upgrade the **📐 Neon Plot Placer** inside `static/js/admin.js` so the admin can map multiple plots rapidly in Admin Mode without manual guessing:

1. **Two Fast Selection Modes (Admin Only):**
   - **Mode A — 4-Point Corner Click (Best for Angled/Perspective Plots):**
     - Admin clicks **"🎯 Select 4 Corners"** and clicks the 4 corners of a plot directly on the 360° panorama (`1` ➔ `2` ➔ `3` ➔ `4`).
     - Each click captures exact `[pitch, yaw]` via `window.panoViewer.mouseEventToCoords(e)` and drops a numbered `.pnlm-admin-corner-pin` (`1`, `2`, `3`, `4`) on the panorama.
     - Once 4 points are clicked:
       - Compute center `pitch = (p1+p2+p3+p4)/4` and `yaw = (y1+y2+y3+y4)/4`.
       - Compute approximate `width` and `height` in pixels from screen-space bounding box of the 4 clicks (or angular span: `Math.abs(maxYaw - minYaw) * 8`, `Math.abs(maxPitch - minPitch) * 8`, clamped to `60–320px`).
       - Compute `rotateDeg` from the top edge slope (`atan2(dy, dx)`).
       - Store `corners: [[p1, y1], [p2, y2], [p3, y3], [p4, y4]]`.
       - Immediately render a live preview Neon Plot Box at that center with those dimensions & rotation!
   - **Mode B — Drag-to-Select Box (Fastest for Straight Plots):**
     - Admin clicks **"✋ Drag Box on 360°"**, holds mouse down at top-left of the plot, drags to bottom-right, and releases.
     - While dragging, draw `.admin-drag-select-box` live on screen.
     - On `mouseup`, convert both start and end screen coordinates to `(pitch, yaw)` using `window.panoViewer.mouseEventToCoords()`, compute center `(pitch, yaw)`, `width`, and `height`, and render the live Neon Plot preview!
2. **Multi-Plot Batch Queue ("+ Save & Map Next Plot"):**
   - Include a compact floating Admin Plot Bar when placing plots so the admin does not have to reopen the modal for every plot:
     - Inputs: `Plot No`, `Dimensions (e.g. 30×50)`, `Facing`, `Status (AVAILABLE / HOLD / SOLD)`.
     - Buttons: **`Save & Add Next Plot`** (pushes the plot JSON into a session batch array and immediately clears the 4 corner pins so the admin can click the next plot in 3 seconds!) and **`Copy All Plots JSON`** (copies the entire array of mapped plots to clipboard!).
3. **Render Custom Neon Plot Size in `static/js/app.js`:**
   - Ensure `buildPannellumHotspots()` in `static/js/app.js` reads `plot.width`, `plot.height`, `plot.rotateDeg`, and `plot.status` so every mapped plot renders at its exact admin-defined size and angle for buyers.
4. **Strict Admin Guard:**
   - All aiming reticles, corner pins, drag-select boxes, and the Neon Plot Placer floating bar must ONLY mount when `AdminEngine.isUnlocked === true`, and must clean up completely on `AdminEngine.lockAdmin()`.

### Reference Implementation Helper for `static/js/admin.js`:
```javascript
// Exact mouse-to-(pitch, yaw) helper using Pannellum API
getCoordsFromMouseEvent(e) {
  if (!window.panoViewer) return { pitch: 0, yaw: 0 };
  if (typeof window.panoViewer.mouseEventToCoords === "function") {
    const coords = window.panoViewer.mouseEventToCoords(e);
    if (Array.isArray(coords) && coords.length === 2) {
      return { pitch: Number(coords[0].toFixed(2)), yaw: Number(coords[1].toFixed(2)) };
    }
  }
  return {
    pitch: Number(window.panoViewer.getPitch().toFixed(2)),
    yaw: Number(window.panoViewer.getYaw().toFixed(2))
  };
}
```

# Antigravity (agy) Patch — Interactive Mouse-Based Neon Plot Placer & Resizer (Admin Studio)

> **Instructions for Antigravity Agent (agy):**  
> Read `static/js/admin.js`, `static/js/app.js`, and `static/css/style.css`.  
> Add a **"📐 Neon Plot Placer"** tab inside the Admin Pin Studio (`static/js/admin.js`) so the founder can:  
> 1. Click anywhere on the 360° Colony Panorama with the mouse to capture exact `pitch` & `yaw`.  
> 2. Adjust the Neon Plot Box **Width**, **Height**, **3D Tilt/Skew**, **Plot No**, **Dimensions**, and **Status (`AVAILABLE` / `HOLD` / `SOLD`)** with live visual sliders directly over the 360° scene.  
> 3. Copy the generated Neon Plot JSON directly into `data.json` or `configs/{slug}.json`.

---

## Task 1: Support Custom `width`, `height`, and `rotateDeg` on Neon Plots (`static/js/app.js`)

When rendering `plotHotspots` inside `buildPannellumHotspots(sceneData)` in `static/js/app.js`, apply custom size & tilt from each plot's config so every plot fits its exact perspective on the 360° ground:

```javascript
if (sceneData.plotHotspots) {
  sceneData.plotHotspots.forEach(plot => {
    hotspots.push({
      pitch: plot.pitch,
      yaw: plot.yaw,
      type: "custom",
      createTooltipFunc: function (hotSpotDiv) {
        hotSpotDiv.classList.add("pnlm-neon-plot");
        const statusClass =
          plot.status === "SOLD" ? "neon-plot-sold" :
          plot.status === "HOLD" ? "neon-plot-hold" : "neon-plot-available";

        const w = plot.width || 110;
        const h = plot.height || 52;
        const rot = plot.rotateDeg || 0;

        hotSpotDiv.innerHTML = `
          <div class="neon-plot-box ${statusClass}" style="min-width:${w}px; min-height:${h}px; transform: rotate(${rot}deg); justify-content:center;">
            <span>Plot #${plot.plotNo}</span>
            <span class="plot-sub-size">${plot.dimensions}</span>
          </div>
        `;
        hotSpotDiv.addEventListener("click", (e) => {
          e.stopPropagation();
          openPlotDetailModal(plot);
        });
      }
    });
  });
}
```

---

## Task 2: Add Mouse-Click Neon Plot Placer & Resizer in `static/js/admin.js`

Inside `openPinStudioModal()` in `static/js/admin.js`, add a 3rd tab **`📐 Neon Plot Placer`** with:
1. **"🎯 Click 360° Plot on Screen"** toggle button: when clicked, the next mouse click on `#fullscreenPannellumContainer` captures `pitch` and `yaw` (using `window.panoViewer.mouseEventToCoords(e)` if available, or `getPitch()`/`getYaw()`), and drops a **live preview Neon Box** onto Pannellum!
2. **Live Sliders:**
   - `Width (px)`: `60` to `260` (default `120`)
   - `Height (px)`: `40` to `180` (default `60`)
   - `Tilt / Angle (deg)`: `-45` to `+45` (default `0`)
3. **Fields:**
   - `Plot No` (e.g. `14`)
   - `Dimensions` (e.g. `30×50 (1,500 Sq.Ft.)`)
   - `Facing` (e.g. `East Facing`)
   - `Status` (`AVAILABLE` | `HOLD` | `SOLD`)
4. **Auto-Generated Ready-to-Paste JSON:**
   ```json
   {
     "id": "plot-14",
     "plotNo": "14",
     "pitch": -18.4,
     "yaw": 42.1,
     "width": 135,
     "height": 68,
     "rotateDeg": -12,
     "dimensions": "30×50 (1,500 Sq.Ft.)",
     "facing": "East Facing",
     "status": "AVAILABLE"
   }
   ```
   With a **"📋 Copy Plot JSON"** button!

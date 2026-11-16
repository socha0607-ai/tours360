# Antigravity (agy) Patch — Plot Scene Cleanup, TNCP Colony SVG Plan, Google Sheet Live Rate Sync & "Corridors Hub & Plottings" Branding

> **Instructions for Antigravity Agent (agy):**  
> Read `main.go`, `static/index.html`, `static/css/style.css`, `static/js/app.js`, `static/js/admin.js`, and `static/data.json` (or `static/data.js`).  
> Apply all 4 refinements below cleanly while keeping the Go server lightweight and preserving existing 0ms `PanoCache` and Kill-Switch functionality.

---

## Task 1: Remove Flat Rooms (`Living`, `Balcony`, `Kitchen`, `Master`) from Plot Mode (`static/js/app.js`)

### Root Cause
`renderRoomCarousel()` currently renders hardcoded flat rooms (`Living Foyer`, `East Balcony`, `Chef's Kitchen`, `Master Suite`) even when viewing a plotting colony (`mode: "plot"`).

### Fix in `static/js/app.js`:
1. Update `renderRoomCarousel(activeSceneId, project)` to inspect `project.mode`:
   - **If `project.mode === "plot"`:** Render ONLY the scenes defined in `project.plotScenes` (fallback: `[{ id: "gate", title: "Main Entrance Gate", icon: "fa-archway" }, { id: "road40", title: "40ft Main Road", icon: "fa-road" }, { id: "garden", title: "Colony Garden", icon: "fa-tree" }]`). Never show `Living`, `Balcony`, `Kitchen`, or `Master` in plot mode!
   - **If `project.mode !== "plot"` (Flat / Villa):** Render the standard flat rooms (`Living Foyer`, `East Balcony`, `Chef's Kitchen`, `Master Suite`) or `project.rooms` if provided.
2. Inside `openTourViewer()` / `updateHUD()`:
   - When `project.mode === "plot"`:
     - Hide `.hud-top-right` (the Day/Sunset/Night AI lighting pill) and `.hud-vastu-badge` if not applicable, and show a **"Colony Road & Plot View"** badge instead.
     - Change `#hudFloorplanBtn` tooltip/title to `"Colony / Society Plan (TNCP Map)"`.

```javascript
function renderRoomCarousel(activeSceneId, project) {
  if (!dom.roomCarousel) return;
  dom.roomCarousel.innerHTML = "";

  const isPlot = project?.mode === "plot";
  const scenes = isPlot
    ? (project.plotScenes || [
        { id: "gate", title: "Main Gate", icon: "fa-archway" },
        { id: "road40", title: "40ft Road", icon: "fa-road" },
        { id: "garden", title: "Colony Garden", icon: "fa-tree" }
      ])
    : (project?.flatScenes || [
        { id: "living", title: "Living Foyer", icon: "fa-couch" },
        { id: "balcony", title: "East Balcony", icon: "fa-sun" },
        { id: "kitchen", title: "Chef's Kitchen", icon: "fa-utensils" },
        { id: "master", title: "Master Suite", icon: "fa-bed" }
      ]);

  scenes.forEach(s => {
    const btn = document.createElement("button");
    btn.className = `room-thumb-btn ${s.id === activeSceneId ? "active" : ""}`;
    btn.innerHTML = `
      <i class="fas ${s.icon || "fa-map-marker-alt"} text-gold"></i>
      <span class="room-thumb-title">${s.title}</span>
    `;
    btn.addEventListener("click", () => switchScene(s.id));
    dom.roomCarousel.appendChild(btn);
  });
}
```

---

## Task 2: Replace "2D Floor Plan" with "Colony / Society Plan (TNCP Map)" in Plot Mode (`static/js/app.js` & `static/index.html`)

When `openFloorplanModal()` opens for a `mode: "plot"` project:
1. Update the modal heading dynamically:
   - **Flat / Villa Mode:** `"Architectural Floor Plan & Vastu Grid"`
   - **Plot / Colony Mode:** `"Colony / Society Layout Plan (TNCP Map)"` and subtitle `"Click any sector/road pin to jump inside 360° • Live rates synced from Builder Sheet"`
2. Render the colony's SVG/Blueprint (`project.colonyPlan?.svgSrc || project.floorplan?.blueprintSrc || "assets/images/floorplan.svg"`) with clickable road/sector pins.
3. Below the Colony Plan SVG inside `#multiFloorScrollContainer`, render a **Live Colony Rate & Plot Availability Table** fetched from the project's Google Sheet (Task 3 below), so buyers can see available plots and current per-sq.ft. rates immediately.

---

## Task 3: Scalable Google-Sheet-Synced Live Rate List (Per-Client Sheet Registry)

To allow builders/salesmen to edit plot prices and statuses (`AVAILABLE` / `HOLD` / `SOLD`) directly in Google Sheets without touching code or redeploying:

### A. Data Schema in `static/data.json` / `configs/{slug}.json`
Add a `rateSheet` object to each colony/project:
```json
"rateSheet": {
  "csvUrl": "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0",
  "editUrl": "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit",
  "assignedTo": "Tathastu Developers (Sales Head: Rajesh Sharma)"
}
```
Expected Google Sheet columns (Row 1 headers):  
`PlotNo | Dimensions | Facing | RatePerSqFt | TotalPrice | Status`

### B. Go Backend Caching Proxy (`/api/rates/{slug}`) in `main.go`
Add a lightweight RAM-cached proxy endpoint in `main.go` (60-second TTL cache) so Google Sheets is never rate-limited and clients load rates in <10ms:

```go
type RateCacheEntry struct {
	Data      []byte
	ExpiresAt time.Time
}

var (
	rateCache   = make(map[string]RateCacheEntry)
	rateCacheMu sync.RWMutex
)

// Register in main():
mux.HandleFunc("/api/rates/", func(w http.ResponseWriter, r *http.Request) {
	slug := strings.TrimPrefix(r.URL.Path, "/api/rates/")
	csvUrl := r.URL.Query().Get("csv")
	if csvUrl == "" {
		http.Error(w, `{"error":"missing csv url"}`, http.StatusBadRequest)
		return
	}

	rateCacheMu.RLock()
	entry, ok := rateCache[slug]
	rateCacheMu.RUnlock()

	if ok && time.Now().Before(entry.ExpiresAt) {
		w.Header().Set("Content-Type", "text/csv; charset=utf-8")
		w.Write(entry.Data)
		return
	}

	client := &http.Client{Timeout: 6 * time.Second}
	resp, err := client.Get(csvUrl)
	if err != nil || resp.StatusCode != 200 {
		http.Error(w, `{"error":"failed to fetch sheet"}`, http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	rateCacheMu.Lock()
	rateCache[slug] = RateCacheEntry{Data: body, ExpiresAt: time.Now().Add(60 * time.Second)}
	rateCacheMu.Unlock()

	w.Header().Set("Content-Type", "text/csv; charset=utf-8")
	w.Write(body)
})
```

### C. Frontend CSV Parser + Admin "Sheet Registry" (`static/js/app.js` & `static/js/admin.js`)
1. In `static/js/app.js`, add `fetchLiveRateSheet(project)` which calls `/api/rates/${project.slug}?csv=${encodeURIComponent(project.rateSheet.csvUrl)}`, parses the CSV rows, and updates:
   - The **Colony Plan Modal** rate table.
   - Each **Neon Plot Hotspot**'s live status (`AVAILABLE` / `HOLD` / `SOLD`) and price inside `#modalPlotDetail`.
2. In `static/js/admin.js`, add a **"📊 Rate Sheets"** button in `.admin-floating-dock` that lists every client/project, who the Google Sheet is assigned to (`assignedTo`), and a direct **"Open Google Sheet ↗"** link so you always know which sheet belongs to which builder.

---

## Task 4: Update Branding Copy to `"Corridors Hub & Plottings"` (`static/index.html` & `static/js/app.js`)

Update all navigation links, buttons, mobile menu items, and page titles across `static/index.html` and `static/js/app.js`:
- Replace `"Corridors Hub"` / `"Corridor Hub"` with **`"Corridors Hub & Plottings"`** (use `"Corridors & Plottings"` only where horizontal space is tight in compact header pills).
- Ensure the `/corridors` Discovery Hub page header clearly reads: **`"Indore Corridors Hub & Plottings"`** with the filter bar: `All | Corridor Plottings | Flats & Villas`.
- Ensure the Navbar and Hero/Builder Portal CTAs visibly showcase both **`Builder Portal`**, **`Corridors Hub & Plottings`**, and **`Book 48-Hr Shoot`**.

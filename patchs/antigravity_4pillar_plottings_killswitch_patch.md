# Antigravity (agy) Patch — Tours 360 Unified 4-Pillar Architecture, Corridor Plottings, Plot QR Sharing & Kill-Switch

> **Instructions for Antigravity Agent (agy):**  
> Read the existing project structure (`main.go`, `go.mod`, `Dockerfile`, `static/index.html`, `static/css/style.css`, `static/css/admin.css`, `static/js/app.js`, `static/js/admin.js`, `static/data.json`).  
> Implement all 6 tasks below cleanly while keeping the Go Docker image lightweight (<25 MB) and preserving existing 0ms `PanoCache` and WebGL cleanup behavior.

---

## Task 1: Go Backend — `status_manager.go` & `main.go` Routes

Create `status_manager.go` in the project root (`/app` / `~/tours360`) to manage instant RAM-backed Green/Red subscription kill-switches persisted to `data/status.json`:

```go
package main

import (
	"encoding/json"
	"net/http"
	"os"
	"sync"
)

type StatusStore struct {
	mu       sync.RWMutex
	Projects map[string]bool `json:"projects"` // true = Green (Active), false = Red (Paused)
	FilePath string
}

var store = &StatusStore{
	Projects: map[string]bool{
		"tathastu-greens":     true,
		"imperial-grand-4bhk": true,
		"maheshwari-infra":    true,
	},
	FilePath: "data/status.json",
}

func getAdminPin() string {
	if pin := os.Getenv("ADMIN_PIN"); pin != "" {
		return pin
	}
	return "202699"
}

func initStatusStore() {
	_ = os.MkdirAll("data", 0755)
	bytes, err := os.ReadFile(store.FilePath)
	if err == nil {
		store.mu.Lock()
		_ = json.Unmarshal(bytes, &store.Projects)
		store.mu.Unlock()
	}
}

func (s *StatusStore) saveToDisk() {
	bytes, _ := json.MarshalIndent(s.Projects, "", "  ")
	_ = os.WriteFile(store.FilePath, bytes, 0644)
}

func isProjectActive(slug string) bool {
	store.mu.RLock()
	defer store.mu.RUnlock()
	active, exists := store.Projects[slug]
	if !exists {
		return true // Active by default unless paused
	}
	return active
}

// 1. Public API: widget.js & viewer check (CORS Enabled)
func handlePublicStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	slug := r.URL.Query().Get("client")
	_ = json.NewEncoder(w).Encode(map[string]bool{
		"active": isProjectActive(slug),
	})
}

// 2. Admin API: List all projects and their Green/Red status
func handleAdminList(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("X-Admin-Pin") != getAdminPin() {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	store.mu.RLock()
	defer store.mu.RUnlock()
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(store.Projects)
}

// 3. Admin API: Toggle Green <-> Red live
func handleAdminToggle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if r.Header.Get("X-Admin-Pin") != getAdminPin() {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	var req struct {
		Slug   string `json:"slug"`
		Active bool   `json:"active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	store.mu.Lock()
	store.Projects[req.Slug] = req.Active
	store.saveToDisk()
	store.mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"slug":   req.Slug,
		"active": req.Active,
	})
}
```

### Update `main.go`:
1. Call `initStatusStore()` at the start of `main()`.
2. Register the kill-switch and dynamic config endpoints:
   ```go
   mux.HandleFunc("/api/status", handlePublicStatus)
   mux.HandleFunc("/api/admin/projects", handleAdminList)
   mux.HandleFunc("/api/admin/toggle", handleAdminToggle)

   // Serve lightweight external project JSONs from configs/{slug}.json (zero binary bloat)
   mux.HandleFunc("/api/configs/", func(w http.ResponseWriter, r *http.Request) {
       slug := strings.TrimPrefix(r.URL.Path, "/api/configs/")
       slug = strings.TrimSuffix(slug, ".json")
       w.Header().Set("Content-Type", "application/json; charset=utf-8")
       w.Header().Set("Cache-Control", "public, max-age=60")
       data, err := os.ReadFile("configs/" + slug + ".json")
       if err != nil {
           http.Error(w, `{"error":"config not found"}`, http.StatusNotFound)
           return
       }
       w.Write(data)
   })
   ```
3. Inside `mux.HandleFunc("/", ...)` in `main.go`, intercept `/p/{slug}` and `/view/{slug}` to enforce the Kill-Switch before serving `static/index.html`:
   ```go
   if strings.HasPrefix(path, "/p/") || strings.HasPrefix(path, "/view/") {
       trimmed := strings.TrimPrefix(path, "/p/")
       trimmed = strings.TrimPrefix(trimmed, "/view/")
       slug := strings.Split(trimmed, "/")[0]
       if slug != "" && !isProjectActive(slug) {
           w.Header().Set("Content-Type", "text/html; charset=utf-8")
           w.Write([]byte(`
               <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0f172a;color:#fff;font-family:sans-serif;text-align:center;padding:20px;">
                   <h2 style="color:#ff3b30;">360° Virtual Tour Temporarily Paused</h2>
                   <p style="color:#94a3b8;max-width:400px;">This property walkthrough is currently offline for maintenance or subscription renewal.</p>
               </div>
           `))
           return
       }
   }
   ```
4. Ensure `/corridors` and `/builder/` routes also fall through to serve `static/index.html` cleanly.

---

## Task 2: Corridor Plottings 360 — Neon Plot Boundaries & Shareable Plot QR Modal

### A. Add Neon Plot & Plotting Dock Styles to `static/css/style.css`
```css
/* ==========================================================================
   CORRIDOR PLOTTINGS 360 — NEON PLOT BOUNDARIES & RATE SHEET GATE
   ========================================================================== */
.pnlm-neon-plot {
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.neon-plot-box {
  padding: 6px 12px;
  border-radius: 8px;
  font-family: 'Space Grotesk', monospace, sans-serif;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease;
  white-space: nowrap;
}

.neon-plot-box:hover {
  transform: scale(1.12);
}

.neon-plot-available {
  background: rgba(16, 185, 129, 0.22);
  border: 2px solid #10B981;
  color: #ECFDF5;
  box-shadow: 0 0 18px rgba(16, 185, 129, 0.85), inset 0 0 10px rgba(16, 185, 129, 0.35);
}

.neon-plot-sold {
  background: rgba(239, 68, 68, 0.22);
  border: 2px solid #EF4444;
  color: #FEF2F2;
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.8), inset 0 0 8px rgba(239, 68, 68, 0.3);
}

.neon-plot-hold {
  background: rgba(245, 158, 11, 0.22);
  border: 2px solid #F59E0B;
  color: #FFFBEB;
  box-shadow: 0 0 16px rgba(245, 158, 11, 0.8);
}

.plot-sub-size {
  font-size: 0.66rem;
  opacity: 0.9;
  font-weight: 600;
}

.btn-unlock-rates {
  background: linear-gradient(135deg, #FFF2B2 0%, #D4AF37 100%);
  color: #0B0D10;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 0.88rem;
  padding: 11px 20px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.45);
}
```

### B. Add Plot Detail + Referral QR Modal & Rate-Sheet Lead Modal in `static/index.html`
Add these two modals before `</body>`:

```html
<!-- MODAL: PLOT DETAIL + REFERRAL SHARE QR CODE -->
<div id="modalPlotDetail" class="modal-overlay">
  <div class="modal-container" style="max-width: 460px; text-align: center;">
    <button class="modal-close-btn">&times;</button>
    <div class="modal-body" style="padding: 28px;">
      <div id="plotDetailStatusBadge" class="badge-available" style="margin-bottom: 10px;">AVAILABLE PLOT</div>
      <h3 id="plotDetailTitle" class="font-heading" style="font-size: 1.6rem; color: #FFF; margin-bottom: 6px;">Plot #14 • East Facing</h3>
      <p id="plotDetailMeta" style="font-family: 'Space Grotesk'; font-size: 0.92rem; color: #FCEBA7; margin-bottom: 18px;">30 × 50 ft (1,500 Sq.Ft.) • 40ft Main Road</p>
      
      <div style="background: rgba(11,13,16,0.7); border: 1px solid rgba(212,175,55,0.25); border-radius: 12px; padding: 14px; margin-bottom: 18px; text-align: left; font-size: 0.85rem; color: #CBD5E1;">
        <div><strong style="color:#D4AF37;">Colony:</strong> <span id="plotDetailColony">Tathastu Greens • Super Corridor</span></div>
        <div style="margin-top:4px;"><strong style="color:#D4AF37;">Facing &amp; Vastu:</strong> <span id="plotDetailFacing">East Facing (Morning Sun)</span></div>
        <div style="margin-top:4px;"><strong style="color:#D4AF37;">Rate / Price:</strong> <span id="plotDetailPrice">Unlock Rate Sheet for Offer Price</span></div>
      </div>

      <!-- Direct Plot Share QR Code for Referrals / Relatives -->
      <div style="background:#FFF; padding:12px; border-radius:12px; display:inline-block; margin-bottom:10px;">
        <img id="plotShareQRImg" src="" alt="Plot Referral QR" style="width:150px; height:150px; display:block;">
      </div>
      <p style="font-size:0.76rem; color:#94A3B8; margin-bottom:16px;">Scan or share this QR with family/referrals to open this exact plot directly.</p>

      <div style="display:flex; gap:10px;">
        <button id="btnCopyPlotLink" class="btn-ghost-gold" style="flex:1; padding:10px;"><i class="fas fa-share-alt"></i> Share Plot</button>
        <button id="btnPlotUnlockRate" class="btn-gold" style="flex:1.2; padding:10px;"><i class="fas fa-lock-open"></i> Unlock Rate Sheet</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL: RATE SHEET LEAD GATE (FOR COLONIES) -->
<div id="modalRateSheet" class="modal-overlay">
  <div class="modal-container" style="max-width: 440px;">
    <button class="modal-close-btn">&times;</button>
    <div class="modal-body" style="padding: 28px;">
      <div class="hero-badge" style="margin-bottom: 10px;"><i class="fas fa-file-invoice-dollar text-gold"></i> <span>OFFICIAL RATE SHEET &amp; MAP</span></div>
      <h3 class="font-heading" style="font-size: 1.5rem; color: #FFF; margin-bottom: 6px;">Unlock Colony Rate Sheet</h3>
      <p style="font-size: 0.85rem; color: #94A3B8; margin-bottom: 18px;">Enter your WhatsApp number to get exact per-sq.ft. pricing, payment plan, and RERA/TNCP brochure instantly.</p>
      <form id="rateSheetForm">
        <div class="form-group">
          <label class="form-label">Your Name</label>
          <input type="text" id="rateLeadName" class="form-control" placeholder="e.g. Rohit Sharma" required>
        </div>
        <div class="form-group">
          <label class="form-label">WhatsApp Number</label>
          <input type="tel" id="rateLeadPhone" class="form-control" placeholder="+91 98260 XXXXX" required>
        </div>
        <button type="submit" class="btn-gold" style="width:100%; padding:12px;">
          <i class="fab fa-whatsapp"></i> Unlock &amp; Send on WhatsApp
        </button>
      </form>
    </div>
  </div>
</div>
```

### C. Update Unified Viewer & Route Handling in `static/js/app.js`
1. Support `/p/{slug}`, `/corridors`, and `/builder/{token}` in `handleRouting()` (in addition to `#tour/...` and `#b/...`).
2. Inside `openTourViewer()`, check `project.mode === "plot"`:
   - **If `mode === "flat"`:** Show the **Day | Sunset | Night** lighting pill in `.hud-top-right` and standard WhatsApp CTA.
   - **If `mode === "plot"`:** Hide the Day/Night pill, render **Glowing Neon Plot Hotspots** (`plotHotspots`) inside Pannellum using `.neon-plot-box` (`neon-plot-available` / `neon-plot-sold` / `neon-plot-hold`), and show the **`[ 🔒 Unlock Rate Sheet ]`** button in the bottom dock.
   - Clicking any Neon Plot hotspot opens `#modalPlotDetail` populated with that plot's dimensions, facing, colony name, and a generated QR code pointing directly to `${window.location.origin}/p/${project.slug}?plot=${plot.id}` (if `?plot=` is in the URL on load, auto-pan Pannellum to that plot's `yaw`/`pitch` and open its detail card!).
3. Add `#viewCorridors` discovery view for `/corridors` with filter pills: `All | Corridor Plottings | Flats & Villas` and corridor filter chips (`Super Corridor`, `AB Road Bypass`, `Ujjain Road`, `Rau`, `Khandwa Road`).

---

## Task 3: Admin Panel Kill-Switch UI (`static/js/admin.js`)

Inside `AdminEngine` in `static/js/admin.js`, add a **"⚡ Kill-Switch"** button to `.admin-floating-dock` that opens the **Client Tour Kill-Switch Modal** (using `ADMIN_PIN = "202699"` or matching `X-Admin-Pin` header):

```javascript
async openKillSwitchModal() {
  const ADMIN_PIN = localStorage.getItem("tours360_admin_pin") || "202699";
  const modal = document.createElement("div");
  modal.className = "admin-modal-overlay";
  modal.innerHTML = `
    <div class="admin-modal-box" style="max-width: 540px;">
      <div class="admin-modal-header">
        <h3 class="admin-modal-title"><i class="fas fa-power-off text-gold"></i> Client Tour Kill-Switch (Live Control)</h3>
        <button class="admin-close-x" onclick="this.closest('.admin-modal-overlay').remove()">&times;</button>
      </div>
      <p style="font-size:0.82rem; color:#94A3B8; margin-bottom:14px;">
        Toggle any builder or colony between <strong style="color:#34D399;">ACTIVE (Green)</strong> and <strong style="color:#F87171;">PAUSED (Red)</strong>. Pausing immediately expires QR codes, /p/{slug} links, and builder website widgets without redeploying.
      </p>
      <div id="client-toggle-list">Loading projects...</div>
    </div>
  `;
  document.body.appendChild(modal);

  async function loadClientSwitches() {
    const res = await fetch("/api/admin/projects", {
      headers: { "X-Admin-Pin": ADMIN_PIN }
    });
    const container = modal.querySelector("#client-toggle-list");
    if (!res.ok) {
      container.innerHTML = `<p style="color:#EF4444;">Unauthorized: Check ADMIN_PIN (202699).</p>`;
      return;
    }
    const projects = await res.json();
    container.innerHTML = "";

    Object.entries(projects).forEach(([slug, isActive]) => {
      const row = document.createElement("div");
      row.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:#0B0D10; border:1px solid rgba(212,175,55,0.2); border-radius:10px; margin-bottom:8px;";

      const label = document.createElement("span");
      label.textContent = slug;
      label.style.cssText = "color:#f3f4f6; font-weight:600; font-family:'Space Grotesk', monospace; font-size:14px;";

      const btn = document.createElement("button");
      btn.textContent = isActive ? "● ACTIVE (ON)" : "● PAUSED (OFF)";
      btn.style.cssText = isActive
        ? "background:#065f46; color:#34d399; border:1px solid #10b981; padding:6px 14px; border-radius:20px; font-weight:bold; cursor:pointer;"
        : "background:#7f1d1d; color:#f87171; border:1px solid #ef4444; padding:6px 14px; border-radius:20px; font-weight:bold; cursor:pointer;";

      btn.onclick = async () => {
        await fetch("/api/admin/toggle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Pin": ADMIN_PIN
          },
          body: JSON.stringify({ slug: slug, active: !isActive })
        });
        loadClientSwitches();
      };

      row.appendChild(label);
      row.appendChild(btn);
      container.appendChild(row);
    });
  }

  loadClientSwitches();
}
```

---

## Task 4: Create `static/widget.js` with Auto Kill-Switch Check

Create `static/widget.js` so any builder website embedding `<script src="https://tours360.in/widget.js" data-client="tathastu-greens"></script>` automatically checks `/api/status?client={slug}` before rendering the floating 360° button:

```javascript
(function () {
  const scriptEl = document.currentScript;
  const clientSlug = scriptEl?.getAttribute("data-client") || "";
  const BASE_URL = new URL(scriptEl.src).origin;

  function initTours360Widget() {
    const btn = document.createElement("a");
    btn.href = `${BASE_URL}/p/${clientSlug}`;
    btn.target = "_blank";
    btn.innerHTML = "🌐 Walk Inside 360°";
    btn.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:99999;background:linear-gradient(135deg,#FFF2B2,#D4AF37);color:#0B0D10;font-family:sans-serif;font-weight:800;font-size:14px;padding:12px 20px;border-radius:9999px;text-decoration:none;box-shadow:0 8px 25px rgba(212,175,55,0.45);";
    document.body.appendChild(btn);
  }

  fetch(`${BASE_URL}/api/status?client=${encodeURIComponent(clientSlug)}`)
    .then(r => r.json())
    .then(data => {
      if (!data.active) {
        console.log("Tours 360: Project paused.");
        return;
      }
      initTours360Widget();
    })
    .catch(() => {});
})();
```

---

## Task 5: Create `scripts/tours360_publish.sh` (The "Anti-Gravity" Ubuntu CLI)

Create `scripts/tours360_publish.sh` (executable via `chmod +x`) to compress 10 MB panoramas into 4096×2048 WebP (~450 KB), sync to Cloudflare R2 (`r2://tours360-media/{slug}/`), generate lightweight `configs/{slug}.json` (4 KB), and create a print-ready Hoarding QR PNG (`{slug}-qr.png`).

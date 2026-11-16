# Antigravity (agy) Patch — Complete Luxury Admin Panel System for Tours360.in

> **Instructions for Antigravity Agent (agy):**  
> Apply this patch to integrate a complete, luxury floating **Admin Console & Dashboard** for `tours360.in`.  
> 1. Create `static/css/admin.css` with dark luxury glassmorphism styles.  
> 2. Create `static/js/admin.js` with the secret high-frequency tap trigger on `.brand-icon-box` (8 rapid taps on phone within 2s, 18 rapid clicks on laptop within 3.5s), self-mounting floating Admin Dock, Quick Project Creator, Floorplan Pin Tool, and Inquiries Lead Viewer.  
> 3. Link `admin.css` and `admin.js` in `static/index.html`.  
> 4. Add the `GET /api/inquiries` endpoint in `main.go` so the admin panel can read leads.

---

## Task 1: Create `static/css/admin.css`

Create `static/css/admin.css` (or `css/admin.css`):

```css
/* ==========================================================================
   TOURS360.IN — LUXURY OBSIDIAN & GOLD ADMIN CONSOLE STYLES
   ========================================================================== */

/* Floating Admin Bottom Dock */
.admin-floating-dock {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  background: rgba(11, 13, 16, 0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid #D4AF37;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(212, 175, 55, 0.35);
  border-radius: 9999px;
  padding: 8px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: adminDockSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes adminDockSlideUp {
  from { transform: translate(-50%, 40px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

.admin-dock-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Space Grotesk', monospace, sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  color: #0B0D10;
  background: linear-gradient(135deg, #FFF2B2 0%, #D4AF37 50%, #996515 100%);
  padding: 4px 12px;
  border-radius: 9999px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.admin-dock-btn {
  background: rgba(21, 25, 33, 0.85);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: #F8F9FA;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.admin-dock-btn i {
  color: #D4AF37;
  font-size: 0.85rem;
}

.admin-dock-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #D4AF37;
  transform: translateY(-2px);
  color: #FFFFFF;
}

.admin-dock-btn-lock {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #FCA5A5;
}

.admin-dock-btn-lock:hover {
  background: #EF4444;
  border-color: #EF4444;
  color: #FFFFFF;
}

/* Admin Modals & Drawers */
.admin-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100000;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: adminFadeIn 0.25s ease;
}

@keyframes adminFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.admin-modal-box {
  background: #151921;
  border: 1.5px solid rgba(212, 175, 55, 0.4);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 175, 55, 0.2);
  border-radius: 20px;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
  color: #F8F9FA;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.admin-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.admin-modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-close-x {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #CBD5E1;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.admin-close-x:hover {
  background: #EF4444;
  color: #FFFFFF;
}

/* Inquiries Table */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  margin-top: 14px;
}

.admin-table th {
  background: #0B0D10;
  color: #D4AF37;
  font-family: 'Space Grotesk', monospace, sans-serif;
  text-align: left;
  padding: 10px 14px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.admin-table td {
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #CBD5E1;
}

.admin-table tr:hover td {
  background: rgba(212, 175, 55, 0.05);
}

/* Pin Calibration Mode Active Banner */
.admin-calib-banner {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100000;
  background: #D4AF37;
  color: #0B0D10;
  font-family: 'Space Grotesk', monospace, sans-serif;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 8px 24px;
  border-radius: 9999px;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.6);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: pulseGold 2s infinite;
}

@keyframes pulseGold {
  0% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.4); }
  50% { box-shadow: 0 0 25px rgba(212, 175, 55, 0.9); }
  100% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.4); }
}

@media (max-width: 768px) {
  .admin-floating-dock {
    width: calc(100% - 24px);
    overflow-x: auto;
    border-radius: 16px;
    bottom: 12px;
    padding: 8px 12px;
    justify-content: flex-start;
  }
}
```

---

## Task 2: Create `static/js/admin.js` (With Secret 8-Tap Phone / 18-Click Laptop on Icon Only)

Create `static/js/admin.js` (or `js/admin.js`). Notice the updated `bindSecretTap()` function:  
- It binds **strictly to `.brand-icon-box`** (only the logo icon, never the text name).  
- It checks device type: **Phone requires 8 rapid taps** (within 1.8s rolling window), **Laptop requires 18 rapid clicks** (within 3.5s rolling window).  
- Standard visitors clicking normally (1, 2, or 3 times) will never trigger it.

```javascript
/**
 * ============================================================================
 * TOURS360.IN — LUXURY ADMIN CONSOLE CONTROLLER (admin.js)
 * ============================================================================
 */

(function () {
  "use strict";

  const AdminEngine = {
    isUnlocked: false,
    calibrationActive: false,

    init() {
      // 1. Check if admin mode is unlocked via query param or localStorage
      const hasQueryParam = window.location.search.includes("admin=true") || window.location.hash.includes("admin");
      const hasStorage = localStorage.getItem("tours360_admin_unlocked") === "true";

      if (hasQueryParam || hasStorage) {
        this.unlockAdmin(false);
      }

      // 2. Setup secret multi-tap listener on LOGO ICON ONLY
      this.bindSecretTap();
    },

    bindSecretTap() {
      let tapHistory = [];

      const handleIconTap = (e) => {
        // Stop default navigation of the parent <a> tag when rapidly tapping icon
        e.stopPropagation();

        const now = Date.now();
        tapHistory.push(now);

        // Detect device: Phone (Touch / Screen <= 768px) vs Laptop / Desktop
        const isPhone = window.innerWidth <= 768 || ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches);
        const requiredTaps = isPhone ? 8 : 18;       // Phone: 8 rapid taps, Laptop: 18 rapid clicks
        const windowTime = isPhone ? 1800 : 3500;   // 1.8s for phone, 3.5s for laptop

        // Keep only taps inside the sliding time window
        tapHistory = tapHistory.filter(t => now - t <= windowTime);

        if (tapHistory.length >= requiredTaps) {
          tapHistory = []; // Reset counter
          e.preventDefault();

          if (this.isUnlocked) {
            this.showToast("👑 Admin Console already active!");
            return;
          }

          // Trigger Security PIN verification
          const pin = prompt("🔐 Tours360 Admin Mode\nEnter 4-digit security PIN (Default: 3600):");
          if (pin === "04042026") {
            this.unlockAdmin(true);
          } else if (pin !== null) {
            alert("❌ Incorrect Admin PIN");
          }
        }
      };

      // BIND STRICTLY TO THE LOGO ICON BOX (NOT the text or brand title)
      document.querySelectorAll(".brand-icon-box").forEach(iconEl => {
        iconEl.style.cursor = "pointer";
        iconEl.addEventListener("click", handleIconTap);
        iconEl.addEventListener("touchend", handleIconTap);
      });
    },

    unlockAdmin(showToastMsg = true) {
      this.isUnlocked = true;
      localStorage.setItem("tours360_admin_unlocked", "true");

      // Render Floating Admin Dock
      this.renderDock();

      // Refresh partner triggers so "+ Add Partner" appears
      if (window.Tours360App && typeof window.Tours360App.renderPartners === "function") {
        window.Tours360App.renderPartners();
      }

      if (showToastMsg) {
        this.showToast("👑 Admin Console Unlocked! Dock loaded.");
      }
    },

    lockAdmin() {
      this.isUnlocked = false;
      localStorage.removeItem("tours360_admin_unlocked");
      const dock = document.getElementById("adminFloatingDock");
      if (dock) dock.remove();

      this.disableCalibration();
      this.showToast("🔒 Admin Mode Locked.");
      window.location.reload();
    },

    renderDock() {
      if (document.getElementById("adminFloatingDock")) return;

      const dock = document.createElement("div");
      dock.id = "adminFloatingDock";
      dock.className = "admin-floating-dock";

      dock.innerHTML = `
        <div class="admin-dock-badge">
          <i class="fas fa-crown"></i> Admin
        </div>
        <button id="adminBtnAddProject" class="admin-dock-btn" title="Add New Builder Project">
          <i class="fas fa-plus-circle"></i> + Project
        </button>
        <button id="adminBtnViewLeads" class="admin-dock-btn" title="View 48-Hour Shoot Leads">
          <i class="fas fa-clipboard-list"></i> Leads
        </button>
        <button id="adminBtnCalibrate" class="admin-dock-btn" title="Click anywhere to get exact 360 Coordinates & Floorplan Pins">
          <i class="fas fa-crosshairs"></i> Pin Helper
        </button>
        <button id="adminBtnLock" class="admin-dock-btn admin-dock-btn-lock" title="Lock Admin Mode">
          <i class="fas fa-lock"></i> Exit
        </button>
      `;

      document.body.appendChild(dock);

      // Bind dock buttons
      document.getElementById("adminBtnAddProject").onclick = () => this.openAddProjectModal();
      document.getElementById("adminBtnViewLeads").onclick = () => this.openLeadsModal();
      document.getElementById("adminBtnCalibrate").onclick = () => this.toggleCalibration();
      document.getElementById("adminBtnLock").onclick = () => this.lockAdmin();
    },

    openAddProjectModal() {
      const modal = document.createElement("div");
      modal.className = "admin-modal-overlay";
      modal.innerHTML = `
        <div class="admin-modal-box">
          <div class="admin-modal-header">
            <h3 class="admin-modal-title"><i class="fas fa-building text-gold"></i> Add New Builder Project</h3>
            <button class="admin-close-x" onclick="this.closest('.admin-modal-overlay').remove()">&times;</button>
          </div>
          <form id="adminProjectForm">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
              <div>
                <label style="font-size:0.8rem; color:#94A3B8;">Builder Slug</label>
                <input type="text" id="admBuilderSlug" class="form-control" placeholder="e.g. maheshwari-group" required value="${window.TOURS360_DATA?.builders[0]?.slug || ''}">
              </div>
              <div>
                <label style="font-size:0.8rem; color:#94A3B8;">Project Title</label>
                <input type="text" id="admProjectTitle" class="form-control" placeholder="e.g. Royal Greens 3BHK" required>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
              <div>
                <label style="font-size:0.8rem; color:#94A3B8;">Carpet Area</label>
                <input type="text" id="admCarpet" class="form-control" placeholder="e.g. 2,400 Sq.Ft." required>
              </div>
              <div>
                <label style="font-size:0.8rem; color:#94A3B8;">Price Display</label>
                <input type="text" id="admPrice" class="form-control" placeholder="e.g. ₹ 2.25 Cr" required>
              </div>
            </div>
            <div style="margin-bottom: 14px;">
              <label style="font-size:0.8rem; color:#94A3B8;">360 Living Room Panorama Path (.webp / .jpg)</label>
              <input type="text" id="admPanoPath" class="form-control" placeholder="assets/panos/living_day.jpg" required value="assets/panos/living_day.jpg">
            </div>
            <button type="submit" class="btn-gold" style="width: 100%; padding: 12px; margin-top: 10px;">
              <i class="fas fa-check"></i> Add Project Live at #1 Rank
            </button>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#adminProjectForm").onsubmit = (e) => {
        e.preventDefault();
        const slug = modal.querySelector("#admProjectTitle").value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const newProj = {
          id: `p-${slug}`,
          slug: slug,
          builderSlug: modal.querySelector("#admBuilderSlug").value,
          title: modal.querySelector("#admProjectTitle").value,
          tagline: "Newly Added Luxury Residence with 360° Digital Twin",
          category: "3BHK",
          carpetSqFt: parseInt(modal.querySelector("#admCarpet").value.replace(/[^0-9]/g, "")) || 2000,
          facing: "East Facing (Sunrise Vastu)",
          status: "AVAILABLE",
          priceDisplay: modal.querySelector("#admPrice").value,
          pricePerSqFt: "₹ 7,500 / Sq.Ft.",
          thumbnail: modal.querySelector("#admPanoPath").value,
          createdAt: new Date().toISOString(),
          defaultSceneId: "living"
        };

        if (window.TOURS360_DATA && window.TOURS360_DATA.projects) {
          window.TOURS360_DATA.projects.unshift(newProj);
        }

        modal.remove();
        this.showToast(`✨ Added "${newProj.title}" at Rank #1!`);

        // Reload views if open
        if (window.location.hash.startsWith("#b/")) {
          window.location.reload();
        }
      };
    },

    async openLeadsModal() {
      const modal = document.createElement("div");
      modal.className = "admin-modal-overlay";
      modal.innerHTML = `
        <div class="admin-modal-box" style="max-width: 800px;">
          <div class="admin-modal-header">
            <h3 class="admin-modal-title"><i class="fas fa-clipboard-list text-gold"></i> 48-Hour Demo Shoot Inquiries</h3>
            <button class="admin-close-x" onclick="this.closest('.admin-modal-overlay').remove()">&times;</button>
          </div>
          <div id="adminLeadsContent">
            <p style="color:#94A3B8; font-size: 0.9rem;">Loading inquiries from inquiries.json...</p>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      try {
        const resp = await fetch("/api/inquiries");
        if (!resp.ok) throw new Error("Could not fetch inquiries");
        const inquiries = await resp.json();

        const container = modal.querySelector("#adminLeadsContent");
        if (!inquiries || inquiries.length === 0) {
          container.innerHTML = `<p style="color:#94A3B8; padding: 20px 0; text-align: center;">No inquiries logged yet. Test by submitting the 48-Hr Shoot modal on the site.</p>`;
          return;
        }

        let tableHtml = `
          <div style="overflow-x: auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Developer</th>
                  <th>Project</th>
                  <th>Contact</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
        `;

        inquiries.reverse().forEach(inq => {
          tableHtml += `
            <tr>
              <td>${new Date(inq.createdAt || Date.now()).toLocaleDateString("en-IN")}</td>
              <td style="color:#FFF; font-weight:700;">${inq.developer || "-"}</td>
              <td>${inq.project || "-"} (${inq.location || "-"})</td>
              <td>${inq.contact || "-"}</td>
              <td style="color:#10B981; font-family:'Space Grotesk'; font-weight:700;">${inq.phone || "-"}</td>
            </tr>
          `;
        });

        tableHtml += `</tbody></table></div>`;
        container.innerHTML = tableHtml;

      } catch (err) {
        modal.querySelector("#adminLeadsContent").innerHTML = `
          <p style="color:#EF4444; font-size:0.9rem;">Note: Run Go server with /api/inquiries endpoint to read from inquiries.json directly.</p>
        `;
      }
    },

    toggleCalibration() {
      this.calibrationActive = !this.calibrationActive;
      let banner = document.getElementById("adminCalibBanner");

      if (this.calibrationActive) {
        if (!banner) {
          banner = document.createElement("div");
          banner.id = "adminCalibBanner";
          banner.className = "admin-calib-banner";
          banner.innerHTML = `<i class="fas fa-crosshairs"></i> PIN HELPER ACTIVE: Click anywhere on 360 or floorplan for coordinates!`;
          document.body.appendChild(banner);
        }

        // Global click handler to report Pitch/Yaw or Floorplan X/Y
        window.__adminClickHandler = (e) => {
          if (window.panoViewer && document.getElementById("viewTour")?.classList.contains("view-active")) {
            const pitch = window.panoViewer.getPitch().toFixed(1);
            const yaw = window.panoViewer.getYaw().toFixed(1);
            alert(`📍 360° HOTSPOT COORDS:\nPitch: ${pitch}\nYaw: ${yaw}\n\nCopy: "pitch": ${pitch}, "yaw": ${yaw}`);
          }
        };
        window.addEventListener("click", window.__adminClickHandler, true);
        this.showToast("Pin Helper ON! Click on 360 view to get Pitch & Yaw.");
      } else {
        this.disableCalibration();
      }
    },

    disableCalibration() {
      this.calibrationActive = false;
      const banner = document.getElementById("adminCalibBanner");
      if (banner) banner.remove();
      if (window.__adminClickHandler) {
        window.removeEventListener("click", window.__adminClickHandler, true);
      }
    },

    showToast(msg) {
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.style.cssText = "position:fixed;top:20px;right:20px;z-index:100001;background:#151921;border:1.5px solid #D4AF37;color:#FFF;padding:10px 18px;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.88rem;box-shadow:0 8px 30px rgba(0,0,0,0.8);";
      toast.innerHTML = `<i class="fas fa-crown text-gold" style="margin-right:8px;"></i> ${msg}`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);
    }
  };

  // Run on DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => AdminEngine.init());
  } else {
    AdminEngine.init();
  }

  window.Tours360Admin = AdminEngine;
})();
```

---

## Task 3: Link `admin.css` and `admin.js` in `static/index.html`

In `static/index.html`:

1. In the `<head>` section, right below `<link rel="stylesheet" href="css/style.css">`, add:
```html
  <!-- Tours360 Admin Console Stylesheet -->
  <link rel="stylesheet" href="css/admin.css">
```

2. At the bottom of `<body>`, right below `<script src="js/app.js"></script>`, add:
```html
  <!-- Tours360 Admin Console Engine -->
  <script src="js/admin.js"></script>
```

---

## Task 4: Add `GET /api/inquiries` in `main.go`

In `main.go`, add an endpoint to read all logged inquiries from `inquiries.json` as JSON:

```go
// Inside main() in main.go after mux := http.NewServeMux():
mux.HandleFunc("/api/inquiries", func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache")

	data, err := os.ReadFile("inquiries.json")
	if err != nil {
		w.Write([]byte("[]"))
		return
	}

	// inquiries.json stores one JSON object per line; convert to JSON array
	lines := strings.Split(strings.TrimSpace(string(data)), "\n")
	var items []string
	for _, l := range lines {
		l = strings.TrimSpace(l)
		if l != "" {
			items = append(items, l)
		}
	}

	w.Write([]byte("[" + strings.Join(items, ",") + "]"))
})
```

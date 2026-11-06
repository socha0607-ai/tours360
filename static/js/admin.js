/**
 * ============================================================================
 * TOURS360.IN — LUXURY ADMIN CONSOLE CONTROLLER (admin.js v2)
 * ============================================================================
 */

(function () {
  "use strict";

  const AdminEngine = {
    isUnlocked: false,

    init() {
      // 1. Check for URL parameter '?admin=true' or '#admin'
      const hasUrlParam = window.location.search.includes("admin=true") || window.location.hash.includes("admin");
      const hasSession = sessionStorage.getItem("tours360_admin_active") === "true";

      if (hasUrlParam) {
        // Direct PIN Prompt when accessed via ?admin=true
        setTimeout(() => this.promptPin(), 400);
      } else if (hasSession) {
        this.unlockAdmin(false);
      }

      // 2. Setup Secret Taps on the Logo Icon
      this.bindSecretTap();

      // 3. Setup Centered Landscape Rotation Modal Monitor
      this.setupMobileRotationModal();
    },

    bindSecretTap() {
      let tapHistory = [];

      const handleIconTap = (e) => {
        e.stopPropagation();

        const now = Date.now();
        tapHistory.push(now);

        const isPhone = window.innerWidth <= 768 || ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches);
        const requiredTaps = isPhone ? 8 : 18;       // 8 on phone, 18 on laptop
        const windowTime = isPhone ? 1800 : 3500;   // 1.8s phone, 3.5s laptop

        tapHistory = tapHistory.filter(t => now - t <= windowTime);

        if (tapHistory.length >= requiredTaps) {
          tapHistory = [];
          e.preventDefault();
          this.promptPin();
        }
      };

      document.querySelectorAll(".brand-icon-box").forEach(iconEl => {
        iconEl.style.cursor = "pointer";
        iconEl.addEventListener("click", handleIconTap);
        iconEl.addEventListener("touchend", handleIconTap);
      });
    },

    promptPin() {
      if (this.isUnlocked) {
        this.showToast("👑 Admin Console is already active!");
        return;
      }

      const pin = prompt("🔐 Tours360 Admin Mode\nEnter security PIN :");
      if (pin === "04042026") {
        this.unlockAdmin(true);
      } else if (pin !== null) {
        alert("❌ Incorrect Admin PIN");
      }
    },

    unlockAdmin(showToastMsg = true) {
      this.isUnlocked = true;
      sessionStorage.setItem("tours360_admin_active", "true");

      // Render Floating Admin Dock immediately
      this.renderDock();

      if (showToastMsg) {
        this.showToast("👑 Admin Console Unlocked! Dock loaded.");
      }
    },

    lockAdmin() {
      this.isUnlocked = false;
      sessionStorage.removeItem("tours360_admin_active");
      const dock = document.getElementById("adminFloatingDock");
      if (dock) dock.remove();

      this.showToast("🔒 Admin Mode Locked.");
      // Clean URL if ?admin=true is present
      if (window.location.search.includes("admin=true")) {
        const url = new URL(window.location);
        url.searchParams.delete("admin");
        window.history.replaceState({}, document.title, url.toString());
      }
      window.location.reload();
    },

    renderDock() {
      const existing = document.getElementById("adminFloatingDock");
      if (existing) existing.remove();

      const dock = document.createElement("div");
      dock.id = "adminFloatingDock";
      dock.className = "admin-floating-dock";

      dock.innerHTML = `
        <div class="admin-dock-badge">
          <i class="fas fa-crown"></i> Admin
        </div>
        <button id="adminBtnPinStudio" class="admin-dock-btn" title="Visual 2D Blueprint & 360 Hotspot Studio">
          <i class="fas fa-map-pin"></i> Pin Studio
        </button>
        <button id="adminBtnAddProject" class="admin-dock-btn" title="Add New Builder Project">
          <i class="fas fa-plus-circle"></i> + Project
        </button>
        <button id="adminBtnViewLeads" class="admin-dock-btn" title="View 48-Hour Shoot Leads">
          <i class="fas fa-clipboard-list"></i> Leads
        </button>
        <button id="adminBtnLock" class="admin-dock-btn admin-dock-btn-lock" title="Lock Admin Mode">
          <i class="fas fa-lock"></i> Exit
        </button>
      `;

      document.body.appendChild(dock);

      document.getElementById("adminBtnPinStudio").onclick = () => this.openPinStudioModal();
      document.getElementById("adminBtnAddProject").onclick = () => this.openAddProjectModal();
      document.getElementById("adminBtnViewLeads").onclick = () => this.openLeadsModal();
      document.getElementById("adminBtnLock").onclick = () => this.lockAdmin();
    },

    /**
     * VISUAL 2D BLUEPRINT & 360° PIN STUDIO
     */
    openPinStudioModal() {
      const projects = window.TOURS360_DATA?.projects || [];
      const currentProj = window.TOURS360_DATA?.getProject(window.location.hash.split("/")[1]) || projects[0];
      const blueprintUrl = currentProj?.floorplan?.blueprintImage || "assets/images/floorplan.svg";

      const modal = document.createElement("div");
      modal.className = "admin-modal-overlay";
      modal.innerHTML = `
        <div class="admin-modal-box">
          <div class="admin-modal-header">
            <h3 class="admin-modal-title"><i class="fas fa-map-pin text-gold"></i> Visual Pin &amp; Hotspot Studio</h3>
            <button class="admin-close-x" onclick="this.closest('.admin-modal-overlay').remove()">&times;</button>
          </div>

          <div class="studio-tabs">
            <button id="tab2DBlueprint" class="studio-tab-btn active">🗺️ 2D Blueprint Pin Mapper</button>
            <button id="tab360Hotspot" class="studio-tab-btn">🌐 360° Pan / Tilt Hotspot</button>
          </div>

          <!-- TAB 1: 2D BLUEPRINT CLICK MAPPER -->
          <div id="panel2DBlueprint">
            <p style="font-size:0.84rem; color:#CBD5E1; margin-bottom:10px;">
               Click anywhere on the blueprint below to place a pin (Porch, Balcony, Bathroom, Pool). The JSON snippet will generate automatically:
            </p>

            <div id="blueprintStage" class="blueprint-clickable-stage">
              <img id="blueprintStudioImg" src="${blueprintUrl}" alt="Blueprint">
              <div id="blueprintStudioMarker" class="interactive-marker-dot" style="display:none;"></div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:14px;">
              <div>
                <label style="font-size:0.75rem; color:#94A3B8;">Target Room / Scene ID</label>
                <input type="text" id="pinSceneId" class="form-control" value="balcony" placeholder="e.g. balcony, porch, bathroom">
              </div>
              <div>
                <label style="font-size:0.75rem; color:#94A3B8;">Room Title &amp; Vastu</label>
                <input type="text" id="pinRoomTitle" class="form-control" value="East Balcony (पूर्व)" placeholder="e.g. Master Suite (नैऋत्य)">
              </div>
            </div>

            <div class="code-output-box" id="blueprintCodeOutput">// Click on the blueprint image above to generate JSON...</div>
            <button id="btnCopyBlueprintJSON" class="btn-gold" style="width:100%; margin-top:10px; padding:10px;">
              <i class="fas fa-copy"></i> Copy Pin JSON to Clipboard
            </button>
          </div>

          <!-- TAB 2: 360 PAN & TILT HOTSPOT GENERATOR -->
          <div id="panel360Hotspot" style="display:none;">
            <p style="font-size:0.84rem; color:#CBD5E1; margin-bottom:12px;">
              Look around inside any 360° room. Click the capture button below to grab the exact Pitch &amp; Yaw of where you are looking:
            </p>

            <div style="display:flex; gap:12px; margin-bottom:12px;">
              <button id="btnCaptureCurrentPano" class="btn-ghost-gold" style="flex:1;">
                <i class="fas fa-crosshairs"></i> Capture Current 360° Angle
              </button>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <div>
                <label style="font-size:0.75rem; color:#94A3B8;">Captured Pitch (Vertical)</label>
                <input type="text" id="capturedPitch" class="form-control" value="-12.5" readonly>
              </div>
              <div>
                <label style="font-size:0.75rem; color:#94A3B8;">Captured Yaw (Horizontal)</label>
                <input type="text" id="capturedYaw" class="form-control" value="48.0" readonly>
              </div>
            </div>

            <div style="margin-top:12px;">
              <label style="font-size:0.75rem; color:#94A3B8;">Material Title &amp; Brand</label>
              <input type="text" id="hotspotTitle" class="form-control" value="Kohler Statement Shower (10-Yr Warranty)">
            </div>

            <div class="code-output-box" id="hotspotCodeOutput">// Hotspot JSON will appear here...</div>
            <button id="btnCopyHotspotJSON" class="btn-gold" style="width:100%; margin-top:10px; padding:10px;">
              <i class="fas fa-copy"></i> Copy Hotspot JSON to Clipboard
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Tab Switching
      const tab2D = modal.querySelector("#tab2DBlueprint");
      const tab360 = modal.querySelector("#tab360Hotspot");
      const panel2D = modal.querySelector("#panel2DBlueprint");
      const panel360 = modal.querySelector("#panel360Hotspot");

      tab2D.onclick = () => {
        tab2D.classList.add("active");
        tab360.classList.remove("active");
        panel2D.style.display = "block";
        panel360.style.display = "none";
      };

      tab360.onclick = () => {
        tab360.classList.add("active");
        tab2D.classList.remove("active");
        panel360.style.display = "block";
        panel2D.style.display = "none";
        this.update360HotspotOutput(modal);
      };

      // 2D Blueprint Click Listener
      const stage = modal.querySelector("#blueprintStage");
      const marker = modal.querySelector("#blueprintStudioMarker");
      let currentX = 50.0, currentY = 50.0;

      stage.onclick = (e) => {
        const rect = stage.getBoundingClientRect();
        currentX = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
        currentY = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);

        marker.style.display = "block";
        marker.style.left = `${currentX}%`;
        marker.style.top = `${currentY}%`;

        this.updateBlueprintOutput(modal, currentX, currentY);
      };

      modal.querySelector("#pinSceneId").oninput = () => this.updateBlueprintOutput(modal, currentX, currentY);
      modal.querySelector("#pinRoomTitle").oninput = () => this.updateBlueprintOutput(modal, currentX, currentY);

      modal.querySelector("#btnCopyBlueprintJSON").onclick = () => {
        const code = modal.querySelector("#blueprintCodeOutput").textContent;
        navigator.clipboard.writeText(code).then(() => this.showToast("📋 Blueprint Pin JSON copied!"));
      };

      // 360 Hotspot Capture
      modal.querySelector("#btnCaptureCurrentPano").onclick = () => {
        this.update360HotspotOutput(modal);
        this.showToast("Captured 360° Pitch & Yaw!");
      };

      modal.querySelector("#hotspotTitle").oninput = () => this.update360HotspotOutput(modal);

      modal.querySelector("#btnCopyHotspotJSON").onclick = () => {
        const code = modal.querySelector("#hotspotCodeOutput").textContent;
        navigator.clipboard.writeText(code).then(() => this.showToast("📋 Hotspot JSON copied!"));
      };
    },

    updateBlueprintOutput(modal, x, y) {
      const sceneId = modal.querySelector("#pinSceneId").value.trim() || "room";
      const title = modal.querySelector("#pinRoomTitle").value.trim() || "Room Title";

      const snippet = `{\n  "sceneId": "${sceneId}",\n  "title": "${title}",\n  "x": ${x},\n  "y": ${y}\n}`;
      modal.querySelector("#blueprintCodeOutput").textContent = snippet;
    },

    update360HotspotOutput(modal) {
      let pitch = -10.0, yaw = 35.0;
      if (window.panoViewer) {
        pitch = window.panoViewer.getPitch().toFixed(1);
        yaw = window.panoViewer.getYaw().toFixed(1);
      }

      modal.querySelector("#capturedPitch").value = pitch;
      modal.querySelector("#capturedYaw").value = yaw;

      const title = modal.querySelector("#hotspotTitle").value.trim() || "Luxury Specification";
      const snippet = `{\n  "id": "spec-${Date.now()}",\n  "pitch": ${pitch},\n  "yaw": ${yaw},\n  "title": "${title}",\n  "brand": "Certified Spec",\n  "specDetails": "Verified genuine luxury fitting."\n}`;
      modal.querySelector("#hotspotCodeOutput").textContent = snippet;
    },

    /**
     * CENTERED MOBILE ROTATION POPUP (4-Second Auto-Dismiss)
     */
    setupMobileRotationModal() {
      // Inject Modal Markup if missing
      if (!document.getElementById("mobileRotateModal")) {
        const overlay = document.createElement("div");
        overlay.id = "mobileRotateModal";
        overlay.className = "mobile-rotate-modal-overlay";
        overlay.innerHTML = `
          <div class="mobile-rotate-modal-box">
            <div class="rotate-device-anim">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <h4 class="rotate-modal-title">फोन रोटेट करें (Landscape)</h4>
            <p class="rotate-modal-sub">Rotate you phone to view Best 360 Tour on your Phone</p>
            <div class="rotate-timer-track">
              <div class="rotate-timer-bar"></div>
            </div>
            <button class="btn-rotate-got-it" id="btnDismissRotateModal">Got it (देखें)</button>
          </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector("#btnDismissRotateModal").onclick = () => {
          overlay.style.display = "none";
        };
      }

      const checkOrientation = () => {
        const overlay = document.getElementById("mobileRotateModal");
        if (!overlay) return;

        const isMobile = window.innerWidth <= 768;
        const isPortrait = window.innerHeight > window.innerWidth;
        const inTour = document.getElementById("viewTour")?.classList.contains("view-active");

        if (inTour && isMobile && isPortrait) {
          overlay.style.display = "flex";

          // Auto-dismiss automatically after 4 seconds
          clearTimeout(window.__rotateTimer);
          window.__rotateTimer = setTimeout(() => {
            overlay.style.display = "none";
          }, 4000);
        } else {
          overlay.style.display = "none";
        }
      };

      window.addEventListener("resize", checkOrientation);
      window.addEventListener("orientationchange", () => setTimeout(checkOrientation, 200));

      // Hook into hash navigation to tour
      window.addEventListener("hashchange", () => {
        if (window.location.hash.startsWith("#tour/") || window.location.hash.startsWith("#view/")) {
          setTimeout(checkOrientation, 350);
        }
      });
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

    showToast(msg) {
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.style.cssText = "position:fixed;top:20px;right:20px;z-index:10000001;background:#151921;border:1.5px solid #D4AF37;color:#FFF;padding:10px 18px;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:0.88rem;box-shadow:0 8px 30px rgba(0,0,0,0.8);";
      toast.innerHTML = `<i class="fas fa-crown text-gold" style="margin-right:8px;"></i> ${msg}`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => AdminEngine.init());
  } else {
    AdminEngine.init();
  }

  window.Tours360Admin = AdminEngine;
})();

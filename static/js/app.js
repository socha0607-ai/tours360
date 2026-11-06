/**
 * ============================================================================
 * TOURS360.IN — LUXURY WEBXR & 360° DIGITAL TWIN APPLICATION CONTROLLER
 * ============================================================================
 * Single Page App Router | Pannellum Engine | Vastu & Lighting Time Switcher |
 * Builder Portals | Real QR Engine | Dynamic Inventory & Partner Manager
 * ============================================================================
 */

(function () {
  "use strict";

  // Application State
  const state = {
    currentView: "agency", // 'agency' | 'builder' | 'tour'
    currentBuilderSlug: "maheshwari-group",
    currentProjectSlug: "imperial-grand-4bhk",
    currentSceneId: "living",
    currentLightingMode: "day", // 'day' | 'sunset' | 'night'
    activePartnerTab: "developers", // 'developers' | 'architects' | 'team'
    activeProjectFilter: "all",
    ambientAudioPlaying: localStorage.getItem("tours360_audio_enabled") === "true", // Default muted
    heroViewerInstance: null,
    fullscreenViewerInstance: null,
    clockInterval: null,
    previousView: "agency"
  };

  // Cache DOM references
  const dom = {
    // Views
    viewAgency: document.getElementById("viewAgency"),
    viewBuilder: document.getElementById("viewBuilder"),
    viewTour: document.getElementById("viewTour"),

    // Navigation links
    navLinks: document.querySelectorAll(".nav-link"),

    // Hero Preview
    heroCanvas: document.getElementById("heroPannellumCanvas"),

    // Builder Portal elements
    builderLogo: document.getElementById("builderPortalLogo"),
    builderName: document.getElementById("builderPortalName"),
    builderRera: document.getElementById("builderPortalRera"),
    builderLocation: document.getElementById("builderPortalLocation"),
    builderCallBtn: document.getElementById("builderCallSalesBtn"),
    builderWhatsappBtn: document.getElementById("builderWhatsappBtn"),
    builderStatsContainer: document.getElementById("builderStatsContainer"),
    builderProjectsGrid: document.getElementById("builderProjectsGrid"),
    filterChips: document.querySelectorAll(".filter-chip"),

    // Agency Directory & Partners
    agencyBuildersGrid: document.getElementById("agencyBuildersGrid"),
    partnersGrid: document.getElementById("partnersGrid"),
    partnerTabs: document.querySelectorAll(".partner-tab-btn"),

    // Fullscreen 360 HUD
    hudProjectTitle: document.getElementById("hudProjectTitle"),
    hudRoomTitle: document.getElementById("hudRoomTitle"),
    hudClock: document.getElementById("hudDigitalClock"),
    hudSunOrientation: document.getElementById("hudSunOrientation"),
    lightingButtons: document.querySelectorAll(".lighting-btn"),
    roomCarousel: document.getElementById("hudRoomCarousel"),
    hudWhatsappCTA: document.getElementById("hudWhatsappCTA"),

    // Modals
    modalSpec: document.getElementById("modalSpec"),
    modalQR: document.getElementById("modalQR"),
    modalBooking: document.getElementById("modalBooking"),
    modalAddPartner: document.getElementById("modalAddPartner"),
    modalFloorplan: document.getElementById("modalFloorplan"),

    // QR Modal Fields
    qrImage: document.getElementById("qrDisplayImage"),
    qrProjectName: document.getElementById("qrModalProjectName"),
    qrDownloadBtn: document.getElementById("qrDownloadBtn"),
    qrCopyLinkBtn: document.getElementById("qrCopyLinkBtn"),

    // Spec Modal Fields
    specImg: document.getElementById("specModalImg"),
    specTag: document.getElementById("specModalTag"),
    specTitle: document.getElementById("specModalTitle"),
    specBrand: document.getElementById("specModalBrand"),
    specWarranty: document.getElementById("specModalWarranty"),
    specDesc: document.getElementById("specModalDesc"),

    // Toast Container
    toastContainer: document.getElementById("toastContainer")
  };

  /**
   * ==========================================================================
   * 1. ROUTER & VIEW SWITCHER
   * ==========================================================================
   */
  function handleRouting() {
    const path = window.location.pathname;
    const hash = window.location.hash || "";

    // Support server-side / dynamic path routes (e.g. /b/maheshwari-group, /view/imperial-grand-4bhk)
    if (path.startsWith("/b/")) {
      const builderSlug = path.replace("/b/", "").split("/")[0].trim();
      if (builderSlug) {
        openBuilderPortal(builderSlug, false);
        return;
      }
    } else if (path.startsWith("/view/") || path.startsWith("/tour/")) {
      const clean = path.replace(/^\/(view|tour)\//, "");
      const parts = clean.split("/");
      const projectSlug = parts[0];
      const sceneId = parts[1] || "living";
      if (projectSlug) {
        openTourViewer(projectSlug, sceneId, false);
        return;
      }
    }

    // Support client-side hash routes
    if (hash.startsWith("#b/")) {
      // Builder sub-UI: e.g. #b/maheshwari-group
      const builderSlug = hash.replace("#b/", "").trim();
      openBuilderPortal(builderSlug, false);
    } else if (hash.startsWith("#tour/") || hash.startsWith("#view/")) {
      // Fullscreen 360 viewer: e.g. #tour/imperial-grand-4bhk or #tour/imperial-grand-4bhk/balcony
      const parts = hash.replace(/^#(tour|view)\//, "").split("/");
      const projectSlug = parts[0];
      const sceneId = parts[1] || "living";
      openTourViewer(projectSlug, sceneId, false);
    } else {
      // Main Agency Landing Page
      openAgencyLanding(false);
    }
  }

  function openAgencyLanding(updateHash = true) {
    state.currentView = "agency";
    if (updateHash) {
      window.location.hash = "#agency";
    }

    dom.viewAgency.classList.add("view-active");
    dom.viewBuilder.classList.remove("view-active");
    dom.viewTour.classList.remove("view-active");

    window.scrollTo({ top: 0, behavior: "smooth" });
    initHeroPannellum();
    // Re-trigger layout calculation once view is visible to prevent FOV distortion
    setTimeout(() => {
      if (state.heroViewerInstance && state.currentView === "agency") {
        try {
          state.heroViewerInstance.resize();
          state.heroViewerInstance.setHfov(105, 0);
        } catch (e) {}
      }
    }, 100);
    renderAgencyBuildersDirectory();
    renderPartners(state.activePartnerTab);
  }

  function openBuilderPortal(builderSlug, updateHash = true) {
    const builder = window.TOURS360_DATA.getBuilder(builderSlug) || window.TOURS360_DATA.builders[0];
    state.currentView = "builder";
    state.currentBuilderSlug = builder.slug;

    if (updateHash) {
      window.location.hash = `#b/${builder.slug}`;
    }

    dom.viewAgency.classList.remove("view-active");
    dom.viewBuilder.classList.add("view-active");
    dom.viewTour.classList.remove("view-active");

    window.scrollTo({ top: 0, behavior: "smooth" });
    renderBuilderPortalHeader(builder);
    renderBuilderProjects(builder.slug, state.activeProjectFilter);
  }

  function openTourViewer(projectSlug, sceneId = "living", updateHash = true, fromView = null) {
    if (fromView) {
      state.previousView = fromView;
    } else if (state.currentView !== "tour") {
      state.previousView = state.currentView;
    }
    const project = window.TOURS360_DATA.getProject(projectSlug) || window.TOURS360_DATA.projects[0];
    state.currentView = "tour";
    state.currentProjectSlug = project.slug;
    state.currentSceneId = sceneId;

    if (updateHash) {
      window.location.hash = `#tour/${project.slug}/${sceneId}`;
    }

    dom.viewAgency.classList.remove("view-active");
    dom.viewBuilder.classList.remove("view-active");
    dom.viewTour.classList.add("view-active");

    initFullscreenPannellum(project, sceneId);
    startVastuClock();
    // Issue 2: Check mobile orientation when tour opens
    checkMobileOrientation();
  }

  /**
   * ==========================================================================
   * 2. PANNELLUM 360° INTEGRATION & AMBIENT AUDIO SYNTHESIZER
   * ==========================================================================
   */
  let audioCtx = null;
  let currentOsc = null;
  let gainNode = null;
  let userInteracted = false;

  function playAmbientSound(roomType) {
    if (!state.ambientAudioPlaying) return;
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    if (currentOsc) {
      try {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        setTimeout(() => { try { currentOsc.stop(); } catch(e){} }, 850);
      } catch(e) {}
    }

    // Harmonic room frequencies
    let freq = 220; // Living Room: C3 Warm Pad
    if (roomType === "balcony") freq = 329.63; // Balcony: E4 Morning Breeze
    if (roomType === "kitchen") freq = 261.63; // Kitchen: C4 Crisp Culinary
    if (roomType === "master") freq = 174.0;   // Master Suite: 174Hz Healing Pad
    if (roomType === "bathroom") freq = 285.0; // Bathroom: 285Hz Mineral Spa
    if (roomType === "porch") freq = 196.0;    // Porch: G3 Earthy Open Air

    currentOsc = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    currentOsc.type = "sine";
    currentOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.025, audioCtx.currentTime + 1.5); // Calm, gentle volume

    currentOsc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    currentOsc.start();
  }

  // Global user gesture trigger for browser autoplay compliance (Issue 3)
  function triggerAutoplayOnGesture() {
    if (userInteracted) return;
    userInteracted = true;
    if (state.ambientAudioPlaying) {
      playAmbientSound(state.currentSceneId || "living");
    }
    window.removeEventListener("click", triggerAutoplayOnGesture);
    window.removeEventListener("touchstart", triggerAutoplayOnGesture);
  }
  window.addEventListener("click", triggerAutoplayOnGesture);
  window.addEventListener("touchstart", triggerAutoplayOnGesture);

  function initHeroPannellum() {
    if (!window.pannellum) return;
    if (state.heroViewerInstance) {
      try {
        state.heroViewerInstance.resize();
        state.heroViewerInstance.setHfov(105, 0);
        state.heroViewerInstance.setPitch(-5, 0);
      } catch (err) {
        console.warn("Hero Pannellum resize/hfov reset:", err);
      }
      return; // Already initialized
    }

    try {
      state.heroViewerInstance = window.pannellum.viewer("heroPannellumCanvas", {
        type: "equirectangular",
        panorama: "assets/panos/REDhall.webp",
        autoLoad: true,
        autoRotate: -2.5,
        compass: false,
        showZoomCtrl: false,
        showFullscreenCtrl: false,
        mouseZoom: false,
        draggable: true,
        yaw: 20,
        pitch: -5,
        hfov: 105,
        preview: "assets/panos/REDhall.webp"
      });
    } catch (err) {
      console.warn("Hero Pannellum initialization fallback:", err);
    }
  }

  function initFullscreenPannellum(project, sceneId) {
    if (!window.pannellum) {
      showToast("Pannellum 360 engine loading...");
      return;
    }

    const sceneData = window.TOURS360_DATA.getScene(sceneId);
    const modeData = sceneData.lightingModes[state.currentLightingMode];

    // Build Hotspots array for Pannellum
    const pannellumHotspots = [];

    // 1. Navigation Hotspots
    if (sceneData.navHotspots) {
      sceneData.navHotspots.forEach(nav => {
        pannellumHotspots.push({
          pitch: nav.pitch,
          yaw: nav.yaw,
          type: "custom",
          createTooltipFunc: function (hotSpotDiv) {
            hotSpotDiv.classList.add("pnlm-custom-nav-hotspot");
            hotSpotDiv.innerHTML = `
              <div class="radar-pulse"></div>
              <div class="radar-core"><i class="fas ${nav.icon || 'fa-shoe-prints'}"></i></div>
              <div class="nav-tooltip">${nav.text}</div>
            `;
            hotSpotDiv.addEventListener("click", function (e) {
              e.stopPropagation();
              switchScene(nav.targetSceneId);
            });
          }
        });
      });
    }

    // 2. Material Spec Hotspots
    if (sceneData.specHotspots) {
      sceneData.specHotspots.forEach(spec => {
        pannellumHotspots.push({
          pitch: spec.pitch,
          yaw: spec.yaw,
          type: "custom",
          createTooltipFunc: function (hotSpotDiv) {
            hotSpotDiv.classList.add("pnlm-custom-spec-hotspot");
            hotSpotDiv.innerHTML = `
              <div class="spec-pulse"></div>
              <div class="spec-core">i</div>
              <div class="spec-tooltip">${spec.title}</div>
            `;
            hotSpotDiv.addEventListener("click", function (e) {
              e.stopPropagation();
              openSpecModal(spec);
            });
          }
        });
      });
    }

    // Clean previous instance if existing
    const container = document.getElementById("fullscreenPannellumContainer");
    container.innerHTML = "";

    try {
      const initialHfov = typeof getOptimalHfov === "function" ? getOptimalHfov() : 100;
      state.fullscreenViewerInstance = window.pannellum.viewer("fullscreenPannellumContainer", {
        type: "equirectangular",
        panorama: modeData.image,
        autoLoad: true,
        autoRotate: -0.6,
        compass: true,
        showZoomCtrl: true,
        showFullscreenCtrl: true,
        yaw: 0,
        pitch: -2,
        hfov: initialHfov,
        minHfov: 50,
        maxHfov: 120,
        hotSpots: pannellumHotspots
      });
      window.panoViewer = state.fullscreenViewerInstance;

      // Hotspot Calibration Mode (Finding Pitch & Yaw for New Info Hotspots)
      state.fullscreenViewerInstance.on("mousedown", function (e) {
        if (e.altKey || e.ctrlKey) {
          const pitch = state.fullscreenViewerInstance.getPitch().toFixed(1);
          const yaw = state.fullscreenViewerInstance.getYaw().toFixed(1);
          console.log(`HOTSPOT COORDINATES -> pitch: ${pitch}, yaw: ${yaw}`);
          showToast(`Hotspot Coords: pitch: ${pitch}, yaw: ${yaw} (copied to console)`);
        }
      });
    } catch (e) {
      console.error("Fullscreen Pannellum error:", e);
    }

    updateHUD(project, sceneData, modeData);
    renderRoomCarousel(sceneId);
  }

  function switchScene(sceneId) {
    state.currentSceneId = sceneId;
    const project = window.TOURS360_DATA.getProject(state.currentProjectSlug);
    window.location.hash = `#tour/${project.slug}/${sceneId}`;
    initFullscreenPannellum(project, sceneId);
    playAmbientSound(sceneId);
    showToast(`Navigated to: ${window.TOURS360_DATA.getScene(sceneId).title}`);
  }

  /**
   * ==========================================================================
   * 3. LIGHTING TIME SWITCHER (Day 7:00 AM | Sunset 5:45 PM | Night 8:30 PM)
   * ==========================================================================
   */
  function switchLightingMode(mode) {
    if (!["day", "sunset", "night"].includes(mode)) return;
    state.currentLightingMode = mode;

    // Update active button state
    dom.lightingButtons.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    const project = window.TOURS360_DATA.getProject(state.currentProjectSlug);
    const sceneData = window.TOURS360_DATA.getScene(state.currentSceneId);
    const modeData = sceneData.lightingModes[mode];

    if (state.fullscreenViewerInstance && modeData) {
      // Re-load image smoothly
      state.fullscreenViewerInstance.loadScene = undefined; // reset
      try {
        initFullscreenPannellum(project, state.currentSceneId);
      } catch (err) {
        console.warn("Mode switch reload:", err);
      }
    }

    // Update HUD text & simulated time
    updateHUD(project, sceneData, modeData);
    showToast(`Lighting ambiance set to ${mode.toUpperCase()} (${modeData.time})`);
  }

  function updateHUD(project, sceneData, modeData) {
    if (dom.hudProjectTitle) {
      dom.hudProjectTitle.textContent = project.title;
    }
    if (dom.hudRoomTitle) {
      dom.hudRoomTitle.innerHTML = `<i class="fas fa-cube text-gold"></i> ${sceneData.title}`;
    }
    if (dom.hudClock) {
      dom.hudClock.innerHTML = `<i class="far fa-clock text-gold"></i> ${modeData.time} IST`;
    }
    if (dom.hudSunOrientation) {
      dom.hudSunOrientation.innerHTML = `<i class="fas fa-compass text-gold"></i> ${modeData.sunText}`;
    }

    // WhatsApp site visit pre-filled message
    if (dom.hudWhatsappCTA) {
      const builder = window.TOURS360_DATA.getBuilder(project.builderSlug);
      const phone = builder && builder.whatsapp ? builder.whatsapp : "918261098681";
      const encodedMsg = encodeURIComponent(
        `Hello ${builder ? builder.name : 'Tours360'} Site Manager! I am currently taking the 360° Digital Twin tour for "${project.title}" (${sceneData.title}) in ${state.currentLightingMode.toUpperCase()} lighting on Tours360.in. Please share official pricing sheet & schedule my site visit.`
      );
      dom.hudWhatsappCTA.href = `https://wa.me/${phone}?text=${encodedMsg}`;
    }
  }

  function startVastuClock() {
    if (state.clockInterval) clearInterval(state.clockInterval);
    state.clockInterval = setInterval(() => {
      // Keep simulated time or update seconds if needed
    }, 1000);
  }

  function renderRoomCarousel(activeSceneId) {
    if (!dom.roomCarousel) return;
    dom.roomCarousel.innerHTML = "";

    const scenes = [
      { id: "living", title: "Living Foyer", icon: "fa-couch" },
      { id: "balcony", title: "East Balcony", icon: "fa-sun" },
      { id: "kitchen", title: "Chef's Kitchen", icon: "fa-utensils" },
      { id: "master", title: "Master Suite", icon: "fa-bed" }
    ];

    scenes.forEach(s => {
      const btn = document.createElement("button");
      btn.className = `room-thumb-btn ${s.id === activeSceneId ? 'active' : ''}`;
      btn.innerHTML = `
        <i class="fas ${s.icon} text-gold"></i>
        <span class="room-thumb-title">${s.title}</span>
      `;
      btn.addEventListener("click", () => switchScene(s.id));
      dom.roomCarousel.appendChild(btn);
    });
  }

  /**
   * ==========================================================================
   * 4. BUILDER SUB-UI PORTAL & INVENTORY
   * ==========================================================================
   */
  function renderBuilderPortalHeader(builder) {
    if (dom.builderLogo) {
      dom.builderLogo.src = builder.logo;
      dom.builderLogo.alt = builder.name;
    }
    if (dom.builderName) dom.builderName.textContent = builder.name;
    if (dom.builderRera) dom.builderRera.innerHTML = `<i class="fas fa-shield-alt"></i> RERA MP: ${builder.reraNo}`;
    if (dom.builderLocation) dom.builderLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${builder.location}`;

    if (dom.builderCallBtn) {
      dom.builderCallBtn.href = `tel:${builder.salesPhone.replace(/\s+/g, '')}`;
      dom.builderCallBtn.innerHTML = `<i class="fas fa-phone-alt"></i> Call Sales Head (${builder.salesHead.split(' ')[0]})`;
    }

    if (dom.builderWhatsappBtn) {
      const text = encodeURIComponent(`Hello ${builder.salesHead}! I am exploring the official ${builder.name} Digital Twin portal on Tours360.in. Please share project brochures.`);
      dom.builderWhatsappBtn.href = `https://wa.me/${builder.whatsapp}?text=${text}`;
    }

    if (dom.builderStatsContainer) {
      dom.builderStatsContainer.innerHTML = `
        <div class="glass-pill"><i class="fas fa-building text-gold"></i> <strong>${builder.stats.completedProjects}</strong> Projects</div>
        <div class="glass-pill"><i class="fas fa-vector-square text-gold"></i> <strong>${builder.stats.sqftDelivered}</strong> Sq.Ft.</div>
        <div class="glass-pill"><i class="fas fa-eye text-gold"></i> <strong>${builder.stats.digitalTwinVisits}</strong> Twin Views</div>
      `;
    }
  }

  function renderBuilderProjects(builderSlug, filterCategory = "all") {
    if (!dom.builderProjectsGrid) return;
    dom.builderProjectsGrid.innerHTML = "";

    const allProjects = window.TOURS360_DATA.getProjectsByBuilder(builderSlug);
    allProjects.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    const filtered = allProjects.filter(p => {
      if (filterCategory === "all") return true;
      if (filterCategory === "available") return p.status === "AVAILABLE";
      if (filterCategory === "soldout") return p.status === "SOLD_OUT";
      return p.category.toLowerCase().includes(filterCategory.toLowerCase());
    });

    if (filtered.length === 0) {
      dom.builderProjectsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <i class="fas fa-home text-muted" style="font-size: 3rem; margin-bottom: 16px; display: block;"></i>
          <h3 class="font-heading" style="font-size: 1.5rem; margin-bottom: 8px;">No units match this filter</h3>
          <p class="text-muted">Select 'All Units' to explore available luxury residences.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(project => {
      const card = document.createElement("div");
      card.className = "project-card glass-panel";

      // Diagonal Sold Out Ribbon or Available Badge
      const isSoldOut = project.status === "SOLD_OUT";
      const ribbonHtml = isSoldOut ? `
        <div class="ribbon-sold-container">
          <div class="ribbon-sold">SOLD OUT</div>
        </div>
      ` : "";

      const statusBadge = isSoldOut ? `
        <span class="badge-available" style="background: rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.4); color: #F87171;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #EF4444; display: inline-block;"></span>
          SOLD OUT
        </span>
      ` : `
        <span class="badge-available">
          <span class="pulse-dot"></span>
          AVAILABLE
        </span>
      `;

      card.innerHTML = `
        ${ribbonHtml}
        <div class="project-img-wrapper">
          <img src="${project.thumbnail}" alt="${project.title}" class="project-img" loading="lazy">
          <div class="project-img-overlay">
            ${statusBadge}
          </div>
        </div>
        <div class="project-body">
          <div>
            <span class="badge-available" style="margin-bottom: 8px; background: rgba(212, 175, 55, 0.1); border-color: rgba(212, 175, 55, 0.3); color: #D4AF37;">
              ${project.category} • ${project.tower}
            </span>
            ${(project.badge === "NEW LAUNCH" || project.isNewLaunch) ? `
              <span class="badge-available" style="margin-left: 6px; background: rgba(212, 175, 55, 0.25); border-color: var(--gold-primary); color: #FCEBA7;">
                ✨ NEW LAUNCH
              </span>
            ` : ""}
            <h3 class="project-title">${project.title}</h3>
            <p class="project-tagline">${project.tagline}</p>

            <div class="project-specs-grid">
              <div class="spec-cell">
                <span class="spec-title">Carpet Area</span>
                <span class="spec-data">${project.carpetSqFt.toLocaleString()} Sq.Ft.</span>
              </div>
              <div class="spec-cell">
                <span class="spec-title">Vastu Facing</span>
                <span class="spec-data" style="font-size: 0.8rem;">${project.facing.split('(')[0]}</span>
              </div>
            </div>
          </div>

          <div class="project-card-footer">
            <div class="project-price-box">
              <span class="price-main">${project.priceDisplay}</span>
              <span class="price-rate">${project.pricePerSqFt}</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-ghost-gold btn-qr-trigger" style="padding: 10px 14px;" data-project-slug="${project.slug}">
                <i class="fas fa-qrcode"></i>
              </button>
              <button class="btn-gold btn-tour-trigger" style="padding: 10px 18px;" data-project-slug="${project.slug}">
                <i class="fas fa-vr-cardboard"></i> Walk 360°
              </button>
            </div>
          </div>
        </div>
      `;

      // Event handlers
      card.querySelector(".btn-tour-trigger").addEventListener("click", () => {
        openTourViewer(project.slug, project.defaultSceneId || "living");
      });

      card.querySelector(".btn-qr-trigger").addEventListener("click", () => {
        openQRModal(project);
      });

      dom.builderProjectsGrid.appendChild(card);
    });
  }

  /**
   * ==========================================================================
   * 5. VIEW 1: AGENCY DIRECTORY & PARTNERS SECTION
   * ==========================================================================
   */
  function renderAgencyBuildersDirectory() {
    if (!dom.agencyBuildersGrid) return;
    dom.agencyBuildersGrid.innerHTML = "";

    window.TOURS360_DATA.builders.forEach(builder => {
      const card = document.createElement("div");
      card.className = "builder-card glass-panel";

      card.innerHTML = `
        <div>
          <div class="builder-logo-row">
            <img src="${builder.logo}" alt="${builder.name}" style="height: 44px; max-width: 170px;">
            <span class="builder-badge">${builder.badge}</span>
          </div>

          <h3 class="builder-name">${builder.name}</h3>
          <p class="builder-rera"><i class="fas fa-shield-alt"></i> RERA: ${builder.reraNo}</p>
          <p class="builder-desc">${builder.shortDescription}</p>

          <div class="builder-stats-row">
            <div class="builder-stat-box">
              <div class="builder-stat-num">${builder.stats.completedProjects}</div>
              <div class="builder-stat-lbl">Towers</div>
            </div>
            <div class="builder-stat-box">
              <div class="builder-stat-num">${builder.stats.sqftDelivered}</div>
              <div class="builder-stat-lbl">Sq.Ft.</div>
            </div>
            <div class="builder-stat-box">
              <div class="builder-stat-num">${builder.stats.digitalTwinVisits}</div>
              <div class="builder-stat-lbl">Views</div>
            </div>
          </div>
        </div>

        <div class="builder-actions-row">
          <button class="btn-ghost-gold btn-agency-qr" style="flex: 0 0 46px; padding: 10px;" title="Generate QR Code" data-builder-slug="${builder.slug}">
            <i class="fas fa-qrcode"></i>
          </button>
          <button class="btn-gold btn-open-builder" style="flex: 1;" data-builder-slug="${builder.slug}">
            Open Builder Sub-UI <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      `;

      card.querySelector(".btn-open-builder").addEventListener("click", () => {
        openBuilderPortal(builder.slug);
      });

      card.querySelector(".btn-agency-qr").addEventListener("click", () => {
        const firstProject = window.TOURS360_DATA.getProjectsByBuilder(builder.slug)[0] || window.TOURS360_DATA.projects[0];
        openQRModal(firstProject);
      });

      dom.agencyBuildersGrid.appendChild(card);
    });
  }

  function renderPartners(tab = "developers") {
    if (!dom.partnersGrid) return;
    state.activePartnerTab = tab;

    // Update Tab UI
    dom.partnerTabs.forEach(t => {
      t.classList.toggle("active", t.dataset.tab === tab);
    });

    dom.partnersGrid.innerHTML = "";

    const list = window.TOURS360_DATA.partners[tab] || [];

    list.forEach(item => {
      const card = document.createElement("div");
      card.className = "partner-card glass-panel";

      if (tab === "developers") {
        card.innerHTML = `
          <img src="${item.avatar}" alt="${item.name}" class="partner-avatar">
          <div class="partner-info">
            <span class="badge-available" style="font-size: 0.65rem; margin-bottom: 4px; padding: 2px 6px;">${item.badge}</span>
            <h4 class="partner-name">${item.name}</h4>
            <div class="partner-role">${item.category}</div>
            <div class="partner-city"><i class="fas fa-map-marker-alt text-gold"></i> ${item.city}</div>
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #10B981; margin-top: 4px;">
              <i class="fas fa-chart-line"></i> ${item.activeNRIQueries} NRI Walkthroughs
            </div>
          </div>
        `;
      } else if (tab === "architects") {
        card.innerHTML = `
          <img src="${item.avatar}" alt="${item.name}" class="partner-avatar">
          <div class="partner-info">
            <h4 class="partner-name">${item.name}</h4>
            <div class="partner-role">${item.role}</div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 4px;">${item.principal}</div>
            <div class="partner-city"><i class="fas fa-map-marker-alt text-gold"></i> ${item.city} • ${item.projectsDone} Twins Completed</div>
          </div>
        `;
      } else {
        // Team
        card.innerHTML = `
          <img src="${item.avatar}" alt="${item.name}" class="partner-avatar">
          <div class="partner-info">
            <span class="badge-available" style="font-size: 0.65rem; margin-bottom: 4px; padding: 2px 6px;">${item.badge}</span>
            <h4 class="partner-name">${item.name}</h4>
            <div class="partner-role">${item.role}</div>
            <div class="partner-city"><i class="fas fa-map-marker-alt text-gold"></i> ${item.city}</div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px; line-height: 1.4;">${item.bio}</p>
          </div>
        `;
      }

      dom.partnersGrid.appendChild(card);
    });

    // Issue 6: Check admin state (triple-tap or persistent localStorage)
    const isAdmin = state.isAdmin || window.location.search.includes("admin=true") || window.location.hash.includes("admin");

    if (isAdmin) {
      const addCard = document.createElement("div");
      addCard.className = "add-partner-trigger";
      addCard.innerHTML = `
        <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(212, 175, 55, 0.15); display: flex; align-items: center; justify-content: center; color: var(--gold-primary); font-size: 1.4rem;">
          <i class="fas fa-plus"></i>
        </div>
        <div style="text-align: center;">
          <h4 class="font-heading" style="font-size: 1.1rem; color: #FFFFFF; margin-bottom: 4px;">+ Add Client / Specialist</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Admin Roster Tool (Authenticated)</p>
        </div>
      `;
      addCard.addEventListener("click", () => openAddPartnerModal(tab));
      dom.partnersGrid.appendChild(addCard);
    }
  }

  /**
   * ==========================================================================
   * 6. MODALS MANAGEMENT
   * ==========================================================================
   */
  function openSpecModal(spec) {
    if (!dom.modalSpec) return;
    dom.specImg.src = spec.image;
    dom.specTag.textContent = spec.tag || "LUXURY ARCHITECTURAL SPEC";
    dom.specTitle.textContent = spec.title;
    dom.specBrand.innerHTML = `<i class="fas fa-award text-gold"></i> ${spec.brand}`;
    dom.specWarranty.textContent = spec.warranty || "Certified Genuine Spec";
    dom.specDesc.textContent = spec.specDetails;

    dom.modalSpec.classList.add("modal-open");
  }

  function openQRModal(project) {
    if (!dom.modalQR) return;
    const currentUrl = `${window.location.origin}${window.location.pathname}#tour/${project.slug}/${project.defaultSceneId || 'living'}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}&margin=10`;

    dom.qrImage.src = qrUrl;
    dom.qrProjectName.textContent = project.title;

    // Download QR
    dom.qrDownloadBtn.onclick = () => {
      const link = document.createElement("a");
      link.href = qrUrl;
      link.target = "_blank";
      link.download = `Tours360-${project.slug}-Brochure-QR.png`;
      link.click();
      showToast("Downloading high-res print-ready QR code for site hoarding!");
    };

    // Copy Link
    dom.qrCopyLinkBtn.onclick = () => {
      navigator.clipboard.writeText(currentUrl).then(() => {
        showToast("Direct 360° Digital Twin tour link copied to clipboard!");
      }).catch(() => {
        showToast("Tour link: " + currentUrl);
      });
    };

    dom.modalQR.classList.add("modal-open");
  }

  function openAddPartnerModal(defaultTab = "developers") {
    if (!dom.modalAddPartner) return;
    const typeSelect = document.getElementById("addPartnerType");
    if (typeSelect) typeSelect.value = defaultTab;
    dom.modalAddPartner.classList.add("modal-open");
  }

  function openFloorplanModal() {
    if (!dom.modalFloorplan) return;
    dom.modalFloorplan.classList.add("modal-open");
  }

  function openBookingModal() {
    if (!dom.modalBooking) return;
    dom.modalBooking.classList.add("modal-open");
  }

  function closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(m => {
      m.classList.remove("modal-open");
    });
  }

  /**
   * ==========================================================================
   * 7. TOAST FEEDBACK ENGINE
   * ==========================================================================
   */
  function showToast(message) {
    if (!dom.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /**
   * ==========================================================================
   * 8. EVENT BINDINGS & FORM HANDLERS
   * ==========================================================================
   */
  function setupEventListeners() {
    // Hash Routing
    window.addEventListener("hashchange", handleRouting);
    window.addEventListener("popstate", handleRouting);

    // Sync fullscreen changes and protect Hero viewer FOV/aspect ratio
    document.addEventListener("fullscreenchange", () => {
      const btnToggle = document.getElementById("hudFullscreenToggle");
      if (btnToggle) {
        btnToggle.innerHTML = document.fullscreenElement
          ? '<i class="fas fa-compress"></i>'
          : '<i class="fas fa-expand"></i>';
      }
      if (!document.fullscreenElement && state.currentView === "agency") {
        setTimeout(() => {
          if (state.heroViewerInstance) {
            try {
              state.heroViewerInstance.resize();
              state.heroViewerInstance.setHfov(105, 0);
            } catch (e) {}
          }
        }, 80);
      }
    });

    // Filter Chips in Builder Sub-UI
    dom.filterChips.forEach(chip => {
      chip.addEventListener("click", () => {
        dom.filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        state.activeProjectFilter = chip.dataset.filter;
        renderBuilderProjects(state.currentBuilderSlug, state.activeProjectFilter);
      });
    });

    // Partner Tabs
    dom.partnerTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        renderPartners(tab.dataset.tab);
      });
    });

    // Lighting Buttons in Fullscreen HUD
    dom.lightingButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        switchLightingMode(btn.dataset.mode);
      });
    });

    // HUD Floorplan Button
    const btnFloorplan = document.getElementById("hudFloorplanBtn");
    if (btnFloorplan) {
      btnFloorplan.addEventListener("click", openFloorplanModal);
    }

    // HUD Fullscreen Toggle
    const btnFullscreenToggle = document.getElementById("hudFullscreenToggle");
    if (btnFullscreenToggle) {
      btnFullscreenToggle.addEventListener("click", () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          btnFullscreenToggle.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
          document.exitFullscreen().catch(() => {});
          btnFullscreenToggle.innerHTML = '<i class="fas fa-expand"></i>';
        }
      });
    }

    // HUD Audio Toggle (Muted by default; remembers user choice across devices)
    const btnAudio = document.getElementById("hudAudioBtn");
    if (btnAudio) {
      btnAudio.innerHTML = state.ambientAudioPlaying
        ? '<i class="fas fa-volume-up text-gold"></i>'
        : '<i class="fas fa-volume-mute"></i>';
      btnAudio.addEventListener("click", () => {
        state.ambientAudioPlaying = !state.ambientAudioPlaying;
        localStorage.setItem("tours360_audio_enabled", state.ambientAudioPlaying ? "true" : "false");
        btnAudio.innerHTML = state.ambientAudioPlaying
          ? '<i class="fas fa-volume-up text-gold"></i>'
          : '<i class="fas fa-volume-mute"></i>';

        if (state.ambientAudioPlaying) {
          playAmbientSound(state.currentSceneId);
          showToast("Ambient sound active");
        } else {
          if (gainNode && audioCtx) {
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
          }
          showToast("Sound muted");
        }
      });
    }

    // Modal Close Buttons
    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", closeAllModals);
    });

    // Close on overlay backdrop click
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });

    // Booking Shoot Modal Triggers
    document.querySelectorAll(".btn-book-shoot-trigger").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openBookingModal();
      });
    });

    // Booking Form Submit (Task 3.3)
    const bookingForm = document.getElementById("bookingShootForm");
    if (bookingForm) {
      bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
          developer: document.getElementById("bookDeveloperName").value,
          project: document.getElementById("bookProjectName").value,
          location: document.getElementById("bookLocation").value,
          carpet: document.getElementById("bookCarpet") ? document.getElementById("bookCarpet").value : "",
          contact: document.getElementById("bookContactName").value,
          phone: document.getElementById("bookContactPhone").value
        };

        closeAllModals();
        showToast(`Logging 48-Hour shoot request for ${payload.project}...`);

        // 1. Submit to Go backend for persistent JSON logging and Telegram notification
        try {
          await fetch("/api/book-shoot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        } catch (err) {
          console.warn("Local API log warning:", err);
        }

        // 2. Open WhatsApp prefilled message
        const waMsg = encodeURIComponent(
          `Hello Tours360 Concierge! I have submitted a 48-Hour Demo Shoot request.\n\n` +
          `• Developer: ${payload.developer}\n` +
          `• Project: ${payload.project}\n` +
          `• Location: ${payload.location}\n` +
          `• Contact: ${payload.contact}\n` +
          `• Phone: ${payload.phone}\n\n` +
          `Please schedule our on-site 360° capture.`
        );
        window.open(`https://wa.me/918261098681?text=${waMsg}`, "_blank");
      });
    }

    // Add Partner Form Submit
    const addPartnerForm = document.getElementById("addPartnerForm");
    if (addPartnerForm) {
      addPartnerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = document.getElementById("addPartnerType").value;
        const name = document.getElementById("addPartnerName").value;
        const role = document.getElementById("addPartnerRole").value;
        const city = document.getElementById("addPartnerCity").value;
        const avatar = document.getElementById("addPartnerAvatar").value || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";

        const newItem = {
          id: `custom-${Date.now()}`,
          name: name,
          role: role,
          category: role,
          principal: name,
          city: city,
          badge: "NEW ALLY",
          bio: `${role} serving ${city} luxury residential clusters.`,
          avatar: avatar,
          activeNRIQueries: 85,
          projectsDone: 1
        };

        window.TOURS360_DATA.addPartner(type, newItem);
        closeAllModals();
        renderPartners(type);
        showToast(`Successfully added ${name} to ${type.toUpperCase()}!`);
      });
    }

    // Exit Tour Viewer Button
    const btnExitTour = document.getElementById("btnExitTourViewer");
    if (btnExitTour) {
      btnExitTour.addEventListener("click", () => {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        if (state.previousView === "agency") {
          openAgencyLanding();
        } else if (state.currentBuilderSlug) {
          openBuilderPortal(state.currentBuilderSlug);
        } else {
          openAgencyLanding();
        }
      });
    }

    // Hero Expand Button click handler (Matches Launch Demo behavior cleanly)
    const btnHeroExpand = document.getElementById("btnHeroExpand");
    if (btnHeroExpand) {
      btnHeroExpand.addEventListener("click", () => {
        state.previousView = "agency";
      });
    }
  }

  // Issue 2: Mobile Orientation Monitor
  function checkMobileOrientation() {
    const banner = document.getElementById("mobileRotateBanner");
    if (!banner) return;
    const isMobile = window.innerWidth <= 768;
    const isPortrait = window.innerHeight > window.innerWidth;
    const dismissed = sessionStorage.getItem("rotateBannerDismissed") === "true";

    if (state.currentView === "tour" && isMobile && isPortrait && !dismissed) {
      banner.style.display = "flex";
    } else {
      banner.style.display = "none";
    }
  }

  window.addEventListener("resize", checkMobileOrientation);
  window.addEventListener("orientationchange", () => setTimeout(checkMobileOrientation, 150));

  const btnDismissRotate = document.getElementById("dismissRotateBanner");
  if (btnDismissRotate) {
    btnDismissRotate.addEventListener("click", () => {
      document.getElementById("mobileRotateBanner").style.display = "none";
      sessionStorage.setItem("rotateBannerDismissed", "true");
    });
  }

  // Issue 6: Bulletproof Mobile & Desktop Triple-Tap Admin Panel Trigger
  function setupAdminTripleTap() {
    let tapCount = 0;
    let tapTimer = null;

    function registerTap(e) {
      tapCount++;
      clearTimeout(tapTimer);

      tapTimer = setTimeout(() => {
        tapCount = 0;
      }, 1500); // 1.5sec window for 9 taps

      if (tapCount >= 18) {
        tapCount = 0;
        clearTimeout(tapTimer);

        const enteredPin = prompt("🔐 Tours360 Admin Mode\nEnter 4-digit security PIN (Default: 3600):");
        if (enteredPin === "04042026") {
          state.isAdmin = true;
          localStorage.setItem("tours360_admin_unlocked", "true");
          showToast("👑 Admin Mode Activated! Roster tools unlocked.");
          openAdminModal();
          renderPartners(state.activePartnerTab || "developers");

          // Display discrete admin indicator banner
          let adminBadge = document.getElementById("activeAdminBadge");
          if (!adminBadge) {
            adminBadge = document.createElement("div");
            adminBadge.id = "activeAdminBadge";
            adminBadge.style.cssText = "position:fixed;bottom:10px;left:10px;z-index:9999;background:#D4AF37;color:#0B0D10;font-size:0.75rem;font-weight:800;padding:4px 12px;border-radius:9999px;box-shadow:0 4px 12px rgba(0,0,0,0.8);cursor:pointer;";
            adminBadge.innerHTML = '👑 ADMIN ACTIVE <span style="font-size:0.65rem;">(Tap to Lock)</span>';
            adminBadge.onclick = () => {
              state.isAdmin = false;
              localStorage.removeItem("tours360_admin_unlocked");
              adminBadge.remove();
              renderPartners(state.activePartnerTab || "developers");
              showToast("Admin mode locked");
            };
            document.body.appendChild(adminBadge);
          }
        } else if (enteredPin !== null) {
          showToast("❌ Incorrect Admin PIN");
        }
      }
    }

    // Check persistent admin status
    if (localStorage.getItem("tours360_admin_unlocked") === "true") {
      state.isAdmin = true;
    }

    // Bind to all brand logo instances (desktop header and mobile top-bar)
    document.querySelectorAll(".brand-logo, .brand-icon-box").forEach(el => {
      el.addEventListener("click", registerTap);
      el.addEventListener("touchend", registerTap);
    });
  }

  // Initialize Application
  function initApp() {
    setupEventListeners();
    setupAdminTripleTap();
    handleRouting();
    console.log("Tours360.in WebXR platform initialized successfully.");
  }

  // Expose global interface for floorplan svg onclicks
  window.Tours360App = {
    switchScene: (sceneId) => {
      closeAllModals();
      switchScene(sceneId);
    },
    openTourViewer,
    openBuilderPortal,
    openAgencyLanding,
    openQRModal,
    openSpecModal
  };

  // Expose global panoViewer accessor for dynamic HFOV & responsive resize
  try {
    Object.defineProperty(window, "panoViewer", {
      get: () => state.fullscreenViewerInstance || state.heroViewerInstance,
      set: (val) => { state.fullscreenViewerInstance = val; },
      configurable: true
    });
  } catch (e) {
    window.panoViewer = null;
  }

  // Start on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();

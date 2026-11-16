# Antigravity (agy) Patch — Instant Zero-Loading 360° Scene Cache & Preloader

> **Instructions for Antigravity Agent (agy):**  
> Read `static/js/app.js` and `main.go`.  
> Eliminate the "Loading..." delay when revisiting already-viewed rooms (or switching between Living Room, Balcony, Kitchen, Master Bedroom, and Day/Night modes) by implementing:  
> 1. An in-memory **Blob URL Cache & Background Preloader** (`PanoCache`) in `static/js/app.js` so every visited or preloaded 360° image stays in RAM as a local `blob:` URL (0ms network fetch).  
> 2. **Pannellum Multi-Scene Native Switching** (`loadScene` on a single persistent WebGL viewer instance instead of destroying `fullscreenPannellumContainer` on every room change).  
> 3. **Long-Term HTTP Caching Headers** in `main.go` (`Cache-Control: public, max-age=31536000, immutable` for `/assets/`).

---

## Task 1: Update `static/js/app.js` — Add In-Memory Blob Cache & Preloader (`PanoCache`)

Add this caching engine near the top of `static/js/app.js` (right after `const state = { ... };`):

```javascript
  // ==========================================================================
  // INSTANT 0ms 360° IMAGE BLOB CACHE & BACKGROUND PRELOADER
  // ==========================================================================
  const PanoCache = {
    blobMap: new Map(),     // imageUrl -> blob:http://... (Instant local memory)
    pendingMap: new Map(),  // imageUrl -> Promise<string>

    async get(url) {
      if (!url) return url;
      if (this.blobMap.has(url)) {
        return this.blobMap.get(url);
      }
      if (this.pendingMap.has(url)) {
        return this.pendingMap.get(url);
      }

      const fetchPromise = fetch(url, { cache: "force-cache" })
        .then(resp => {
          if (!resp.ok) throw new Error("Fetch failed");
          return resp.blob();
        })
        .then(blob => {
          const objectUrl = URL.createObjectURL(blob);
          this.blobMap.set(url, objectUrl);
          this.pendingMap.delete(url);
          return objectUrl;
        })
        .catch(() => {
          this.pendingMap.delete(url);
          return url; // Fallback to original URL
        });

      this.pendingMap.set(url, fetchPromise);
      return fetchPromise;
    },

    // Preload all rooms of the project quietly in the background
    preloadProjectScenes(currentMode = "day") {
      const scenes = window.TOURS360_DATA?.scenes || {};
      Object.values(scenes).forEach((scene, index) => {
        const modeObj = scene.lightingModes?.[currentMode] || scene.lightingModes?.day;
        if (modeObj?.image) {
          // Stagger background preloads slightly so current room gets 100% bandwidth first
          setTimeout(() => {
            this.get(modeObj.image);
          }, (index + 1) * 350);
        }
      });
    }
  };
```

---

## Task 2: Update `initFullscreenPannellum` & `switchScene` in `static/js/app.js`

Instead of wiping `fullscreenPannellumContainer` and rebuilding WebGL from scratch on every click, initialize Pannellum **once** with a `scenes` dictionary and use `loadScene()` with cached `blob:` URLs:

1. Replace `initFullscreenPannellum(project, sceneId)` in `static/js/app.js` with:

```javascript
  function buildPannellumHotspots(sceneData) {
    const hotspots = [];

    if (sceneData.navHotspots) {
      sceneData.navHotspots.forEach(nav => {
        hotspots.push({
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

    if (sceneData.specHotspots) {
      sceneData.specHotspots.forEach(spec => {
        hotspots.push({
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

    return hotspots;
  }

  async function initFullscreenPannellum(project, sceneId) {
    if (!window.pannellum) {
      showToast("Pannellum 360 engine loading...");
      return;
    }

    const sceneData = window.TOURS360_DATA.getScene(sceneId);
    const modeData = sceneData.lightingModes[state.currentLightingMode] || sceneData.lightingModes.day;
    const sceneKey = `${sceneId}_${state.currentLightingMode}`;

    // Resolve cached Blob URL (0ms if already visited or preloaded)
    const cachedImageUrl = await PanoCache.get(modeData.image);
    const initialHfov = typeof getOptimalHfov === "function" ? getOptimalHfov() : 100;

    // Build scene config object for Pannellum
    const sceneConfig = {
      type: "equirectangular",
      panorama: cachedImageUrl,
      autoLoad: true,
      autoRotate: -0.6,
      compass: true,
      yaw: 0,
      pitch: -2,
      hfov: initialHfov,
      minHfov: 50,
      maxHfov: 120,
      hotSpots: buildPannellumHotspots(sceneData)
    };

    // If viewer already exists, register scene in Pannellum & switch without destroying WebGL
    if (state.fullscreenViewerInstance) {
      try {
        // Preserve user's viewing angle when only lighting mode changes
        const prevPitch = state.fullscreenViewerInstance.getPitch();
        const prevYaw = state.fullscreenViewerInstance.getYaw();
        const prevHfov = state.fullscreenViewerInstance.getHfov();

        state.fullscreenViewerInstance.addScene(sceneKey, sceneConfig);
        state.fullscreenViewerInstance.loadScene(sceneKey, prevPitch, prevYaw, prevHfov);

        updateHUD(project, sceneData, modeData);
        renderRoomCarousel(sceneId);
        return;
      } catch (err) {
        console.warn("Seamless scene switch fallback, re-initializing:", err);
      }
    }

    // First-time viewer initialization
    const container = document.getElementById("fullscreenPannellumContainer");
    container.innerHTML = "";

    try {
      state.fullscreenViewerInstance = window.pannellum.viewer("fullscreenPannellumContainer", {
        default: {
          firstScene: sceneKey,
          sceneFadeDuration: 350, // Smooth 350ms cross-fade
          autoLoad: true,
          showZoomCtrl: true,
          showFullscreenCtrl: true
        },
        scenes: {
          [sceneKey]: sceneConfig
        }
      });
      window.panoViewer = state.fullscreenViewerInstance;

      // Quietly preload all other rooms in background for instant future clicks
      PanoCache.preloadProjectScenes(state.currentLightingMode);
    } catch (e) {
      console.error("Fullscreen Pannellum error:", e);
    }

    updateHUD(project, sceneData, modeData);
    renderRoomCarousel(sceneId);
  }
```

2. Update `switchLightingMode(mode)` in `static/js/app.js` so it calls `initFullscreenPannellum(project, state.currentSceneId)` directly and triggers background preloading for the newly selected lighting mode (`PanoCache.preloadProjectScenes(mode)`).

---

## Task 3: Update `main.go` — Immutable Browser Caching for `/assets/`

In `main.go`, inside `mux.HandleFunc("/", ...)` where static files are served, set a 1-year immutable cache header for `/assets/` (`.webp`, `.jpg`, `.png`, `.svg`) so returning users and room switches hit disk/memory cache instantaneously:

```go
if strings.Contains(path, ".") {
	if strings.HasPrefix(path, "/assets/") {
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
	} else {
		w.Header().Set("Cache-Control", "public, max-age=86400")
	}
	fileServer.ServeHTTP(w, r)
	return
}
```

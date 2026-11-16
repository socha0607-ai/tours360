# Antigravity (agy) Patch — Multi-Floor Interactive SVG Blueprint & Vastu Studio for Tours360.in

> **Instructions for Antigravity Agent (agy):**  
> Read `static/index.html`, `static/css/style.css`, `static/js/app.js`, and `static/data.js` (or `static/data.json`).  
> Upgrade the 2D Floorplan engine from a single static SVG into a **Dynamic Multi-Floor Interactive Blueprint Architecture (Ground Floor, 1st Floor, 2nd Floor, Terrace, etc.)** that supports both:  
> 1. Pure custom SVG / Architect 2D blueprint images wrapped in interactive SVG containers with clickable room zones and glowing pins.  
> 2. Multi-floor stacked/scrollable views with editable Floor Headers (`Ground Floor — Living, Lawn & Car Porch`, `First Floor — Master Suites & Terrace`), Vastu Compass rotation, and direct 360° panorama jumping.  
> 3. Clean fallback to the default `assets/images/floorplan.svg` if a project does not specify custom multi-floor data.

---

## Task 1: Update `static/data.js` & `static/data.json` — Multi-Floor Schema

Add a `floors` array inside a project's `floorplan` object so any villa or duplex can have unlimited floors (Ground, 1st, 2nd, Rooftop), while maintaining backward compatibility for single-floor projects:

```javascript
// Example Multi-Floor Villa Configuration inside any project in data.js / data.json:
floorplan: {
  northAngle: 15, // Automatically rotates the Vastu Compass on every floor
  floors: [
    {
      floorId: "ground",
      floorLabel: "Ground Floor — Grand Foyer, Living, Porch & Lawn",
      blueprintSrc: "assets/images/floorplan.svg", // Can be an Architect's 2D JPG/PNG/WebP OR an SVG file!
      pins: [
        { sceneId: "living", title: "Living & Dining Foyer", x: 31, y: 36, vastu: "ईशान्य (NE)" },
        { sceneId: "kitchen", title: "Chef's Kitchen", x: 24, y: 75, vastu: "आग्नेय (SE)" },
        { sceneId: "balcony", title: "East Porch & Lawn", x: 71, y: 36, vastu: "पूर्व (East)" }
      ]
    },
    {
      floorId: "first",
      floorLabel: "First Floor — Master Suite, Kids Lounge & Deck",
      blueprintSrc: "assets/images/floorplan.svg", // Replace with First Floor 2D Blueprint PNG/SVG
      pins: [
        { sceneId: "master", title: "Master Presidential Suite", x: 68, y: 75, vastu: "नैऋत्य (SW)" },
        { sceneId: "balcony", title: "Upper Sky Deck", x: 71, y: 36, vastu: "पूर्व (East)" }
      ]
    }
  ]
}
```

---

## Task 2: Update `static/index.html` — Multi-Floor Scrollable Blueprint Modal

Replace the `#modalFloorplan` section in `static/index.html` with this scrollable, sticky-header multi-floor architectural container:

```html
  <!-- ========================================================================
       MODAL: MULTI-FLOOR INTERACTIVE 2D ARCHITECTURAL SVG & BLUEPRINT ENGINE
       ======================================================================== -->
  <div id="modalFloorplan" class="modal-overlay">
    <div class="modal-container" style="max-width: 920px; max-height: 92vh; display: flex; flex-direction: column;">
      <button class="modal-close-btn">&times;</button>
      
      <!-- Sticky Top Header with Quick Floor Jump Pills -->
      <div style="padding: 20px 24px 14px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); background: #151921; border-radius: 20px 20px 0 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 class="font-heading" style="font-size: 1.4rem; color: #FFFFFF; margin-bottom: 2px;">Architectural Blueprints &amp; Vastu Grid</h3>
            <p style="font-size: 0.8rem; color: var(--gold-light);">Scroll down for Upper Floors • Click any pin to jump inside 360°</p>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div id="floorQuickNav" style="display: flex; gap: 6px; flex-wrap: wrap;"></div>
            <div class="badge-available">
              <span class="pulse-dot"></span> LIVE PINS
            </div>
          </div>
        </div>
      </div>

      <!-- Scrollable Multi-Floor Canvas Container -->
      <div id="multiFloorScrollContainer" style="padding: 20px 24px; overflow-y: auto; flex-grow: 1; display: flex; flex-direction: column; gap: 28px;">
        <!-- Floors injected dynamically by app.js -->
      </div>

    </div>
  </div>
```

---

## Task 3: Update `static/css/style.css` — Multi-Floor Card & Pin Hover Styles

Append these styles to `static/css/style.css`:

```css
/* ==========================================================================
   MULTI-FLOOR INTERACTIVE BLUEPRINT & SVG ENGINE
   ========================================================================== */
.floor-section-card {
  background: #0B0D10;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
}

.floor-section-header {
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.18) 0%, rgba(21, 25, 33, 0.95) 100%);
  padding: 12px 18px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.floor-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #FCEBA7;
  display: flex;
  align-items: center;
  gap: 8px;
}

.floor-quick-pill {
  background: rgba(21, 25, 33, 0.9);
  border: 1px solid rgba(212, 175, 55, 0.35);
  color: #CBD5E1;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.floor-quick-pill:hover, .floor-quick-pill.active {
  background: #D4AF37;
  color: #0B0D10;
  border-color: #D4AF37;
}

.floor-svg-stage {
  position: relative;
  width: 100%;
  background: #0B0D10;
}

.floor-blueprint-media {
  width: 100%;
  height: auto;
  display: block;
}

.floor-pin-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.floor-pin-marker:hover {
  transform: translate(-50%, -50%) scale(1.12);
  z-index: 20;
}

.floor-pin-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFF2B2 0%, #D4AF37 100%);
  border: 2.5px solid #0B0D10;
  box-shadow: 0 0 18px rgba(212, 175, 55, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0B0D10;
  font-size: 0.78rem;
  font-weight: 800;
}

.floor-pin-dot.active-room {
  background: #10B981;
  color: #FFFFFF;
  box-shadow: 0 0 22px rgba(16, 185, 129, 1);
}

.floor-pin-label {
  background: rgba(11, 13, 16, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(212, 175, 55, 0.45);
  color: #FFFFFF;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  white-space: nowrap;
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.8);
}

.floor-vastu-compass {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 64px;
  height: 64px;
  pointer-events: none;
  z-index: 8;
}
```

---

## Task 4: Update `static/js/app.js` — Dynamic Multi-Floor Renderer & Fallback

Update `openFloorplanModal()` in `static/js/app.js` to render all floors vertically with quick-scroll pills, live room highlighting, and seamless default SVG fallback:

```javascript
function openFloorplanModal() {
  if (!dom.modalFloorplan) return;

  const project = window.TOURS360_DATA.getProject(state.currentProjectSlug);
  const scrollContainer = document.getElementById("multiFloorScrollContainer");
  const quickNav = document.getElementById("floorQuickNav");
  if (!scrollContainer || !quickNav) return;

  scrollContainer.innerHTML = "";
  quickNav.innerHTML = "";

  // Check if project has custom multi-floor data, otherwise fallback to Default SVG
  const fp = project?.floorplan;
  if (!fp || !fp.floors || fp.floors.length === 0) {
    // Default Fallback: Load the standard interactive SVG
    scrollContainer.innerHTML = `
      <div class="floor-section-card">
        <div class="floor-section-header">
          <div class="floor-section-title"><i class="fas fa-layer-group text-gold"></i> Standard Vastu Floor Plan</div>
        </div>
        <div style="width: 100%; height: 460px;">
          <object data="assets/images/floorplan.svg" type="image/svg+xml" style="width: 100%; height: 100%; display: block;"></object>
        </div>
      </div>
    `;
    dom.modalFloorplan.classList.add("modal-open");
    return;
  }

  // Render Each Floor (Ground, 1st, 2nd, etc.)
  const northAngle = fp.northAngle || 0;

  fp.floors.forEach((floor, index) => {
    const floorDomId = `floor-card-${floor.floorId || index}`;

    // 1. Add Quick Scroll Pill in Sticky Header
    const pill = document.createElement("button");
    pill.className = `floor-quick-pill ${index === 0 ? 'active' : ''}`;
    pill.textContent = floor.floorLabel.split("—")[0].trim();
    pill.onclick = () => {
      document.querySelectorAll(".floor-quick-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      document.getElementById(floorDomId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    quickNav.appendChild(pill);

    // 2. Build Floor Section Card
    const card = document.createElement("div");
    card.id = floorDomId;
    card.className = "floor-section-card";

    card.innerHTML = `
      <div class="floor-section-header">
        <div class="floor-section-title">
          <i class="fas fa-layer-group text-gold"></i> ${floor.floorLabel}
        </div>
        <span style="font-family: 'Space Grotesk'; font-size: 0.72rem; color: #94A3B8;">Floor ${index + 1} of ${fp.floors.length}</span>
      </div>
      <div class="floor-svg-stage" id="stage-${floorDomId}">
        <!-- Blueprint Image or SVG -->
        <img src="${floor.blueprintSrc}" alt="${floor.floorLabel}" class="floor-blueprint-media">
        
        <!-- Auto-Rotated Vastu Compass Overlay -->
        <div class="floor-vastu-compass" style="transform: rotate(${northAngle}deg);">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="46" fill="rgba(11, 13, 16, 0.85)" stroke="#D4AF37" stroke-width="2"/>
            <polygon points="50,12 56,42 44,42" fill="#EF4444"/>
            <polygon points="50,88 56,58 44,58" fill="#94A3B8"/>
            <text x="50" y="24" fill="#EF4444" font-family="'Space Grotesk'" font-size="12" font-weight="bold" text-anchor="middle">N</text>
            <text x="82" y="54" fill="#D4AF37" font-family="'Space Grotesk'" font-size="11" font-weight="bold">E</text>
            <text x="50" y="82" fill="#94A3B8" font-family="'Space Grotesk'" font-size="11" font-weight="bold" text-anchor="middle">S</text>
            <text x="18" y="54" fill="#94A3B8" font-family="'Space Grotesk'" font-size="11" font-weight="bold">W</text>
          </svg>
        </div>
      </div>
    `;

    scrollContainer.appendChild(card);

    // 3. Inject Interactive Room Pins onto this Floor Stage
    const stage = card.querySelector(`#stage-${floorDomId}`);
    (floor.pins || []).forEach(pin => {
      const isCurrentRoom = pin.sceneId === state.currentSceneId;
      const pinEl = document.createElement("div");
      pinEl.className = "floor-pin-marker";
      pinEl.style.left = `${pin.x}%`;
      pinEl.style.top = `${pin.y}%`;

      pinEl.innerHTML = `
        <div class="floor-pin-dot ${isCurrentRoom ? 'active-room' : ''}">
          <i class="fas ${isCurrentRoom ? 'fa-street-view' : 'fa-vr-cardboard'}"></i>
        </div>
        <div class="floor-pin-label">
          ${pin.title} ${pin.vastu ? `<span style="color:#D4AF37;">(${pin.vastu})</span>` : ''}
        </div>
      `;

      pinEl.onclick = () => {
        closeAllModals();
        switchScene(pin.sceneId);
      };

      stage.appendChild(pinEl);
    });
  });

  dom.modalFloorplan.classList.add("modal-open");
}
```

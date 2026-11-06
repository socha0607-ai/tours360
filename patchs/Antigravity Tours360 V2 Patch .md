# Antigravity (agy) Patch v2 — Tours360.in Comprehensive UI/UX, Audio & Mobile Fixes

> **Instructions for Antigravity Agent (agy):**  
> Read the local project repository files (`index.html` or `static/index.html`, `css/style.css` or `static/css/style.css`, and `js/app.js` or `static/js/app.js`).  
> Apply all 6 fixes described below cleanly. Verify that all event listeners are properly registered, CSS selectors have correct specificity, and responsive media queries work on both desktop and mobile devices.

---

## Issue 1: Fix Hero Section "Expand" Button (`#heroPannellumCanvas` Bottom-Right)

### Root Cause
In `index.html` / `style.css`, the `.hero-preview-bottom` container has `pointer-events: none;`. While the left hint has `pointer-events: auto;`, the right Expand button was inheriting `pointer-events: none;` and could not receive clicks. Additionally, it lacked a direct JavaScript click handler to request full-screen on all devices.

### Code Fixes

#### A. In `index.html` (or `static/index.html`):
Update the `.hero-preview-bottom` markup to give the button an ID (`btnHeroExpand`) and ensure it calls the tour launcher:
```html
<div class="hero-preview-bottom">
  <div class="interactive-drag-hint">
    <i class="fas fa-arrows-alt"></i> Drag to Pan 360° | Double Click to Zoom
  </div>
  <button id="btnHeroExpand" class="btn-gold hero-expand-btn">
    Expand 360° <i class="fas fa-expand"></i>
  </button>
</div>
```

#### B. In `css/style.css` (or `static/css/style.css`):
Add `.hero-expand-btn` styles ensuring pointer events and clickability:
```css
.hero-expand-btn {
  pointer-events: auto !important;
  cursor: pointer !important;
  padding: 8px 18px;
  font-size: 0.82rem;
  z-index: 20;
}
```

#### C. In `js/app.js` (or `static/js/app.js`):
In `setupEventListeners()`, add the click handler:
```javascript
const btnHeroExpand = document.getElementById("btnHeroExpand");
if (btnHeroExpand) {
  btnHeroExpand.addEventListener("click", (e) => {
    e.preventDefault();
    openTourViewer("imperial-grand-4bhk", "living");
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  });
}
```

---

## Issue 2: Mobile Landscape Rotation Hint ("Rotate Phone for 360° Immersive View")

### Implementation

#### A. In `index.html` (or `static/index.html`):
Add the floating rotation banner inside `#viewTour`:
```html
<!-- Mobile Orientation Advisory Banner -->
<div id="mobileRotateBanner" class="mobile-rotate-banner">
  <div class="rotate-icon-pulse">
    <i class="fas fa-sync-alt fa-spin"></i>
  </div>
  <div class="rotate-text-box">
    <div class="rotate-title">श्रेष्ठ 360° अनुभव के लिए फोन रोटेट करें</div>
    <div class="rotate-sub">Rotate device to landscape for full-screen immersive view</div>
  </div>
  <button id="dismissRotateBanner" class="btn-dismiss-rotate" aria-label="Close">&times;</button>
</div>
```

#### B. In `css/style.css` (or `static/css/style.css`):
Add styling for the orientation banner:
```css
.mobile-rotate-banner {
  position: absolute;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2500;
  background: rgba(11, 13, 16, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--gold-border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(212, 175, 55, 0.2);
  border-radius: 9999px;
  padding: 8px 18px;
  display: none;
  align-items: center;
  gap: 12px;
  width: calc(100% - 32px);
  max-width: 440px;
  animation: bannerSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.rotate-icon-pulse {
  color: var(--gold-primary);
  font-size: 1.1rem;
}

.rotate-text-box {
  flex-grow: 1;
}

.rotate-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
}

.rotate-sub {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--gold-light);
  line-height: 1.2;
}

.btn-dismiss-rotate {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
}

.btn-dismiss-rotate:hover {
  color: #FFFFFF;
}

@keyframes bannerSlideDown {
  from { transform: translate(-50%, -20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}
```

#### C. In `js/app.js` (or `static/js/app.js`):
Add orientation monitor logic inside `openTourViewer`:
```javascript
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
```

---

## Issue 3: Ambient Luxury Audio ON by Default (with Soft Autoplay Policy Fallback)

### Implementation
Browsers require user interaction before playing audio. To have music **ON by default**, set `state.ambientAudioPlaying = true`, initialize the speaker icon in the active gold state, and trigger the Web Audio API on the first user interaction (touch/click/key) or upon entering the tour:

#### A. In `js/app.js` (or `static/js/app.js`):
Update initial state:
```javascript
state.ambientAudioPlaying = true; // ON by default
```

Update audio button setup and the user gesture trigger:
```javascript
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

// Global user gesture trigger for browser autoplay compliance
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

// In setupEventListeners for #hudAudioBtn:
const btnAudio = document.getElementById("hudAudioBtn");
if (btnAudio) {
  btnAudio.innerHTML = '<i class="fas fa-volume-up text-gold"></i>'; // Active by default
  btnAudio.addEventListener("click", () => {
    state.ambientAudioPlaying = !state.ambientAudioPlaying;
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
```

---

## Issue 4: Compact WhatsApp Button on Mobile/Tablet Screen View

### In `css/style.css` (or `static/css/style.css`):
Update `@media (max-width: 768px)` for `.whatsapp-cta-btn` to make it compact, sleek, and thumb-friendly without blocking room thumbnails:

```css
@media (max-width: 768px) {
  /* Compact Floating WhatsApp CTA */
  .whatsapp-cta-btn {
    position: fixed !important;
    right: 14px !important;
    left: auto !important;
    bottom: 14px !important;
    width: auto !important;
    padding: 9px 16px !important;
    font-size: 0.8rem !important;
    border-radius: 9999px !important;
    box-shadow: 0 4px 18px rgba(37, 211, 102, 0.5) !important;
    z-index: 2100 !important;
    gap: 6px !important;
  }
  .whatsapp-cta-btn span {
    font-size: 0.78rem !important;
    font-weight: 600 !important;
  }
  .whatsapp-cta-btn i {
    font-size: 1rem !important;
  }

  /* Keep room carousel above the compact WhatsApp CTA */
  .room-carousel {
    bottom: 64px !important;
    max-width: calc(100% - 24px) !important;
  }
}
```

---

## Issue 5: Builder Sub-UI Portal Mobile Header Fix (Logo Proportion & Text Hierarchy)

### In `css/style.css` (or `static/css/style.css`):
Inside `@media (max-width: 768px)`, re-balance `.builder-header-banner`, `.builder-brand-info`, and `.builder-portal-logo` so the logo is appropriately sized and the developer's name, RERA badge, and address remain prominent:

```css
@media (max-width: 768px) {
  .builder-header-banner {
    padding: 20px 16px !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 16px !important;
  }

  .builder-brand-info {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 14px !important;
    width: 100% !important;
  }

  /* Compact restrained logo on mobile */
  .builder-portal-logo {
    height: 42px !important;
    max-width: 90px !important;
    object-fit: contain !important;
    flex-shrink: 0 !important;
  }

  /* High-impact prominent developer title */
  #builderPortalName {
    font-size: 1.45rem !important;
    line-height: 1.25 !important;
    color: #FFFFFF !important;
    margin-bottom: 4px !important;
  }

  .builder-rera {
    font-size: 0.72rem !important;
    padding: 2px 8px !important;
  }

  #builderPortalLocation {
    font-size: 0.78rem !important;
    color: var(--text-muted) !important;
  }

  /* Full-width responsive action buttons */
  .builder-contact-actions {
    width: 100% !important;
    display: flex !important;
    gap: 10px !important;
  }

  .builder-contact-actions .btn-ghost-gold,
  .builder-contact-actions .btn-whatsapp {
    flex: 1 !important;
    padding: 10px 12px !important;
    font-size: 0.82rem !important;
    justify-content: center !important;
  }
}
```

---

## Issue 6: Bulletproof Mobile & Desktop Triple-Click Admin Panel Unlock

### Root Cause
Mobile touch events (`touchend`) do not register reliable multiple `click` sequences due to 300ms touch delay and double-tap zoom defaults. A dedicated multi-event click & touch sequence counter must be bound directly to the brand logo.

### In `js/app.js` (or `static/js/app.js`):
Add the triple-tap/click detector with a 4-digit PIN prompt (`3600`) and persistence in `localStorage`:

```javascript
// Bulletproof Mobile & Desktop Triple-Tap Admin Panel Trigger
function setupAdminTripleTap() {
  let tapCount = 0;
  let tapTimer = null;

  function registerTap(e) {
    tapCount++;
    clearTimeout(tapTimer);

    tapTimer = setTimeout(() => {
      tapCount = 0;
    }, 650); // 650ms window for 3 taps

    if (tapCount >= 3) {
      tapCount = 0;
      clearTimeout(tapTimer);

      const enteredPin = prompt("🔐 Tours360 Admin Mode\nEnter 4-digit security PIN (Default: 3600):");
      if (enteredPin === "3600") {
        state.isAdmin = true;
        localStorage.setItem("tours360_admin_unlocked", "true");
        showToast("👑 Admin Mode Activated! Roster tools unlocked.");
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
```

Invoke `setupAdminTripleTap()` inside `initApp()` in `app.js`.

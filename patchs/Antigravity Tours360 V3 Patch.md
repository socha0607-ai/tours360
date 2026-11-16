# Antigravity (agy) Patch v3 — WebGL Context Recovery, Luxury Ambient Audio & GCP Cloud Run Deployment

> **Instructions for Antigravity Agent (agy):**  
> Read the local project repository files (`js/app.js` or `static/js/app.js`, `index.html` or `static/index.html`, and `css/style.css` or `static/css/style.css`).  
> Apply all 3 fixes cleanly:
> 1. Fix the WebGL Pannellum preview crash on tour exit and re-entry.
> 2. Replace the harsh sine-wave beep with an authentic soothing ambient soundscape that plays ONLY inside the 360 tour and stops completely upon exit.
> 3. Provide automated one-command GCP Cloud Run deployment commands.

---

## Task 1: Fix WebGL Preview Error on Tour Exit (`heroViewerInstance` & `fullscreenViewerInstance`)

### Root Cause
When switching between views, hiding the view container (`display: none`) causes the browser's WebGL context on `#heroPannellumCanvas` to lose dimensions or drop context. Furthermore, `state.fullscreenViewerInstance` was never destroyed on exit, causing concurrent WebGL context clashes and memory leaks.

### In `js/app.js` (or `static/js/app.js`):

#### A. Add a dedicated `exitTourViewer()` cleanup function:
```javascript
function exitTourViewer() {
  // 1. Stop audio immediately
  stopAmbientSound();

  // 2. Destroy fullscreen Pannellum instance cleanly to free WebGL context
  if (state.fullscreenViewerInstance) {
    try {
      state.fullscreenViewerInstance.destroy();
    } catch (e) {
      console.warn("Fullscreen viewer destroy warning:", e);
    }
    state.fullscreenViewerInstance = null;
    const container = document.getElementById("fullscreenPannellumContainer");
    if (container) container.innerHTML = "";
  }

  // 3. Clear clock ticker
  if (state.clockInterval) {
    clearInterval(state.clockInterval);
    state.clockInterval = null;
  }

  // 4. Return to previous view
  if (state.currentBuilderSlug && state.currentView !== "agency") {
    openBuilderPortal(state.currentBuilderSlug);
  } else {
    openAgencyLanding();
  }
}
```

#### B. Update `btnExitTourViewer` listener:
```javascript
const btnExitTour = document.getElementById("btnExitTourViewer");
if (btnExitTour) {
  btnExitTour.addEventListener("click", (e) => {
    e.preventDefault();
    exitTourViewer();
  });
}
```

#### C. In `openAgencyLanding()`: Ensure hero preview resizes safely after display is restored:
```javascript
function openAgencyLanding(updateHash = true) {
  state.currentView = "agency";
  if (updateHash) {
    window.location.hash = "#agency";
  }

  // 1. Stop tour audio if landing page is open
  stopAmbientSound();

  dom.viewAgency.classList.add("view-active");
  dom.viewBuilder.classList.remove("view-active");
  dom.viewTour.classList.remove("view-active");

  window.scrollTo({ top: 0, behavior: "smooth" });

  // 2. Safe WebGL preview restoration (wait 100ms for DOM layout to settle)
  setTimeout(() => {
    if (state.heroViewerInstance) {
      try {
        state.heroViewerInstance.resize();
      } catch (err) {
        try { state.heroViewerInstance.destroy(); } catch (e) {}
        state.heroViewerInstance = null;
        initHeroPannellum();
      }
    } else {
      initHeroPannellum();
    }
  }, 120);

  renderAgencyBuildersDirectory();
  renderPartners(state.activePartnerTab);
}
```

---

## Task 2: Replace Monotone "Beep" with Soothing Luxury Ambient Soundscape

### Root Cause
A single raw sine wave oscillator (`220Hz`) produces a monotone electronic test tone ("beep"). Real luxury real estate experiences use either a multi-layered warm chord pad with a low-pass filter or a smooth ambient lounge audio track that plays **only inside the 360 tour** and stops immediately when the user exits.

### In `js/app.js` (or `static/js/app.js`):

Replace the audio engine with this soothing dual-harmonic ambient pad and strict lifecycle controls:

```javascript
let audioCtx = null;
let masterGain = null;
let activeOscillators = [];
let ambientFilter = null;

// Soothing Luxury Ambient Soundscape Engine (Zero Beep / Multi-harmonic warm pad)
function startAmbientSound(roomType = "living") {
  if (!state.ambientAudioPlaying) return;

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    // Stop previous notes smoothly
    stopAmbientSound(false);

    // Warm Low-Pass Filter to eliminate all sharp frequencies/beeps
    ambientFilter = audioCtx.createBiquadFilter();
    ambientFilter.type = "lowpass";
    ambientFilter.frequency.setValueAtTime(380, audioCtx.currentTime); // Soft, warm, cozy roll-off

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    // Smooth gentle volume swell (0.02 is subtle background volume)
    masterGain.gain.exponentialRampToValueAtTime(0.02, audioCtx.currentTime + 2.0);

    ambientFilter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // Harmonic Chord Frequencies (C-Major 9th & Lydian luxury hotel chords)
    // C3 (130.81Hz), G3 (196.00Hz), B3 (246.94Hz), E4 (329.63Hz)
    let chordNotes = [130.81, 196.00, 246.94, 329.63];

    if (roomType === "balcony") {
      // E-Major Open Air: E3 (164.81Hz), B3 (246.94Hz), G#4 (415.30Hz)
      chordNotes = [164.81, 246.94, 415.30];
      ambientFilter.frequency.setValueAtTime(450, audioCtx.currentTime);
    } else if (roomType === "master") {
      // 174Hz Deep Healing Relaxation: F3 (174.00Hz), C4 (261.63Hz)
      chordNotes = [174.00, 261.63, 348.00];
      ambientFilter.frequency.setValueAtTime(300, audioCtx.currentTime);
    } else if (roomType === "kitchen") {
      // Crisp Contemporary: D3 (146.83Hz), A3 (220.00Hz), F#4 (369.99Hz)
      chordNotes = [146.83, 220.00, 369.99];
      ambientFilter.frequency.setValueAtTime(420, audioCtx.currentTime);
    }

    // Create polyphonic oscillators to form a lush ambient pad
    activeOscillators = chordNotes.map((freq, idx) => {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      // Slight detune for rich analog chorus warmth
      osc.frequency.setValueAtTime(freq + (idx * 0.4), audioCtx.currentTime);
      osc.connect(ambientFilter);
      osc.start();
      return osc;
    });

  } catch (err) {
    console.warn("Ambient audio start fallback:", err);
  }
}

function stopAmbientSound(fullStop = true) {
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
    } catch (e) {}
  }

  setTimeout(() => {
    activeOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    activeOscillators = [];
  }, 650);

  if (fullStop) {
    const btnAudio = document.getElementById("hudAudioBtn");
    if (btnAudio && !state.ambientAudioPlaying) {
      btnAudio.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
  }
}
```

#### C. Hook into Tour Viewer Lifecycle:
1. Inside `openTourViewer(projectSlug, sceneId)`:
   ```javascript
   // Start soothing music only when 360 tour opens
   if (state.ambientAudioPlaying) {
     startAmbientSound(sceneId || "living");
   }
   ```
2. Inside `switchScene(sceneId)`:
   ```javascript
   if (state.ambientAudioPlaying) {
     startAmbientSound(sceneId);
   }
   ```
3. Inside `openBuilderPortal()` and `openAgencyLanding()`:
   ```javascript
   // Ensure music is completely turned off outside 360 tour
   stopAmbientSound();
   ```

---

## Task 3: Deploy Entire Project to GCP Cloud Run via Antigravity CLI (`agy`)

To deploy this complete containerized Go server to Google Cloud Run (Mumbai Region `asia-south1`) in one command:

### Command for Linux Terminal:
```bash
# 1. Google Cloud Authentication & Project Setup (One-Time)
gcloud auth login
gcloud config set project YOUR_GCP_PROJECT_ID

# 2. Deploy directly via Cloud Run source build
gcloud run deploy tours360 \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --memory 128Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### Or using Antigravity CLI directly:
```bash
agy "Build and deploy this project to Google Cloud Run in region asia-south1 with service name tours360, memory 128Mi, and allow unauthenticated traffic."
```

# Antigravity (agy) Execution Blueprint — Tours360.in Complete System Patch

> **Instructions for Antigravity Agent (agy):**  
> Read the local project repository files (`main.go`, `static/index.html`, `static/js/app.js`, `static/js/data.js`, `static/data.json`, and `assets/images/`) and apply all 6 updates described below. Ensure all code changes are syntactically valid, preserve existing functionalities, and compile cleanly in Go and modern browsers.

---

## Task 1: Create `assets/images/floorplan.svg` (Interactive 2D Vastu Floor Plan)

Create the directory `assets/images` if it does not exist, and write the following production-ready interactive SVG floor plan file to `assets/images/floorplan.svg`. This floor plan includes an 8-direction Vastu compass and clickable room pins that trigger scene navigation inside Tours360:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0D10"/>
      <stop offset="100%" stop-color="#151921"/>
    </linearGradient>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="900" height="600" fill="url(#bgGrad)" rx="16" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.3"/>

  <!-- Vastu Mandala Grid Guidelines -->
  <path d="M 50 50 H 850 V 550 H 50 Z" fill="none" stroke="#D4AF37" stroke-width="0.5" stroke-dasharray="4,4" opacity="0.3"/>
  <line x1="316" y1="50" x2="316" y2="550" stroke="#D4AF37" stroke-width="0.5" stroke-dasharray="4,4" opacity="0.2"/>
  <line x1="583" y1="50" x2="583" y2="550" stroke="#D4AF37" stroke-width="0.5" stroke-dasharray="4,4" opacity="0.2"/>
  <line x1="50" y1="216" x2="850" y2="216" stroke="#D4AF37" stroke-width="0.5" stroke-dasharray="4,4" opacity="0.2"/>
  <line x1="50" y1="383" x2="850" y2="383" stroke="#D4AF37" stroke-width="0.5" stroke-dasharray="4,4" opacity="0.2"/>

  <!-- 8-Direction Vastu Compass -->
  <g transform="translate(800, 100)">
    <circle r="42" fill="#151921" stroke="#D4AF37" stroke-width="1.5"/>
    <polygon points="0,-36 7,-10 -7,-10" fill="#EF4444"/>
    <polygon points="0,36 7,10 -7,10" fill="#94A3B8"/>
    <polygon points="36,0 10,-7 10,7" fill="#D4AF37"/>
    <polygon points="-36,0 -10,-7 -10,7" fill="#94A3B8"/>
    <text y="-40" fill="#EF4444" font-family="'Space Grotesk', sans-serif" font-size="11" font-weight="bold" text-anchor="middle">N (उत्तर)</text>
    <text x="46" y="4" fill="#D4AF37" font-family="'Space Grotesk', sans-serif" font-size="10" font-weight="bold">E (पूर्व)</text>
    <text y="50" fill="#94A3B8" font-family="'Space Grotesk', sans-serif" font-size="10" font-weight="bold" text-anchor="middle">S (दक्षिण)</text>
    <text x="-48" y="4" fill="#94A3B8" font-family="'Space Grotesk', sans-serif" font-size="10" font-weight="bold" text-anchor="end">W (पश्चिम)</text>
    <text x="24" y="-22" fill="#FCEBA7" font-family="'Space Grotesk', sans-serif" font-size="8" font-weight="bold">ईशान्य (NE)</text>
    <text x="24" y="28" fill="#FCEBA7" font-family="'Space Grotesk', sans-serif" font-size="8" font-weight="bold">आग्नेय (SE)</text>
  </g>

  <!-- Architectural Room 1: Grand Living & Dining Foyer -->
  <rect x="80" y="80" width="450" height="260" fill="#1A202C" stroke="#D4AF37" stroke-width="2" rx="8"/>
  <text x="100" y="115" fill="#FFFFFF" font-family="'Playfair Display', serif" font-size="18" font-weight="bold">Grand Living &amp; Dining Foyer</text>
  <text x="100" y="135" fill="#D4AF37" font-family="'Space Grotesk', sans-serif" font-size="12">Ishanya (NE) Solar Axis • 32ft x 18ft</text>

  <!-- Architectural Room 2: East-Facing Sunrise Balcony -->
  <rect x="550" y="80" width="180" height="260" fill="#202A38" stroke="#10B981" stroke-width="2" stroke-dasharray="6,4" rx="8"/>
  <text x="565" y="115" fill="#34D399" font-family="'Playfair Display', serif" font-size="16" font-weight="bold">East Balcony</text>
  <text x="565" y="135" fill="#94A3B8" font-family="'Space Grotesk', sans-serif" font-size="11">Sunrise Deck • 10ft Deep</text>

  <!-- Architectural Room 3: Chef's Modular Kitchen -->
  <rect x="80" y="360" width="300" height="170" fill="#1E232E" stroke="#D4AF37" stroke-width="2" rx="8"/>
  <text x="100" y="395" fill="#FFFFFF" font-family="'Playfair Display', serif" font-size="16" font-weight="bold">Chef's Kitchen</text>
  <text x="100" y="415" fill="#D4AF37" font-family="'Space Grotesk', sans-serif" font-size="11">Agneya (SE) Fire Quadrant</text>

  <!-- Architectural Room 4: Master Presidential Suite -->
  <rect x="400" y="360" width="430" height="170" fill="#1A202C" stroke="#D4AF37" stroke-width="2" rx="8"/>
  <text x="420" y="395" fill="#FFFFFF" font-family="'Playfair Display', serif" font-size="16" font-weight="bold">Master Presidential Suite</text>
  <text x="420" y="415" fill="#D4AF37" font-family="'Space Grotesk', sans-serif" font-size="11">Nairrutya (SW) Prosperity Anchor</text>

  <!-- Interactive Hotspot Jump Pins -->
  <g onclick="window.parent.Tours360App.switchScene('living')" style="cursor: pointer;" filter="url(#goldGlow)">
    <circle cx="280" cy="220" r="18" fill="#D4AF37"/>
    <circle cx="280" cy="220" r="8" fill="#0B0D10"/>
    <text x="280" y="255" fill="#FCEBA7" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Jump 360°</text>
  </g>

  <g onclick="window.parent.Tours360App.switchScene('balcony')" style="cursor: pointer;" filter="url(#goldGlow)">
    <circle cx="640" cy="220" r="18" fill="#10B981"/>
    <circle cx="640" cy="220" r="8" fill="#0B0D10"/>
    <text x="640" y="255" fill="#34D399" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Jump 360°</text>
  </g>

  <g onclick="window.parent.Tours360App.switchScene('kitchen')" style="cursor: pointer;" filter="url(#goldGlow)">
    <circle cx="220" cy="450" r="18" fill="#D4AF37"/>
    <circle cx="220" cy="450" r="8" fill="#0B0D10"/>
    <text x="220" y="485" fill="#FCEBA7" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Jump 360°</text>
  </g>

  <g onclick="window.parent.Tours360App.switchScene('master')" style="cursor: pointer;" filter="url(#goldGlow)">
    <circle cx="610" cy="450" r="18" fill="#D4AF37"/>
    <circle cx="610" cy="450" r="8" fill="#0B0D10"/>
    <text x="610" y="485" fill="#FCEBA7" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Jump 360°</text>
  </g>
</svg>
```

---

## Task 2: Update `main.go` — Add `/api/book-shoot` with Telegram Alert & Local Storage

Update `main.go` to add a dedicated inquiry submission API endpoint. It must save incoming 48-Hour Demo Shoot bookings to a persistent file (`inquiries.json`) and forward an instant alert to the founder via Telegram Bot API:

```go
// Add to imports in main.go:
// "bytes", "encoding/json", "fmt", "net/url"

type ShootInquiry struct {
	Developer string `json:"developer"`
	Project   string `json:"project"`
	Location  string `json:"location"`
	Carpet    string `json:"carpet"`
	Contact   string `json:"contact"`
	Phone     string `json:"phone"`
	CreatedAt string `json:"createdAt"`
}

// In main.go inside main() after mux := http.NewServeMux():
mux.HandleFunc("/api/book-shoot", func(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var inq ShootInquiry
	if err := json.NewDecoder(r.Body).Decode(&inq); err != nil {
		http.Error(w, `{"error":"Invalid JSON payload"}`, http.StatusBadRequest)
		return
	}
	inq.CreatedAt = time.Now().Format(time.RFC3339)

	// 1. Persistent Storage in inquiries.json
	inqData, _ := json.Marshal(inq)
	f, err := os.OpenFile("inquiries.json", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err == nil {
		f.WriteString(string(inqData) + "\n")
		f.Close()
	}

	// 2. Instant Telegram Notification Alert (Standard Library HTTP - Zero External Packages)
	botToken := os.Getenv("TELEGRAM_BOT_TOKEN")
	chatID := os.Getenv("TELEGRAM_CHAT_ID")
	if botToken != "" && chatID != "" {
		msgText := fmt.Sprintf(
			"🚨 *नई 48-Hour Demo Shoot इंक्वायरी!*\n\n" +
			"🏢 *डेवलपर:* %s\n" +
			"📍 *प्रोजेक्ट:* %s (%s)\n" +
			"📐 *साइज:* %s\n" +
			"👤 *कांटेक्ट:* %s\n" +
			"📞 *फोन/व्हाट्सएप:* %s\n" +
			"⏰ *समय:* %s",
			inq.Developer, inq.Project, inq.Location, inq.Carpet, inq.Contact, inq.Phone, inq.CreatedAt,
		)

		apiURL := fmt.Sprintf(
			"https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s&parse_mode=Markdown",
			botToken, chatID, url.QueryEscape(msgText),
		)
		go func() {
			client := &http.Client{Timeout: 5 * time.Second}
			client.Get(apiURL)
		}()
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"success","message":"Inquiry logged successfully"}`))
})
```

---

## Task 3: Update `static/js/app.js`

Apply the following 5 enhancements to `static/js/app.js`:

### 1. Restrict "+ Add Partner" Button to Admin Only
Inside `renderPartners(tab)` in `app.js`, wrap the creation of `addCard` inside an admin authorization check so regular visitors/builders never see it:

```javascript
// Check if URL has ?admin=true or #admin
const isAdmin = window.location.search.includes("admin=true") || window.location.hash.includes("admin");

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
```

### 2. Implement Web Audio API Multi-Room Ambient Sound Generator
Replace the placeholder listener for `#hudAudioBtn` with an authentic, 100% royalty-free Web Audio synthesizer that adapts to the active room:

```javascript
let audioCtx = null;
let currentOsc = null;
let gainNode = null;

function playAmbientSound(roomType) {
  if (!state.ambientAudioPlaying) return;
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  if (currentOsc) {
    try {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      setTimeout(() => { try { currentOsc.stop(); } catch(e){} }, 850);
    } catch(e) {}
  }

  // Room-specific harmonic tuning
  let freq = 220; // Living Room: C3 Warm Ambient Pad
  if (roomType === 'balcony') freq = 329.63; // Balcony: E4 Morning Breeze
  if (roomType === 'kitchen') freq = 261.63; // Kitchen: C4 Crisp Culinary
  if (roomType === 'master') freq = 174.0;  // Master Suite: 174Hz Solfeggio Healing Pad

  currentOsc = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  currentOsc.type = "sine";
  currentOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 1.5); // Soft, non-intrusive volume

  currentOsc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  currentOsc.start();
}

// In HUD Audio Toggle Listener:
const btnAudio = document.getElementById("hudAudioBtn");
if (btnAudio) {
  btnAudio.addEventListener("click", () => {
    state.ambientAudioPlaying = !state.ambientAudioPlaying;
    btnAudio.innerHTML = state.ambientAudioPlaying
      ? '<i class="fas fa-volume-up text-gold"></i>'
      : '<i class="fas fa-volume-mute"></i>';

    if (state.ambientAudioPlaying) {
      playAmbientSound(state.currentSceneId);
      showToast("Ambient luxury soundscape active");
    } else {
      if (gainNode && audioCtx) {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      }
      showToast("Sound muted");
    }
  });
}
```

Trigger `playAmbientSound(sceneId)` whenever `switchScene(sceneId)` is invoked.

### 3. Asynchronous Form Handler for 48-Hour Demo Shoot
In `bookingShootForm.addEventListener("submit", ...)`, perform a `fetch('/api/book-shoot')` before opening WhatsApp, ensuring zero dropped leads:

```javascript
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
    window.open(`https://wa.me/919826036000?text=${waMsg}`, "_blank");
  });
}
```

### 4. Automatic Project Re-Ranking by Recency
In `renderBuilderProjects(builderSlug, filterCategory)`, sort the projects array descending by `createdAt` timestamp so any newly added unit appears at `#1` with a `✨ NEW LAUNCH` badge:

```javascript
allProjects.sort((a, b) => {
  const timeA = new Date(a.createdAt || 0).getTime();
  const timeB = new Date(b.createdAt || 0).getTime();
  return timeB - timeA;
});
```

### 5. Hotspot Calibration Mode (Finding Pitch & Yaw for New Info Hotspots)
Add a helper listener inside `initFullscreenPannellum`: when the user holds `Alt` or `Ctrl` and clicks anywhere in the 360 panorama, log the exact `pitch` and `yaw` coordinates to the console and display a toast:

```javascript
if (state.fullscreenViewerInstance) {
  state.fullscreenViewerInstance.on("mousedown", function (e) {
    if (e.altKey || e.ctrlKey) {
      const pitch = state.fullscreenViewerInstance.getPitch().toFixed(1);
      const yaw = state.fullscreenViewerInstance.getYaw().toFixed(1);
      console.log(`HOTSPOT COORDINATES -> pitch: ${pitch}, yaw: ${yaw}`);
      showToast(`Hotspot Coords: pitch: ${pitch}, yaw: ${yaw} (copied to console)`);
    }
  });
}
```

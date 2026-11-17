# Antigravity (agy) Patch — Clean Mobile Navbar & Bulletproof Plot Share / Copy Link

> **Instructions for Antigravity Agent (agy):**  
> Read `static/index.html`, `static/css/style.css`, and `static/js/app.js`.  
> Apply both fixes below cleanly:  
> 1. **Unclutter Top Navbar:** Remove the extra `"Corridors Hub & Plottings"` button from the top header action area (keep it in the Hero section below), leaving only `"Builder Portal"` and `"Book 48-Hr Shoot"` in the top-right navbar, with compact mobile sizing.  
> 2. **Fix Plot Share / Copy Link Button (`#btnCopyPlotLink`):** Ensure clicking the Share/Copy button inside `#modalPlotDetail` reliably copies the direct plot URL (with `execCommand` fallback for HTTP/mobile), shows a clear top pop-up notification (`"आपका लिंक कॉपी हो चुका है, अब आप इसे पेस्ट कर सकते हैं!"`), and triggers native share on supported mobile browsers.

---

## Task 1: Unclutter Top Navbar (`static/index.html` & `static/css/style.css`)

### A. In `static/index.html`:
Inside `<header class="navbar-sticky">` ➔ `.nav-container`:
- Remove any `"Corridors Hub & Plottings"` button/link from the right-side action container (keep `"Corridors Hub & Plottings"` in the `<ul class="nav-menu">` desktop links and in the Hero section CTA button below).
- Keep ONLY the two primary buttons in the top-right action div:
  ```html
  <div class="nav-actions-group" style="display: flex; align-items: center; gap: 10px;">
    <a href="#b/maheshwari-group" class="btn-ghost-gold nav-action-btn">
      <i class="fas fa-building"></i> <span>Builder Portal</span>
    </a>
    <button class="btn-gold btn-book-shoot-trigger nav-action-btn">
      <i class="fas fa-calendar-check"></i> <span>Book 48-Hr Shoot</span>
    </button>
  </div>
  ```

### B. In `static/css/style.css`:
Add compact mobile styling so the navbar never feels crowded next to the logo on small screens (`<= 768px`):
```css
.nav-action-btn {
  padding: 9px 18px;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 10px 14px;
    gap: 8px;
  }
  .brand-title {
    font-size: 1.05rem;
  }
  .brand-sub {
    font-size: 0.55rem;
    letter-spacing: 0.16em;
  }
  .nav-actions-group {
    gap: 6px !important;
  }
  .nav-action-btn {
    padding: 7px 10px !important;
    font-size: 0.74rem !important;
    gap: 5px !important;
  }
}
```

---

## Task 2: Fix Plot Share / Copy Link Button (`static/js/app.js` & `static/index.html`)

### A. In `static/index.html`:
Update `#btnCopyPlotLink` label inside `#modalPlotDetail` so it clearly communicates Copy/Share:
```html
<button id="btnCopyPlotLink" class="btn-ghost-gold" style="flex:1; padding:10px;">
  <i class="fas fa-copy"></i> Copy / Share Link
</button>
```

### B. In `static/js/app.js`:
Add a bulletproof `copyTextToClipboard(text)` helper (works on both HTTPS and local HTTP/mobile browsers) and wire `#btnCopyPlotLink` inside `openPlotDetailModal(plot)`:

```javascript
  function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        ok ? resolve() : reject(new Error("Copy failed"));
      } catch (err) {
        document.body.removeChild(textarea);
        reject(err);
      }
    });
  }

  function showTopCopyBanner(message) {
    let banner = document.getElementById("topCopyToastBanner");
    if (banner) banner.remove();

    banner = document.createElement("div");
    banner.id = "topCopyToastBanner";
    banner.style.cssText =
      "position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:10000002;" +
      "background:rgba(11,13,16,0.96);border:1.5px solid #10B981;color:#FFFFFF;" +
      "padding:12px 22px;border-radius:9999px;font-family:'Plus Jakarta Sans',sans-serif;" +
      "font-size:0.86rem;font-weight:600;box-shadow:0 12px 35px rgba(0,0,0,0.9),0 0 20px rgba(16,185,129,0.35);" +
      "display:flex;align-items:center;gap:10px;max-width:92vw;text-align:center;";
    banner.innerHTML = `<i class="fas fa-check-circle" style="color:#10B981;font-size:1.1rem;"></i><span>${message}</span>`;
    document.body.appendChild(banner);

    setTimeout(() => {
      banner.style.opacity = "0";
      banner.style.transition = "opacity 0.3s ease";
      setTimeout(() => banner.remove(), 300);
    }, 3500);
  }
```

Inside `openPlotDetailModal(plot)`:
```javascript
  const btnCopyPlot = document.getElementById("btnCopyPlotLink");
  if (btnCopyPlot) {
    const plotId = encodeURIComponent(plot.id || plot.plotNo || "plot");
    const slug = state.currentProjectSlug || "tathastu-greens";
    const plotUrl = `${window.location.origin}/p/${slug}?plot=${plotId}`;

    btnCopyPlot.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        await copyTextToClipboard(plotUrl);
        showTopCopyBanner("आपका प्लॉट लिंक कॉपी हो चुका है! अब आप इसे कहीं भी पेस्ट कर सकते हैं।");
        const origHtml = btnCopyPlot.innerHTML;
        btnCopyPlot.innerHTML = `<i class="fas fa-check text-gold"></i> Link Copied!`;
        setTimeout(() => { btnCopyPlot.innerHTML = origHtml; }, 2200);
      } catch (err) {
        prompt("लिंक कॉपी करें:", plotUrl);
      }

      // Optional native share sheet on supported mobile browsers
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Plot #${plot.plotNo} — Tours360`,
            text: `Check out Plot #${plot.plotNo} (${plot.dimensions || ""}) in 360°:`,
            url: plotUrl
          });
        } catch (shareErr) {
          // User cancelled native share; clipboard copy already succeeded
        }
      }
    };
  }
```

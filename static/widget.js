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

// 1. ओपन और क्लोज मोडल
function openAdminModal() {
  const modal = document.getElementById('adminControlModal');
  if (!modal) return;
  
  // मौजूदा सेव्ड वैल्यूज इनपुट में भरें
  document.getElementById('adminPhoneInput').value = localStorage.getItem('t360_phone') || '';
  document.getElementById('adminEmailInput').value = localStorage.getItem('t360_email') || '';
  
  // टॉगल स्विचेस की स्थिति सेट करें
  document.getElementById('toggleSoldOut').checked = localStorage.getItem('t360_feat_soldOutDemo') === 'true';
  document.getElementById('toggleLowData').checked = localStorage.getItem('t360_feat_lowDataMode') === 'true';
  document.getElementById('toggleWatermark').checked = localStorage.getItem('t360_feat_hideWatermark') === 'true';

  modal.style.display = 'flex';
}

function closeAdminModal() {
  const modal = document.getElementById('adminControlModal');
  if (modal) modal.style.display = 'none';
}

// 2. कॉन्टैक्ट डिटेल्स सेव करना
function saveContactSettings() {
  const phone = document.getElementById('adminPhoneInput').value.trim();
  const email = document.getElementById('adminEmailInput').value.trim();

  if (phone) localStorage.setItem('t360_phone', phone);
  if (email) localStorage.setItem('t360_email', email);

  applyClientSettings();
  alert('Contact details updated locally!');
  closeAdminModal();
}

// 3. टॉगल बदलना
function handleFeatureToggle(featureKey, isChecked) {
  localStorage.setItem('t360_feat_' + featureKey, isChecked);
  applyClientSettings();
}

// 4. पेज पर सेटिंग्स अप्लाई करना
function applyClientSettings() {
  // फोन नंबर और ईमेल रिप्लेस करें (फुटर के एलीमेंट्स को सिलेक्ट करके)
  const savedPhone = localStorage.getItem('t360_phone');
  const savedEmail = localStorage.getItem('t360_email');

  if (savedPhone) {
    document.querySelectorAll('.footer-phone, a[href^="tel:"]').forEach(el => {
      el.textContent = savedPhone;
      if (el.tagName === 'A') el.href = `tel:${savedPhone.replace(/\s+/g, '')}`;
    });
  }

  if (savedEmail) {
    document.querySelectorAll('.footer-email, a[href^="mailto:"]').forEach(el => {
      el.textContent = savedEmail;
      if (el.tagName === 'A') el.href = `mailto:${savedEmail}`;
    });
  }

  // फीचर्स चेक करें
  const isSoldOutActive = localStorage.getItem('t360_feat_soldOutDemo') === 'true';
  document.body.classList.toggle('demo-sold-out-active', isSoldOutActive);

  const isLowData = localStorage.getItem('t360_feat_lowDataMode') === 'true';
  document.body.classList.toggle('low-data-mode', isLowData);

  const isWatermarkHidden = localStorage.getItem('t360_feat_hideWatermark') === 'true';
  document.querySelectorAll('.watermark, .branding-tag').forEach(el => {
    el.style.display = isWatermarkHidden ? 'none' : '';
  });
}

// 5. डिफ़ॉल्ट रीसेट
function resetAdminDefaults() {
  if (confirm('Reset all custom settings?')) {
    localStorage.removeItem('t360_phone');
    localStorage.removeItem('t360_email');
    localStorage.removeItem('t360_feat_soldOutDemo');
    localStorage.removeItem('t360_feat_lowDataMode');
    localStorage.removeItem('t360_feat_hideWatermark');
    location.reload();
  }
}

// 6. ऐप लोड होते ही सेटिंग्स अप्लाई करें
let tapCount = 0;
let tapTimer = null;

function registerTap(e) {
  clearTimeout(tapTimer);
  tapCount++;

  tapTimer = setTimeout(() => {
    tapCount = 0;
  }, 1500); // 1.5 seconds window

  if (tapCount >= 9) {
    tapCount = 0;
    clearTimeout(tapTimer);

    const enteredPin = prompt("🔐 Tours360 Admin Mode\nEnter Security PIN:");
    if (enteredPin === "0402026") {
      state.isAdmin = true;
      localStorage.setItem("tours360_admin_unlocked", "true");
      
      if (typeof showToast === "function") {
        showToast("👑 Admin Mode Activated! Access Granted.");
      }

      // 👉 यहाँ एडमिन मोडल ओपन कॉल करें:
      if (typeof openAdminModal === "function") {
        openAdminModal();
      } else {
        console.error("openAdminModal function not found in admin.js");
      }

      if (typeof renderPartners === "function") {
        renderPartners(state.activePartnerTab || 'developers');
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyClientSettings();
});

# Role: Tours360 Lightweight Plotting Colony Onboarding Agent

आपका काम प्लॉटिंग कॉलोनी और एरियल मास्टर व्यू प्रोजेक्ट्स को Tours360 में जोड़ना है।

## Step-by-Step Execution:
1. **Inspect Plotting Setup:** `configs/tathastu-greens.json`, `static/data.json`, और `patchs/antigravity_plottings_polish_sheets_patch.md` को पढ़ें।
2. **Scan Staging Folder:** `staging_uploads/<slug>/` से एरियल पैनोरमा (day/sunset/night), कॉलोनी `.svg` लेआउट, प्लॉट X/Y कोऑर्डिनेट्स, और Google Sheet/Lead routing डिटेल्स पढ़ें।
3. **Move Assets & Generate Config:**
   - एरियल पैनोरमा `static/assets/panos/` में और लेआउट `.svg` को `static/assets/images/` में मूव करें।
   - `configs/<slug>.json` में प्लॉट पिन, शेप और पैनोरमा एंगल कॉन्फ़िग लिखें।
4. **Register & Verify:**
   - `static/data.json` व `static/js/data.js` में लाइटवेट प्लॉटिंग कार्ड एंट्री जोड़ें।
   - `data/status.json` और `status_manager.go` में `"<slug>": true` जोड़ें और `go build .` चलाएं।

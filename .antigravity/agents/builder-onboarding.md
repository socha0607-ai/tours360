# Role: Tours360 Lightweight Builder & Villa Onboarding Agent

आपका काम `staging_uploads/<slug>/` से नए बिल्डर, सैंपल फ्लैट या विला प्रोजेक्ट को स्कैन करके Tours360 में जोड़ना है—बिना वेबसाइट को भारी किए।

## Step-by-Step Execution:
1. **Read Existing Schema:** पहले `static/data.json`, `static/js/data.js` और `configs/tathastu-greens.json` का स्ट्रक्चर चेक करें।
2. **Audit Staging Assets:** `staging_uploads/<slug>/` में मौजूद पैनोरमा और `.svg` फ़ाइलों का साइज़ चेक करें। सुनिश्चित करें कि `day`, `sunset`, और `night` वेरिएंट्स सही नाम (`<slug>_<room>_day.webp` आदि) में हों।
3. **Move Assets Safely:**
   - पैनोरमा फ़ाइलों को `static/assets/panos/` में मूव करें।
   - फ़्लोर प्लान `.svg` और बिल्डर लोगो को `static/assets/images/` में मूव करें।
4. **Modular Data Registration (Lightweight):**
   - `configs/<slug>.json` में प्रोजेक्ट का पूरा सीन मैप, X/Y फ़्लोर प्लान पिन, Pitch/Yaw कोऑर्डिनेट्स और मल्टी-फ़्लोर SVG डेटा सेव करें।
   - `static/data.json` और `static/js/data.js` में सिर्फ़ प्रोजेक्ट/बिल्डर की लाइटवेट एंट्री जोड़ें ताकि शुरुआती पेज लोड फ़ास्ट रहे।
   - `data/status.json` और `status_manager.go` में `"<slug>": true` जोड़ें।
5. **Build Check:** `go build .` चलाकर वेरिफाई करें कि बाइनरी बिना एरर के कम्पाइल हो रही है।

---
description: Staging folder se naya Builder ya Plotting project lightweight tarike se Tours360 mein add karein
---

1. `/home/admin01/tours360/staging_uploads/` के अंदर दिए गए `<slug>` फ़ोल्डर को स्कैन करें।
2. प्रोजेक्ट के प्रकार के अनुसार `@builder-onboarding` या `@plotting-onboarding` सब-एजेंट को एक्टिवेट करें।
3. `AGENTS.md` के लाइटवेट नियमों का पालन करते हुए एसेट्स मूव करें, `configs/<slug>.json`, `static/data.json`, `static/js/data.js`, और `data/status.json` अपडेट करें, और `go build .` से वेरिफाई करें।

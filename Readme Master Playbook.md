# Tours360.in — Master Developer Playbook & Golden README

यह आपके पूरे **Tours360.in** प्रोपटेक प्लेटफॉर्म का **मास्टर गाइड (Golden Reference Manual)** है। इसे अपने प्रोजेक्ट के रूट फोल्डर में `README.md` नाम से रखें ताकि कभी भी कोई कमांड, फोल्डर का काम, बॉट सेटअप, डॉकर या जीसीपी डिप्लॉयमेंट देखना हो, तो यह एक ही जगह मिल जाए।

---

## 1. प्रोजेक्ट आर्किटेक्चर और फोल्डर डायरेक्टरी (Directory Map)

आपके प्रोजेक्ट में फाइल्स का दो-हिस्सों वाला स्ट्रक्चर (Decoupled Architecture) है:

```text
~/tours360/
├── 📁 .git/                 # Git वर्जन कंट्रोल हिस्ट्री
├── 📁 google-cloud-sdk/     # लोकल GCP SDK टूल्स
├── 📁 patchs/               # एंटी-ग्रेविटी (agy) के बैकअप पैच फाइल्स
├── 🐳 Dockerfile            # प्रोडक्शन कंटेनर बनाने की 15MB Alpine रेसिपी
├── ⚙️ gcp_deploy.sh         # 1-क्लिक गूगल क्लाउड डिप्लॉयमेंट बैश स्क्रिप्ट
├── 🐍 generate_panos.py     # 360° पैनोरमा इमेजेस जनरेट करने वाली स्क्रिप्ट
├── 📦 go.mod                # Go मॉड्यूल और पैकेज डिपेंडेंसीज
├── 📄 inquiries.json        # 48-Hour डेमो शूट बुकिंग लीड्स का सुरक्षित डेटाबेस
├── ⚡ main.go               # मुख्य Go (Golang) सर्वर कोड
├── 📄 README.md             # आपका यह मास्टर प्लेबुक डॉक्यूमेंट
├── 📄 start.html            # आपका पर्सनल लोकल टूल / शॉर्टकट
├── ⚙️ tours360              # कम्पाइल की गई स्टैंडअलोन लिनक्स बाइनरी फ़ाइल
│
└── 📁 static/               # 🌐 ब्राउज़र की सारी फाइल्स (Go //go:embed इसे पढ़ता है)
    ├── 📄 index.html        # मुख्य वेबसाइट + सब-UI + 360° व्यूअर SPA
    ├── 📋 data.json         # सभी बिल्डर्स, प्रोजेक्ट्स और कमरों का मास्टर डेटा
    ├── 📁 assets/
    │   ├── 📁 images/       # लोगो, आइकन्स और 2D वास्तु ब्लूप्रिंट्स (floorplan.svg)
    │   └── 📁 panos/        # सभी कमरों की 360° फोटोज़ (.webp / .jpg)
    ├── 📁 css/
    │   ├── style.css        # Obsidian & Champagne Gold लक्ज़री थीम
    │   └── admin.css        # एडमिन कंट्रोल्स की स्टाइलिंग
    ├── 📁 js/
    │   ├── app.js           # मुख्य जावास्क्रिप्ट ऐप कंट्रोलर व ऑडियो इंजन
    │   ├── data.js          # डेटा हेल्पर मेथड्स
    │   └── admin.js         # एडमिन मोड फंक्शन्स
    └── 📁 vendor/
        ├── pannellum.css    # 360° WebGL प्लेयर स्टाइल
        └── pannellum.js     # 360° WebGL प्लेयर इंजन
```

---

## 2. दैनिक Git कमांड्स और "सुरक्षा कवच" (Git Safety Workflow)

कभी भी कोई नया कोड या AI पैच लगाने से पहले यह नियम अपनाएं ताकि कोड कभी खराब न हो:

```bash
# 1. पहली बार Git शुरू करना (सिर्फ एक बार चलाना है):
git init
git add .
git commit -m "Initial commit: Working Tours360 platform"

# 2. जब भी कोई नया काम करना हो (हमेशा टेस्ट ब्रांच में करें):
git checkout -b test-new-feature

# 3. बदलाव करने के बाद स्टेटस और फाइलें चेक करना:
git status
git diff --stat

# 4. अगर बदलाव सही चला, तो मेन कोड में शामिल करें:
git checkout main
git merge test-new-feature
git branch -d test-new-feature

# 5. अगर कुछ गड़बड़ हुई या कोड बिगड़ गया (तुरंत Undo करने के लिए):
git checkout main
git branch -D test-new-feature     # खराब ब्रांच डिलीट, ओरिजिनल कोड 100% सेफ!

# 6. अगर मेन ब्रांच में कोई गलती हो जाए (तुरंत पिछली स्थिति पर लौटने के लिए):
git restore .                     # बिना कमिट किए बदलाव तुरंत रद्द करें
git reset --hard HEAD             # पिछले कमिट पर वापस जाएं
```

---

## 3. लोकल सर्वर और Docker चलाने की कमांड्स (Local Dev & Run)

### विकल्प A: सीधे Go सर्वर से चलाना (सबसे तेज़ — डेवलपमेंट के लिए)
```bash
cd ~/tours360
go run main.go
# ब्राउज़र में खोलें: http://localhost:8080
```

### विकल्प B: Docker कंटेनर में चलाना (प्रोडक्शन टेस्टिंग)
```bash
cd ~/tours360

# 1. डॉकर इमेज बिल्ड करें (सिर्फ 15MB साइज)
docker build -t tours360-app .

# 2. बैकग्राउंड में कंटेनर चलाएं
docker run -d -p 8080:8080 --name tours360-live tours360-app

# 3. रनिंग कंटेनर्स चेक करना
docker ps

# 4. कंटेनर को रोकना और हटाना
docker stop tours360-live && docker rm tours360-live
```

### विकल्प C: अगर सब कुछ शुरुआत से रीस्टार्ट (Fresh Start) करना हो
```bash
# पोर्ट 8080 पर चल रहे पुराने प्रोसेस को तुरंत किल करें
fuser -k 8080/tcp 2>/dev/null

# सर्वर दोबारा चालू करें
go run main.go
```

---

## 4. टेलीग्राम अलर्ट बॉट सेटअप (Instant 48-Hour Lead Notifications)

जब कोई ग्राहक 48-Hour डेमो शूट फॉर्म भरेगा, तो आपके फोन के टेलीग्राम पर 1 सेकंड में नोटिफिकेशन आएगा:

```bash
# 1. टेलीग्राम पर @BotFather से बॉट बनाएं और टोकन लें:
#    Telegram खोलें -> सर्च करें @BotFather -> भेजें /newbot -> नाम रखें -> टोकन मिलेगा

# 2. टेलीग्राम पर अपना Chat ID जानें:
#    अपने बॉट को 'Hi' भेजें -> फिर टेलीग्राम पर सर्च करें @userinfobot -> आपका Chat ID मिल जाएगा

# 3. अपने Ubuntu टर्मिनल में ये दो लाइनें हमेशा के लिए सेट करें:
echo 'export TELEGRAM_BOT_TOKEN="your_bot_token_here"' >> ~/.bashrc
echo 'export TELEGRAM_CHAT_ID="your_chat_id_here"' >> ~/.bashrc
source ~/.bashrc

# 4. टेस्ट करने के लिए यह 1-लाइन कमांड चलाकर फोन चेक करें:
curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage?chat_id=$TELEGRAM_CHAT_ID&text=Tours360+Alert+System+Active!"
```

---

## 5. नया प्रोजेक्ट जोड़ने का 1-कमांड ऑटोमेशन (New Client Workflow)

जब किसी नए विला या फ्लैट का शूट पूरा हो जाए:

```bash
# 1. फोटोज़ को 1.5MB WebP में कंप्रेस करें:
cwebp -q 85 raw_living.jpg -o static/assets/panos/villa_living.webp
cwebp -q 85 raw_balcony.jpg -o static/assets/panos/villa_balcony.webp
cwebp -q 85 raw_layout.png -o static/assets/floorplans/villa_blueprint.webp

# 2. 2D ब्लूप्रिंट पर पिन लोकेशन (x, y) निकालें:
#    ब्राउज़र में http://localhost:8080/?admin=true खोलें
#    ब्लूप्रिंट पर क्लिक करें -> स्क्रीन पर x%, y% आ जाएगा

# 3. static/data.json में नया प्रोजेक्ट सबसे ऊपर (#1) पेस्ट करें।
#    नया प्रोजेक्ट ऑटोमैटिकली पोर्टल पर #1 रैंक पर दिखने लगेगा!
```

---

## 6. Google Cloud Run पर अपलोड और डिप्लॉयमेंट (GCP Production)

### 1-क्लिक डिप्लॉय कमांड (मुंबई रीजन `asia-south1`):
```bash
cd ~/tours360

# 1. GCP में लॉगिन करें (सिर्फ पहली बार):
gcloud auth login
gcloud config set project [YOUR_GCP_PROJECT_ID]

# 2. मुंबई सर्वर पर लाइव करें (100% फ्री टियर - 128MB RAM):
gcloud run deploy tours360 \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --memory 128Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### अगर क्लाउड पर कभी कोई एरर आए तो ट्रबलशूटिंग:
```bash
# 1. लाइव सर्वर के लाइव लॉग्स (Console Logs) देखना:
gcloud run services logs tail tours360 --region asia-south1

# 2. पिछले सुरक्षित वर्शन (Previous Revision) पर तुरंत रोलबैक करना:
gcloud run services update-traffic tours360 --region asia-south1 --to-revisions=PREVIOUS_REVISION_NAME=100

# 3. नई 360 फोटोज़ को बिना सर्वर रीस्टार्ट किए क्लाउड बकेट में डालना:
gcloud storage cp -r static/assets/* gs://tours360-assets/
```

---

## 7. इमरजेंसी ट्रबलशूटिंग चीट-शीट (Top 5 Quick Fixes)

| समस्या (Issue) | मुख्य कारण | तुरंत समाधान (Quick Fix) |
| :--- | :--- | :--- |
| **"bind: address already in use"** | पुराना Go सर्वर या Docker बैकग्राउंड में पोर्ट 8080 घेरे हुए है। | टर्मिनल में चलाएं: `fuser -k 8080/tcp` |
| **"कोड बदला लेकिन ब्राउज़र में नहीं दिख रहा"** | बदलाव बाहर रूट की फाइल में हुआ, अंदर `static/` में नहीं। | सिर्फ `static/` फोल्डर के अंदर वाली फाइलों को एडिट करें। |
| **"360° फोटो बहुत देर से लोड हो रही है"** | इमेज 20MB की भारी JPG है, WebP नहीं। | कंप्रेस करें: `cwebp -q 85 image.jpg -o image.webp` |
| **"टेलीग्राम पर मैसेज नहीं आ रहा"** | `TELEGRAM_BOT_TOKEN` या `CHAT_ID` सेट नहीं है। | `echo $TELEGRAM_BOT_TOKEN` चेक करें या बॉट को पहले 'Hi' भेजें। |
| **"एडमिन मोड नहीं खुल रहा"** | सीक्रेट URL या लोगो टैप मिस हुआ। | ब्राउज़र में सीधे खोलें: `http://localhost:8080/?admin=true` |

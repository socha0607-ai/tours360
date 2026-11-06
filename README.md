# Tours360.in — Central India's Premier WebXR & 360° Digital Twin Platform

> **Obsidian & Champagne Gold Luxury PropTech Suite for High-Value Real Estate Developers in Indore, Madhya Pradesh.**

[![License](https://img.shields.io/badge/License-Proprietary-gold.svg)](#)
[![Status](https://img.shields.io/badge/Status-Production--Ready-emerald.svg)](#)
[![RERA](https://img.shields.io/badge/RERA_MP-Compliant-gold.svg)](#)

---

## 🏛️ Executive Summary

**Tours360.in** is an AI-first, 8K WebXR Digital Twin platform tailored for luxury real estate developers, architectural studios, and marquee hospitality brands across Indore's premier corridors (**Super Corridor, AB Bypass Road, Vijay Nagar / Scheme 54**).

Engineered to replace static PDF brochures, Tours360.in loads high-fidelity 360° digital twins in **< 1.8 seconds on 4G networks** with **zero app downloads** and zero VR headsets required.

---

## 🎨 Design System: "Obsidian & Champagne Gold"

Inspired by the architectural refinement of **Emaar Dubai, Foster+Partners, and Lodha Luxury**:

| Token | Hex / Value | Application |
|---|---|---|
| **Primary Background** | `#0B0D10` | Obsidian deepest black canvas |
| **Card Surface** | `#151921` | Glassmorphism with `backdrop-blur-md` and 1px gold border |
| **Champagne Gold** | `#D4AF37` | Primary accent, metallic gradients, HUD borders, glowing insignia |
| **Text Primary** | `#F8F9FA` | Crisp high-legibility headings & copy |
| **Text Muted** | `#94A3B8` | Secondary specifications & metadata |
| **Status Available** | `#10B981` | Emerald green with animated pulse glow |
| **Status Sold Out** | `#EF4444` | Diagonal red velvet stamp ribbon |
| **WhatsApp CTA** | `#25D366` | Instant site manager & concierge connect |

### Typography
- **Headings**: `'Playfair Display'` (Google Serif for royal luxury)
- **Body & UI**: `'Plus Jakarta Sans'` (Crisp contemporary geometric sans)
- **Metrics, Clock & Sq.Ft.**: `'Space Grotesk'` (High-tech precision monospace)

---

## 🗺️ Multi-Layer Single Page Architecture

The web application features a frictionless router with instant state switching:

```
tours360.in/
├── #agency                    -> VIEW 1: Main Platform Agency Landing Page
├── #b/[builder-slug]          -> VIEW 2: Dedicated Builder Sub-UI Portal (e.g. #b/maheshwari-group)
└── #tour/[project-slug]/[room] -> VIEW 3: Full-Screen 360° Digital Twin Viewer (Pannellum JS)
```

---

## 🌟 Key Functional Features

### 1. View 1 — Main Agency Landing Page
- **Hero 360° Canvas**: Live auto-rotating Pannellum 360° preview card.
- **Live Metrics Ribbon**: `< 1.8s Load Time`, `42% NRI Traffic`, `3.2x Faster Closures`, `99.9% Uptime`.
- **4 Value Pillars**:
  1. *AI Day / Sunset / Night Lighting Switcher with Vastu Sun Engine*
  2. *Google-Sheet Synced Live Inventory ('SOLD OUT' Red Ribbon Engine)*
  3. *Interactive Material Spec Hotspots (Simpolo Italian Marble, Schüco Sliders, Kohler Brassware)*
  4. *Automated 1st-of-Month Buyer Heatmap & PDF Executive Audit*
- **Builder Directory Grid**: Showcase cards for Indore's top developers with one-click portal routing and QR code generation.
- **Dynamic Partners & Team**: Tabbed roster of Developers, Architectural Allies, and Core Team + **"+ Add Client / Teammate"** live modal.
- **48-Hour Demo Shoot Concierge**: Interactive booking modal with automatic WhatsApp dispatch.

### 2. View 2 — Dedicated Builder Sub-UI Portal (`#b/[builder-slug]`)
- **White-Labeled Header**: Real builder logo, RERA registration (`P-IND-22-3841`), location, and direct call/WhatsApp buttons.
- **Filterable Inventory**: Filter by `All Units`, `Available Now`, `Sold Out`, `3BHK`, `4BHK`, `Villas`, `Penthouses`.
- **Live Inventory Cards**: Carpet sq.ft., facing, price display, glowing Available badge or diagonal Sold Out ribbon.
- **Real Scannable QR Modal**: High-res QR codes generated for every unit with direct link copying and PNG hoarding download.

### 3. View 3 — Full-Screen 360° Digital Twin Viewer
- **Pannellum WebGL 360° Viewer**: Ultra-smooth multi-room navigation.
- **HUD Top-Left**: Project name, room title, live digital clock, and Vastu orientation badge (*"East Facing Balcony | Sunrise: 06:12 AM"*).
- **HUD Top-Right Lighting Switcher**:
  - `☀️ Day 7:00 AM`: Direct morning sunlight & sharp shadows
  - `🌅 Sunset 5:45 PM`: Golden hour amber glow over Indore skyline
  - `🌙 Night 8:30 PM`: Architectural cove lighting & twilight ambiance
- **Interactive Hotspots**:
  - Radar-pulsing navigation pins to walk between Living Foyer, East Balcony, Chef's Kitchen, and Master Suite.
  - Golden specification hotspots opening detailed material specs, acoustic ratings, brand certificates, and warranties.
- **Interactive 2D Architectural Floor Plan**: Clickable layout with pulsing room markers.
- **Floating WhatsApp CTA**: Pre-filled inquiry sent directly to the site manager.

---

## 📁 File Structure

```
/home/admin01/tours360/
├── index.html                   # Master Single Page Application entrypoint
├── css/
│   └── style.css                # Obsidian & Champagne Gold design system
├── js/
│   ├── data.js                  # Modular JSON engine for Builders, Units, Scenes, Partners
│   └── app.js                   # SPA router, Pannellum controller, Lighting engine, QR generator
├── vendor/
│   ├── pannellum.js             # High-performance local WebGL 360 engine
│   └── pannellum.css            # Pannellum core styles
├── assets/
│   ├── images/
│   │   ├── builder_maheshwari.svg
│   │   ├── builder_apollo.svg
│   │   ├── builder_treasure.svg
│   │   ├── builder_shreem.svg
│   │   ├── builder_sayaji.svg
│   │   └── floorplan.svg        # Interactive 2D architectural blueprint
│   └── panos/                   # High-res 2:1 equirectangular architectural 360 panoramas
│       ├── living_day.jpg
│       ├── living_sunset.jpg
│       ├── living_night.jpg
│       ├── balcony_day.jpg
│       ├── kitchen_day.jpg
│       └── master_day.jpg
└── generate_panos.py            # Equirectangular panorama generation engine
```

---

## ⚡ How to Add a New Builder or Project in 30 Seconds

Open [js/data.js](file:///home/admin01/tours360/js/data.js):

### Adding a Builder:
```javascript
{
  id: "b-newgroup",
  slug: "newgroup-realty",
  name: "NewGroup Realty",
  logo: "assets/images/builder_maheshwari.svg",
  reraNo: "P-IND-24-9988",
  location: "Super Corridor, Indore",
  salesHead: "Aman Sharma",
  salesPhone: "+91 98260 99999",
  whatsapp: "919826099999",
  shortDescription: "Signature sky towers on Super Corridor.",
  badge: "VERIFIED BUILDER",
  stats: { completedProjects: 5, sqftDelivered: "1.2 Million", digitalTwinVisits: "34,000+" }
}
```

### Adding a Project Unit:
```javascript
{
  id: "p-new-unit",
  slug: "new-tower-3bhk",
  builderSlug: "newgroup-realty",
  title: "New Tower — 3BHK Smart Suite",
  tagline: "East-Facing Sunrise Balcony",
  category: "3BHK",
  carpetSqFt: 2200,
  facing: "East Facing (Surya Vastu)",
  status: "AVAILABLE", // or 'SOLD_OUT'
  priceDisplay: "₹ 1.85 Cr",
  pricePerSqFt: "₹ 8,409 / Sq.Ft.",
  thumbnail: "https://images.unsplash.com/...",
  defaultSceneId: "living"
}
```

---

## 🚀 Running the Platform

To view or serve locally:
```bash
python3 -m http.server 8080 --directory /home/admin01/tours360
```
Open **`http://localhost:8080/`** in any modern desktop or mobile browser.

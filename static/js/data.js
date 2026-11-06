/**
 * ============================================================================
 * TOURS360.IN — CENTRAL INDIA'S LUXURY WEBXR & 360° DIGITAL TWIN PLATFORM
 * ============================================================================
 * Clean Modular Data Engine:
 * Easily add a new builder, project, or teammate in 30 seconds by appending
 * to the respective array below!
 * ============================================================================
 */

const TOURS360_DATA = {
  // Global platform configuration
  platform: {
    name: "Tours360.in",
    tagline: "Central India's Premier WebXR & 360° Digital Twin Platform",
    city: "Indore, Madhya Pradesh",
    headquarters: "Level 4, Brilliant Convention Centre, Scheme 78, Vijay Nagar, Indore - 452010",
    phone: "+91 8261098681",
    whatsapp: "+918261098681",
    email: "concierge@tours360.in",
    reracompliance: "MPRERA Tech Partner Id: MP-TECH-2024-089"
  },

  // 1. BUILDER ENTITIES (Indore & Central India flagship real estate groups)
  builders: [
    {
      id: "b-maheshwari",
      slug: "maheshwari-group",
      name: "Maheshwari Group",
      legalName: "Maheshwari Developers & Infratech Pvt. Ltd.",
      logo: "assets/images/builder_maheshwari.svg",
      reraNo: "P-IND-22-3841",
      location: "Scheme 54, PU-4 Commercial, Vijay Nagar, Indore",
      established: "2006",
      salesHead: "Vikramaditya Maheshwari",
      salesPhone: "+91 98261 11222",
      whatsapp: "919826111222",
      shortDescription: "Pioneers of ultra-luxury highrises and sky mansions across AB Road & Vijay Nagar.",
      badge: "ELITE DEVELOPER",
      stats: {
        completedProjects: 14,
        sqftDelivered: "4.8 Million",
        digitalTwinVisits: "182,400+"
      }
    },
    {
      id: "b-apollo",
      slug: "apollo-creations",
      name: "Apollo Creations",
      legalName: "Apollo Creations Realty LLP",
      logo: "assets/images/builder_apollo.svg",
      reraNo: "P-IND-23-4512",
      location: "Super Corridor (Opp. TCS Campus), Indore",
      established: "2012",
      salesHead: "Rajeshwar Shinde",
      salesPhone: "+91 98262 33444",
      whatsapp: "919826233444",
      shortDescription: "Indore's leading tech-integrated luxury towers on the high-growth Super Corridor.",
      badge: "TECH INTEGRATED",
      stats: {
        completedProjects: 9,
        sqftDelivered: "3.2 Million",
        digitalTwinVisits: "145,000+"
      }
    },
    {
      id: "b-treasure",
      slug: "treasure-group",
      name: "Treasure Group",
      legalName: "Treasure Landmark Developers Ltd.",
      logo: "assets/images/builder_treasure.svg",
      reraNo: "P-IND-21-2998",
      location: "AB Bypass Road, Bicholi Mardana, Indore",
      established: "1998",
      salesHead: "Ananya Rathore",
      salesPhone: "+91 98263 55666",
      whatsapp: "919826355666",
      shortDescription: "Iconic landmark township creators featuring Central India's finest private golf clubs.",
      badge: "LANDMARK DEVELOPER",
      stats: {
        completedProjects: 22,
        sqftDelivered: "8.5 Million",
        digitalTwinVisits: "230,000+"
      }
    },
    {
      id: "b-shreem",
      slug: "shreem-infra",
      name: "Shreem Infra",
      legalName: "Shreem Infrastructure & Courtyard Homes",
      logo: "assets/images/builder_shreem.svg",
      reraNo: "P-IND-24-5103",
      location: "Bypass Green Belt, Near Mayank Blue Water Park, Indore",
      established: "2015",
      salesHead: "Karan Johar Patel",
      salesPhone: "+91 98264 77888",
      whatsapp: "919826477888",
      shortDescription: "Bespoke courtyard luxury villas infused with biophilic design and Vastu balance.",
      badge: "SUSTAINABLE LUXURY",
      stats: {
        completedProjects: 6,
        sqftDelivered: "1.9 Million",
        digitalTwinVisits: "89,000+"
      }
    },
    {
      id: "b-sayaji",
      slug: "sayaji-luxury",
      name: "Sayaji Luxury Hospitality",
      legalName: "Sayaji Hotels & Convention Centre Ltd.",
      logo: "assets/images/builder_sayaji.svg",
      reraNo: "HOSP-IND-2023",
      location: "H-1, Scheme No. 54, Vijay Nagar, Indore",
      established: "1990",
      salesHead: "Siddharth Chordia",
      salesPhone: "+91 98265 99000",
      whatsapp: "919826599000",
      shortDescription: "5-Star hospitality digital twins for destination weddings, royal banquets & NRI suites.",
      badge: "LUXURY HOSPITALITY",
      stats: {
        completedProjects: 12,
        sqftDelivered: "2.1 Million",
        digitalTwinVisits: "94,000+"
      }
    }
  ],

  // 2. PROJECT UNITS & DIGITAL TWIN INVENTORY
  projects: [
    {
      id: "p-imperial-4bhk",
      slug: "imperial-grand-4bhk",
      builderSlug: "maheshwari-group",
      title: "The Imperial Grand — 4BHK Presidential Suite",
      tagline: "Double-Height Ceilings & East-Facing Sunrise Balcony",
      category: "4BHK",
      subCategory: "Sky Mansion",
      tower: "Tower A (Skyline Tower) • 18th Floor",
      carpetSqFt: 3450,
      superBuiltUpSqFt: 4650,
      facing: "East Facing (Surya & Ishanya Vastu)",
      vastuCompliance: "100% Vastu Compliant with Ishanya Corner Balcony",
      status: "AVAILABLE", // 'AVAILABLE' | 'SOLD_OUT'
      priceDisplay: "₹ 3.85 Cr",
      pricePerSqFt: "₹ 8,279 / Sq.Ft.",
      thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80",
      defaultSceneId: "living",
      features: [
        "Floor-to-Ceiling Schüco Soundproof Sliders",
        "Direct High-Speed Private Elevator",
        "Simpolo Calacatta 4x2 Italian Glazed Marble",
        "Hafele Soft-Close European Kitchen"
      ]
    },
    {
      id: "p-imperial-5bhk-duplex",
      slug: "imperial-penthouse-5bhk",
      builderSlug: "maheshwari-group",
      title: "The Imperial Penthouse — 5BHK Sky Duplex",
      tagline: "Private Rooftop Plunge Pool & 360° Indore Bypass Panorama",
      category: "Penthouses",
      subCategory: "Duplex Penthouse",
      tower: "Tower A (Skyline Tower) • 24th & 25th Floor",
      carpetSqFt: 5200,
      superBuiltUpSqFt: 7100,
      facing: "North-East Corner Facing",
      vastuCompliance: "Kubera & Ishanya Directional Harmony",
      status: "SOLD_OUT", // Live Inventory Sold Out Stamp Demonstration
      priceDisplay: "₹ 6.20 Cr",
      pricePerSqFt: "₹ 8,732 / Sq.Ft.",
      thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80",
      defaultSceneId: "living",
      features: [
        "Private Temperature-Controlled Plunge Pool",
        "Double-Height 22ft Living Room Glass Atrium",
        "Custom Home Theatre Room (12-Seater)",
        "Automated Biometric Access"
      ]
    },
    {
      id: "p-ozone-3bhk",
      slug: "ozone-park-3bhk",
      builderSlug: "apollo-creations",
      title: "Ozone Park — 3BHK Smart Tech Suite",
      tagline: "Overlooking TCS & Infosys Campus on Super Corridor",
      category: "3BHK",
      subCategory: "Smart Suite",
      tower: "Cyber Tower 2 • 11th Floor",
      carpetSqFt: 2180,
      superBuiltUpSqFt: 2950,
      facing: "East Facing (Morning Sun Energized)",
      vastuCompliance: "Optimized for positive solar flux",
      status: "AVAILABLE",
      priceDisplay: "₹ 1.95 Cr",
      pricePerSqFt: "₹ 6,610 / Sq.Ft.",
      thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&auto=format&fit=crop&q=80",
      defaultSceneId: "living",
      features: [
        "Complete Lutron App & Voice Automation",
        "Air Purification Centralized HEPA Filters",
        "Electric Vehicle Rapid Charger in Stilt Parking",
        "5G Fiber WebXR Hub Pre-installed"
      ]
    },
    {
      id: "p-ozone-4bhk-skyvilla",
      slug: "ozone-park-4bhk-skyvilla",
      builderSlug: "apollo-creations",
      title: "Ozone Park — 4BHK Executive Sky Villa",
      tagline: "Panoramic Corner Terrace with Outdoor Jacuzzi Deck",
      category: "4BHK",
      subCategory: "Sky Villa",
      tower: "Cyber Tower 1 • 14th Floor",
      carpetSqFt: 2980,
      superBuiltUpSqFt: 4050,
      facing: "North-West Corner",
      vastuCompliance: "Balanced Air & Light Vastu Grid",
      status: "AVAILABLE",
      priceDisplay: "₹ 2.65 Cr",
      pricePerSqFt: "₹ 6,543 / Sq.Ft.",
      thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&auto=format&fit=crop&q=80",
      defaultSceneId: "living",
      features: [
        "Private Terrace Garden with Hydroponic Wall",
        "Kohler Smart Digital Shower Experience",
        "German Soundproof Double Wall Cavities",
        "2 Dedicated Basement Car Parks"
      ]
    },
    {
      id: "p-treasure-crest-villa",
      slug: "treasure-crest-villa",
      builderSlug: "treasure-group",
      title: "The Royal Crest — Signature Golf Villa",
      tagline: "Palatial 5BHK Independent Estate with Private Lawn",
      category: "Villas",
      subCategory: "Golf Estate Villa",
      tower: "Villa Enclave • Plot #42",
      carpetSqFt: 4800,
      superBuiltUpSqFt: 6200,
      facing: "East-Facing Royal Courtyard",
      vastuCompliance: "Ancient Vastu Mandala Grid Layout",
      status: "AVAILABLE",
      priceDisplay: "₹ 4.50 Cr",
      pricePerSqFt: "₹ 7,258 / Sq.Ft.",
      thumbnail: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&auto=format&fit=crop&q=80",
      defaultSceneId: "living",
      features: [
        "Private 1,800 Sq.Ft. Manicured Emerald Lawn",
        "Direct Golf Cart Track Access to 9-Hole Greens",
        "Triple Height Italian Statuario Foyer",
        "Solar Net-Metering & Rainwater Harvesting"
      ]
    },
    {
      id: "p-shreem-eden-villa",
      slug: "shreem-vistara-villa",
      builderSlug: "shreem-infra",
      title: "Vistara Eco — 4BHK Courtyard Villa",
      tagline: "Biophilic Courtyard Architecture on AB Bypass Road",
      category: "Villas",
      subCategory: "Eco Villa",
      tower: "Vistara Groves • Villa #18",
      carpetSqFt: 3600,
      superBuiltUpSqFt: 4800,
      facing: "North-East (Ishanya Entrance)",
      vastuCompliance: "Central Brahmasthan Open Courtyard",
      status: "SOLD_OUT",
      priceDisplay: "₹ 3.40 Cr",
      pricePerSqFt: "₹ 7,083 / Sq.Ft.",
      thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&auto=format&fit=crop&q=80",
      defaultSceneId: "living",
      features: [
        "Open-to-Sky Traditional Central Brahmasthan",
        "Terracotta Jali Thermal Cooling Screens",
        "Teakwood Handcrafted Entry Doorway",
        "Infinity Edge Lotus Pond"
      ]
    }
  ],

  // 3. 360° SCENES, HOTSPOTS & TIME LIGHTING ENGINE
  // All scenes support Day, Sunset, and Night photorealistic switches!
  scenes: {
    living: {
      id: "living",
      title: "Grand Living Room & Foyer",
      roomCategory: "Living & Entertainment",
      vastuDirection: "Ishanya (North-East) Main Foyer & East Sunrise Terrace",
      description: "Expansive 32ft wide living room dressed with Calacatta Gold tiles, fluted acoustic panels, and floor-to-ceiling glass looking toward the morning sun.",
      lightingModes: {
        day: {
          time: "07:00 AM",
          sunText: "☀️ East Sunrise | Solar Elevation: +18° | Vastu: Ishanya Corner | Pristine Natural Daylight",
          image: "assets/panos/HALL1.webp",
          brightness: 1.05,
          contrast: 1.02,
          ambientColor: "rgba(255, 245, 230, 0.04)"
        },
        sunset: {
          time: "05:45 PM",
          sunText: "🌅 Golden Hour Dusk | Sunset: 06:04 PM | Solar Azimuth: 262° West | Warm Amber Skyline",
          image: "assets/panos/living_sunset.jpg",
          brightness: 0.96,
          contrast: 1.10,
          ambientColor: "rgba(245, 130, 50, 0.08)"
        },
        night: {
          time: "08:30 PM",
          sunText: "🌙 Obsidian Architectural Cove | 2700K Warm Dimming | Indore Night Skyline View",
          image: "assets/panos/living_night.jpg",
          brightness: 0.88,
          contrast: 1.15,
          ambientColor: "rgba(20, 25, 45, 0.12)"
        }
      },
      navHotspots: [
        {
          id: "nav-to-balcony",
          pitch: -8,
          yaw: 88,
          text: "Walk to East Balcony",
          targetSceneId: "balcony",
          icon: "fa-door-open"
        },
        {
          id: "nav-to-master",
          pitch: -10,
          yaw: -95,
          text: "Enter Master Suite",
          targetSceneId: "master",
          icon: "fa-bed"
        },
        {
          id: "nav-to-kitchen",
          pitch: -12,
          yaw: -175,
          text: "Chef's Modular Kitchen",
          targetSceneId: "kitchen",
          icon: "fa-utensils"
        }
      ],
      specHotspots: [
        {
          id: "spec-marble",
          pitch: -28,
          yaw: 15,
          title: "Simpolo 4x2 Italian Glazed Vitrified Tiles",
          brand: "Simpolo Ceramica (Calacatta Gold Series)",
          warranty: "25-Year Sheen Warranty",
          specDetails: "Ultra-compact Calacatta Gold with mirror finish, 0.05% water absorption, anti-skid nano treatment, and rectified laser joints.",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
          tag: "FLOORING SPEC"
        },
        {
          id: "spec-slider",
          pitch: 5,
          yaw: 92,
          title: "Soundproof UPVC Double-Glazed Slider",
          brand: "Schüco International Germany",
          warranty: "15-Year Weather & Acoustic Seal",
          specDetails: "Acoustic laminated double-pane glazing with argon gas cavity. Certified 42dB outdoor noise reduction against highway traffic.",
          image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&auto=format&fit=crop&q=80",
          tag: "ACOUSTIC SPEC"
        },
        {
          id: "spec-cove",
          pitch: 22,
          yaw: -30,
          title: "Circadian Rhythm Magnetic Track Lighting",
          brand: "Lutron HomeWorks & Philips Master Pro",
          warranty: "5-Year Smart Driver Replacement",
          specDetails: "Tunable white lighting shifting from energizing 6000K daylight to calming 2200K amber evening glow automatically.",
          image: "https://images.unsplash.com/photo-1540518614846-7ede433c4550?w=600&auto=format&fit=crop&q=80",
          tag: "SMART LIGHTING"
        }
      ]
    },

    balcony: {
      id: "balcony",
      title: "East-Facing Sunrise Balcony",
      roomCategory: "Outdoor & Wellness",
      vastuDirection: "Direct Purva (East) Facing | Unobstructed Super Corridor Horizon",
      description: "A cantilevered 10ft deep outdoor lounge with panoramic vistas of lush green reserves and early morning Indore sunrise.",
      lightingModes: {
        day: {
          time: "07:00 AM",
          sunText: "☀️ Purva (East) Sunrise Deck | Fresh Morning Pranic Energy | Unhindered Sky Horizon",
          image: "assets/panos/BALCONY1.webp",
          brightness: 1.08,
          contrast: 1.05,
          ambientColor: "rgba(255, 250, 235, 0.05)"
        },
        sunset: {
          time: "05:45 PM",
          sunText: "🌅 Twilight Cool Breeze | Ambient Dusk over Super Corridor Trees",
          image: "assets/panos/balcony_day.jpg",
          brightness: 0.92,
          contrast: 1.12,
          ambientColor: "rgba(240, 110, 50, 0.10)"
        },
        night: {
          time: "08:30 PM",
          sunText: "🌙 Stargazing Skydeck | Accent Teak Plinth Illumination & Cool Night Breeze",
          image: "assets/panos/balcony_day.jpg",
          brightness: 0.82,
          contrast: 1.20,
          ambientColor: "rgba(15, 20, 40, 0.15)"
        }
      },
      navHotspots: [
        {
          id: "nav-to-living-from-balcony",
          pitch: -10,
          yaw: -88,
          text: "Return to Living Room",
          targetSceneId: "living",
          icon: "fa-arrow-left"
        }
      ],
      specHotspots: [
        {
          id: "spec-deck",
          pitch: -24,
          yaw: -45,
          title: "Weatherproof Composite Teak Decking",
          brand: "Ecodeck Scandinavia Pro",
          warranty: "20-Year Anti-Fading Guarantee",
          specDetails: "High-density polymer composite with authentic wood grain texture. Zero splinters, termite proof, and high UV heat resistance.",
          image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
          tag: "DECK SPEC"
        },
        {
          id: "spec-railing",
          pitch: -5,
          yaw: 5,
          title: "Frameless Toughened Glass Balustrade",
          brand: "Saint-Gobain GlassPro",
          warranty: "Lifetime Structural Integrity",
          specDetails: "15mm laminated toughened safety glass with champagne gold anodized aluminum base shoe tested up to 3kN/m impact resistance.",
          image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&auto=format&fit=crop&q=80",
          tag: "SAFETY GLASS"
        }
      ]
    },

    kitchen: {
      id: "kitchen",
      title: "Modular European Chef's Kitchen",
      roomCategory: "Culinary & Dining",
      vastuDirection: "Agneya (South-East) Vastu Quadrant | Auspicious Fire Element Zone",
      description: "Ergonomically planned parallel chef kitchen featuring Italian quartz waterfall island, Hafele Blumotion pull-outs, and built-in appliances.",
      lightingModes: {
        day: {
          time: "07:00 AM",
          sunText: "☀️ Agneya Sun Angle | Natural Morning Light & Cross Ventilation",
          image: "assets/panos/KITCHEN1.webp",
          brightness: 1.05,
          contrast: 1.02,
          ambientColor: "rgba(255, 245, 230, 0.03)"
        },
        sunset: {
          time: "05:45 PM",
          sunText: "🌅 Warm Prep Counter Illumination | Evening Culinary Ambiance",
          image: "assets/panos/kitchen_day.jpg",
          brightness: 0.95,
          contrast: 1.08,
          ambientColor: "rgba(235, 120, 60, 0.08)"
        },
        night: {
          time: "08:30 PM",
          sunText: "🌙 3000K Soft Warm Task Lighting | Obsidian Fluted Cabinet Glow",
          image: "assets/panos/kitchen_day.jpg",
          brightness: 0.86,
          contrast: 1.15,
          ambientColor: "rgba(18, 22, 35, 0.12)"
        }
      },
      navHotspots: [
        {
          id: "nav-to-living-from-kitchen",
          pitch: -10,
          yaw: 0,
          text: "Return to Living Room",
          targetSceneId: "living",
          icon: "fa-arrow-left"
        }
      ],
      specHotspots: [
        {
          id: "spec-faucet",
          pitch: -18,
          yaw: 25,
          title: "Kohler Brushed Brass Touchless Faucet",
          brand: "Kohler Co. Sensate Series",
          warranty: "10-Year Leak-Free Cartridge",
          specDetails: "Response technology sensor activates in 20ms. PVD vibrant brushed modern brass surface prevents tarnishing and corrosion.",
          image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
          tag: "FIXTURE SPEC"
        },
        {
          id: "spec-drawers",
          pitch: -15,
          yaw: -40,
          title: "Häfele Legrabox Soft-Close Drawer Systems",
          brand: "Häfele Germany & Blum",
          warranty: "Lifetime Mechanism Guarantee",
          specDetails: "70kg dynamic load capacity with synchronized feather-light glide. Matte Orion grey steel drawer walls with leather inserts.",
          image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
          tag: "CABINET HARDWARE"
        }
      ]
    },

    master: {
      id: "master",
      title: "Master Presidential Suite",
      roomCategory: "Private Quarters",
      vastuDirection: "Nairrutya (South-West) Corner | Master Vastu Anchor for Prosperity",
      description: "Sumptuous master sanctuary adorned with acoustic fluted suede headboard wall, smoked herringbone oak parquet, and private balcony slider.",
      lightingModes: {
        day: {
          time: "07:00 AM",
          sunText: "☀️ Nairrutya Master Suite | Soft Diffused Morning Light",
          image: "assets/panos/REDhall.webp",
          brightness: 1.03,
          contrast: 1.02,
          ambientColor: "rgba(255, 240, 225, 0.04)"
        },
        sunset: {
          time: "05:45 PM",
          sunText: "🌅 Warm Twilight Reflections | Suede Acoustic Intimacy",
          image: "assets/panos/master_day.jpg",
          brightness: 0.94,
          contrast: 1.09,
          ambientColor: "rgba(235, 125, 60, 0.08)"
        },
        night: {
          time: "08:30 PM",
          sunText: "🌙 Hotel-Grade Dim-to-Warm Bedside Ambiance | Peaceful Retreat",
          image: "assets/panos/master_day.jpg",
          brightness: 0.85,
          contrast: 1.15,
          ambientColor: "rgba(18, 20, 32, 0.12)"
        }
      },
      navHotspots: [
        {
          id: "nav-to-living-from-master",
          pitch: -10,
          yaw: 110,
          text: "Back to Living Room",
          targetSceneId: "living",
          icon: "fa-arrow-left"
        }
      ],
      specHotspots: [
        {
          id: "spec-parquet",
          pitch: -25,
          yaw: -30,
          title: "Smoked Oak Herringbone Parquet Flooring",
          brand: "Pergo Scandinavia (Lofoten Chevron Collection)",
          warranty: "25-Year Residential Warranty",
          specDetails: "Hand-scraped authentic Nordic smoked oak with genuine bevelled edges. Certified AC5 wear resistance and underfloor heating compatible.",
          image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=80",
          tag: "WOOD FLOORING"
        },
        {
          id: "spec-wall",
          pitch: 8,
          yaw: 40,
          title: "Acoustic Fluted Suede Wall Paneling",
          brand: "Kvadrat Denmark",
          warranty: "10-Year Colorfast Guarantee",
          specDetails: "High acoustic coefficient NRC 0.82 dampens outside reverberation. Fire-rated luxury micro-suede fluted with champagne brass reveals.",
          image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&auto=format&fit=crop&q=80",
          tag: "WALL ARCHITECTURE"
        }
      ]
    }
  },

  // 4. PARTNERS, ALLIES & CORE TEAM
  partners: {
    developers: [
      {
        id: "p-dev-1",
        name: "Maheshwari Group",
        category: "Tier-1 Highrise Developer",
        city: "Indore (Vijay Nagar & AB Road)",
        unitsTwin: 18,
        activeNRIQueries: 412,
        logoText: "MAHESHWARI",
        badge: "EXCLUSIVE PARTNER",
        avatar: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "p-dev-2",
        name: "Apollo Creations",
        category: "Tech Enclave Developer",
        city: "Indore (Super Corridor)",
        unitsTwin: 14,
        activeNRIQueries: 320,
        logoText: "APOLLO",
        badge: "TECH ALLIANCE",
        avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "p-dev-3",
        name: "Treasure Group",
        category: "Golf & Landmark Township",
        city: "Indore (AB Bypass)",
        unitsTwin: 24,
        activeNRIQueries: 580,
        logoText: "TREASURE",
        badge: "STRATEGIC PARTNER",
        avatar: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "p-dev-4",
        name: "Shreem Infra & Courtyards",
        category: "Bespoke Sustainable Villas",
        city: "Indore (Bicholi Mardana)",
        unitsTwin: 8,
        activeNRIQueries: 195,
        logoText: "SHREEM",
        badge: "HERITAGE ALLY",
        avatar: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&auto=format&fit=crop&q=80"
      }
    ],

    architects: [
      {
        id: "p-arch-1",
        name: "Studio VastuKriti Architects",
        principal: "Ar. Harshvardhan Joshi",
        role: "Chief Vastu Shastra Consultant & BIM Integrator",
        city: "Indore & Mumbai",
        projectsDone: 34,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "p-arch-2",
        name: "Design Studio 73",
        principal: "Ar. Meera Sengupta",
        role: "Luxury Interior Spatial Designer",
        city: "Indore & Bhopal",
        projectsDone: 28,
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "p-arch-3",
        name: "Nexus Urbanism & Parametric Lab",
        principal: "Er. Alok Ranjan",
        role: "Drone LiDAR & 3D Gaussian Splatting Specialist",
        city: "Indore & Pune",
        projectsDone: 42,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
      }
    ],

    team: [
      {
        id: "t-1",
        name: "Aditya Vardhan Sharma",
        role: "Founder & Chief WebXR Architect",
        city: "Indore (HQ)",
        bio: "Former Stanford Graphics Fellow. Pioneer of sub-second WebXR loading architectures for Indian real estate.",
        badge: "FOUNDER",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "t-2",
        name: "Pooja Deshmukh",
        role: "Lead Matterport Pro3 & Drone LiDAR Pilot",
        city: "Indore & Ujjain",
        bio: "DGCA-certified commercial drone commander with 850+ hours of aerial high-density photogrammetry captures.",
        badge: "INDORE LEAD",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "t-3",
        name: "Nikhil Kulkarni",
        role: "Field 360° Capture Specialist",
        city: "Nagpur & Raipur",
        bio: "Expert in HDR multi-exposure bracketing and Insta360 Titan 11K cinema 360 captures for sprawling townships.",
        badge: "NAGPUR CAPTURE",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "t-4",
        name: "Devendra Rathore",
        role: "Heritage & Villa Capture Lead",
        city: "Jaipur & Udaipur",
        bio: "Specialist in high-dynamic range captures of royal havelis, luxury courtyard villas and boutique resort estates.",
        badge: "JAIPUR SPECIALIST",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80"
      }
    ]
  },

  // Helper API methods for dynamic manipulation
  getBuilder(slug) {
    return this.builders.find(b => b.slug === slug);
  },

  getProject(slug) {
    return this.projects.find(p => p.slug === slug);
  },

  getProjectsByBuilder(builderSlug) {
    return this.projects.filter(p => p.builderSlug === builderSlug);
  },

  getScene(sceneId) {
    return this.scenes[sceneId] || this.scenes.living;
  },

  // Add teammate / partner dynamically live
  addPartner(type, item) {
    if (this.partners[type]) {
      this.partners[type].push(item);
      return true;
    }
    return false;
  }
};

// Export to window
if (typeof window !== "undefined") {
  window.TOURS360_DATA = TOURS360_DATA;
}

# The Sovereign: Modding Wiki & Package Developer Guide
### The Sovereign: Acts of the Apostles™

Welcome to **The Sovereign Modding Wiki**! The game is built from the ground up on the **Data-Driven Package Paradigm**, meaning the game rules and state machine are completely decoupled from content definitions. 

You can create new apostle figures, expand the map with new Mediterranean provinces, write custom Providential Decree event cards, or even reskin the entire interface with custom themes—all by creating simple JSON mod packages.

---

## 🧭 Table of Contents

1. [Architecture & Philosophy](#1-architecture--philosophy)
2. [Package Schema (`SovereignModPackage`)](#2-package-schema)
3. [Step-by-Step Tutorial: Creating a Custom Mod](#3-step-by-step-tutorial-creating-a-custom-mod)
4. [Using the In-Game Package Manager](#4-using-the-in-game-package-manager)
5. [Modding Policy & Best Practices](#5-modding-policy--best-practices)

---

## 1. Architecture & Philosophy

The engine evaluates game content through a reactive pipeline managed by `ModContext`:

```
┌────────────────────────────────────────────────────────┐
│               FLAGSHIP CORE MANIFEST                   │
│   (Default Apostles, Official Map, 10 Core Events)     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             ACTIVE COMMUNITY MOD PACKAGES              │
│   (Overrides, additions, custom themes, new rules)     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                 RESOLVED GAME STATE                    │
│   (Used by game engine, map renderer, and dice runner) │
└────────────────────────────────────────────────────────┘
```

When a mod package is toggled **Active**, its overrides and appended content are seamlessly merged over the base game in real-time.

---

## 2. Package Schema

A mod is defined as a `SovereignModPackage` JSON object. Here is the TypeScript interface definition:

```typescript
export interface SovereignModPackage {
  manifest: {
    id: string;           // Unique reverse-DNS ID (e.g. "com.author.modname")
    name: string;         // Human-readable title
    version: string;      // Semantic version (e.g. "1.0.0")
    author: string;       // Author name or handle
    description: string;  // Short summary of changes
    tags: string[];       // Tags: ["Apostles", "Events", "Regions", "Theme"]
  };
  brandingOverrides?: {
    gameName?: string;
    tagline?: string;
    epigraphText?: string;
    epigraphReference?: string;
  };
  themeOverrides?: {
    accentColor?: string;     // Tailwind color class or hex
    panelBackground?: string; // Panel backdrop class
    borderColor?: string;     // Border color class
  };
  contentOverrides?: {
    additionalApostles?: ApostleDefinition[];
    additionalRegions?: RegionDefinition[];
    additionalEvents?: GameEventCard[];
  };
}
```

---

## 3. Step-by-Step Tutorial: Creating a Custom Mod

Let's build a sample expansion pack: **"The Gallic Frontier & St. Barnabas"**.

### Sample Mod JSON (`gallic-frontier.json`):

```json
{
  "manifest": {
    "id": "com.community.gallic-frontier",
    "name": "The Gallic Frontier Expansion",
    "version": "1.0.0",
    "author": "Community Scribe",
    "description": "Introduces Barnabas the Encourager, the frontier province of Gaul, and a new theological decree card.",
    "tags": ["Apostles", "Regions", "Events"]
  },
  "contentOverrides": {
    "additionalApostles": [
      {
        "id": "barnabas",
        "name": "Barnabas",
        "title": "Son of Encouragement",
        "homeRegion": "cyprus",
        "icon": "Users",
        "color": "amber",
        "baseAbility": "Generous Fellowship: Whenever an adjacent apostle rolls for Seed Planting, they add +1 to their roll result.",
        "passiveDescription": "Adds +1 to all ally planting rolls in the same or adjacent region."
      }
    ],
    "additionalRegions": [
      {
        "id": "gaul",
        "name": "Gaul (Gallia Narbonensis)",
        "difficulty": 3,
        "requiredHarvestSeeds": 4,
        "persecutionThreshold": 4,
        "description": "A rugged Roman province beyond the Alps. High seed threshold, but rich in fellowship."
      }
    ],
    "additionalEvents": [
      {
        "id": "council-of-lyon",
        "title": "Decree of the Gallic Elders",
        "scriptureRef": "Acts 15:2",
        "flavour": "Local believers face dispute over table fellowship with Gentile seekers.",
        "choiceA": {
          "label": "Dispatch a conciliatory letter",
          "effect": "Reduce Global Persecution by 1, but all leaders gain +1 Heat."
        },
        "choiceB": {
          "label": "Stand firm in apostolic liberty",
          "effect": "Plant +2 Seeds in Gaul immediately, but increase Global Persecution by 1."
        }
      }
    ]
  }
}
```

---

## 4. Using the In-Game Package Manager

1. Launch **The Sovereign: Acts of the Apostles™**.
2. On the main setup screen or during gameplay, open the **Mod & Content Package Manager** via the top navigation bar or menu.
3. You will see all built-in sample mods (e.g., *Epistle Pioneers*, *Imperial Roman Theme*).
4. Click **"Import Package"**, paste your custom JSON payload, and click **Validate & Install**.
5. Toggle the mod **ON**. The apostle roster, world map, and event deck will immediately refresh to include your new content!

---

## 5. Modding Policy & Best Practices

Please respect our 3-point community agreement (see [MODDING-POLICY.md](./MODDING-POLICY.md)):

1. **You Own Your Creation**: You maintain credit and ownership for your original scenarios, character designs, and custom scripts.
2. **Non-Commercial / No Paywalls**: Mods must remain free to download and play (tips or Patreon donations are permitted, provided content is never locked behind a paywall).
3. **Collision Safety**: Always namespace your mod IDs (e.g., `com.username.modtitle`) to prevent collisions with official content or other community packages.

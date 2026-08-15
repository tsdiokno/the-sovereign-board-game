# The Sovereign: Acts of the Apostles™

> *"I planted, Apollos watered, but God gave the growth. So neither he who plants nor he who waters is anything, but only God who gives the growth."*  
> — **1 Corinthians 3:6–7**

**The Sovereign: Acts of the Apostles™** is a cooperative historical tabletop simulation set during the era of the Book of Acts. Players take on the roles of apostolic missionaries navigating the Roman Empire—planting churches, facing imperial persecution, resolving providential theological decrees, and confronting spiritual pride.

---

## 🎯 Quick Rules Summary

- **Players:** 2–6 Apostles in cooperative fellowship.
- **Goal:** Plant **5 permanent Churches (Harvests)** across Mediterranean provinces.
- **Persecution & Martyrdom:** When an Apostle's Heat reaches the Global Track, they are martyred (+3 Seeds) and roll the heavenly **Intercession Die** on subsequent turns.
- **The Final Gathering (*Casting Crowns*):** Upon 5 harvests, surviving leaders must cast **2 Crowns for every 1 Pride**. If they overcome pride, the table wins in *Soli Deo Gloria*! If all choke on pride, the table loses.

---

## 🏛️ Working Tree & Architecture

The project is built on the **Data-Driven Package Paradigm** (where the engine runtime is decoupled from content declarations):

```text
.
├── LICENSE.md                 # 🛡️ Code: GNU AGPLv3 + Commons Clause
├── LICENSE-ASSETS.txt         # 🎨 Art: Proprietary Copyright (Non-commercial play only)
├── MODDING-POLICY.md          # 🤝 Community: Modding EULA
├── src/
│   ├── config/
│   │   └── gameConfig.ts      # Central source of truth: Branding (™), epigraph, theme tokens
│   ├── modding/
│   │   ├── types.ts           # SovereignModManifest & ContentOverrides interfaces
│   │   ├── ModContext.tsx     # Reactive engine context merging active mod packages
│   │   └── sampleMods.ts      # Bundled community mods (Epistle Pioneers, Imperial Theme)
│   ├── types/
│   │   └── game.ts            # Domain interfaces (Player, Region, Chronicle, GameState)
│   ├── data/
│   │   ├── apostles.ts        # Official apostolic figures, abilities, and provinces
│   │   └── events.ts          # 10 Providential Decree event card definitions
│   ├── engine/
│   │   └── gameEngine.ts      # Headless functional engine (Dice, Harvests, Martyrdom, Endgame)
│   ├── components/
│   │   ├── setup/
│   │   │   └── SetupScreen.tsx    # Player selection & package roster preview
│   │   ├── board/
│   │   │   ├── BoardGrid.tsx      # Interactive province map
│   │   │   ├── RegionCard.tsx     # Region status, seeds, harvests, and locks
│   │   │   └── ApostleBadge.tsx   # Color-coded apostle tokens & status tags
│   │   ├── controls/
│   │   │   ├── ActionPanel.tsx    # Target region picker & dynamic die triggers
│   │   │   └── PlayerList.tsx     # Heat, Crowns, Pride monitors & danger alerts
│   │   ├── chronicle/
│   │   │   └── ChronicleLog.tsx   # Scrollable parchment ledger of Acts narrative
│   │   ├── modals/
│   │   │   ├── EventModal.tsx     # Interactive Providential Decree decisions
│   │   │   ├── EndgameModal.tsx   # The Final Gathering crown casting flow
│   │   │   ├── RulesModal.tsx     # In-game rulebook & lore guide
│   │   │   └── ModManagerModal.tsx# In-game Mod & Content Package Manager
│   │   └── layout/
│   │       └── TopBar.tsx         # Round counter, persecution gauge, and harvest tracker
│   ├── App.tsx                # Master coordinator wrapping ModProvider
│   ├── main.tsx               # React entry point
│   └── index.css              # Global Tailwind CSS styling
```

---

## 🛡️ Licensing

The project implements four layers:

| Layer | License | Implementation & Legal Effect |
| :--- | :--- | :--- |
| **1. Code** | **AGPLv3 + Commons Clause** | Open copyleft engine for transparency and study, with a complete legal ban on commercial resale, paid rehosting, or publishing on Steam/app stores without permission. ([LICENSE.md](./LICENSE.md)) |
| **2. Art & Lore** | **Proprietary Copyright** | Official portraits, card art, 3D assets, and narrative text are all rights reserved for non-commercial game play only. ([LICENSE-ASSETS.txt](./LICENSE-ASSETS.txt)) |
| **3. Brand** | **Common Law Trademark (™)** | **The Sovereign: Acts of the Apostles™** establishes immediate trademark notice against commercial clones or deceptive spin-offs. |
| **4. Community** | **Modding EULA** | Modders own their original scenarios; mods cannot be locked behind paywalls; public mods can be featured upstream. ([MODDING-POLICY.md](./MODDING-POLICY.md)) |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Lint codebase & type-check
npm run lint

# Build production bundle
npm run build
```

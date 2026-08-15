import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { DEFAULT_GAME_MANIFEST, DEFAULT_THEME, DEFAULT_ASSETS, GameManifest, ThemeTokens, GameAssetMap } from '../config/gameConfig';
import { APOSTLES, REGIONS } from '../data/apostles';
import { EVENTS } from '../data/events';
import { ApostleDefinition, RegionDefinition, EventCard } from '../types/game';
import { SovereignModPackage } from './types';
import { SAMPLE_COMMUNITY_MODS } from './sampleMods';

interface ModContextValue {
  manifest: GameManifest;
  theme: ThemeTokens;
  assets: GameAssetMap;
  apostles: ApostleDefinition[];
  regions: RegionDefinition[];
  events: EventCard[];
  installedMods: SovereignModPackage[];
  toggleMod: (modId: string) => void;
  installMod: (modJsonString: string) => { success: boolean; message: string };
  resetMods: () => void;
}

const ModContext = createContext<ModContextValue | null>(null);

export const ModProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [installedMods, setInstalledMods] = useState<SovereignModPackage[]>(SAMPLE_COMMUNITY_MODS);

  const toggleMod = (modId: string) => {
    setInstalledMods((prev) =>
      prev.map((mod) =>
        mod.manifest.id === modId
          ? {
              ...mod,
              manifest: { ...mod.manifest, enabled: !mod.manifest.enabled },
            }
          : mod
      )
    );
  };

  const resetMods = () => {
    setInstalledMods(
      SAMPLE_COMMUNITY_MODS.map((m) => ({
        ...m,
        manifest: { ...m.manifest, enabled: false },
      }))
    );
  };

  const installMod = (modJsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(modJsonString) as SovereignModPackage;
      if (!parsed.manifest || !parsed.manifest.id || !parsed.manifest.name) {
        return { success: false, message: 'Invalid Mod JSON: Missing manifest.id or manifest.name' };
      }
      parsed.manifest.enabled = true;
      setInstalledMods((prev) => {
        const filtered = prev.filter((m) => m.manifest.id !== parsed.manifest.id);
        return [parsed, ...filtered];
      });
      return { success: true, message: `Successfully installed "${parsed.manifest.name}"!` };
    } catch (e: any) {
      return { success: false, message: `JSON Parse Error: ${e.message}` };
    }
  };

  // Compute merged runtime data from active mods on top of default package
  const { manifest, theme, assets, apostles, regions, events } = useMemo(() => {
    let finalManifest = { ...DEFAULT_GAME_MANIFEST };
    let finalTheme = { ...DEFAULT_THEME };
    let finalAssets: GameAssetMap = {
      icons: { ...DEFAULT_ASSETS.icons },
      portraits: { ...DEFAULT_ASSETS.portraits },
      backgrounds: { ...DEFAULT_ASSETS.backgrounds },
    };

    let apostleList = [...APOSTLES];
    let regionList = [...REGIONS];
    let eventList = [...EVENTS];

    const activeMods = installedMods.filter((m) => m.manifest.enabled);

    for (const mod of activeMods) {
      // 1. Branding overrides
      if (mod.brandingOverrides) {
        finalManifest = { ...finalManifest, ...mod.brandingOverrides };
      }
      // 2. Theme overrides
      if (mod.themeOverrides) {
        finalTheme = { ...finalTheme, ...mod.themeOverrides };
      }
      // 3. Asset overrides
      if (mod.assetOverrides) {
        finalAssets = {
          icons: { ...finalAssets.icons, ...(mod.assetOverrides.icons || {}) },
          portraits: { ...finalAssets.portraits, ...(mod.assetOverrides.portraits || {}) },
          backgrounds: { ...finalAssets.backgrounds, ...(mod.assetOverrides.backgrounds || {}) },
        };
      }
      // 4. Content overrides (deduplicated by ID/name)
      if (mod.contentOverrides?.customApostles) {
        for (const ap of mod.contentOverrides.customApostles) {
          const idx = apostleList.findIndex((a) => a.name === ap.name);
          if (idx >= 0) {
            apostleList[idx] = ap;
          } else {
            apostleList.push(ap);
          }
        }
      }

      if (mod.contentOverrides?.customRegions) {
        for (const reg of mod.contentOverrides.customRegions) {
          const idx = regionList.findIndex((r) => r.id === reg.id);
          if (idx >= 0) {
            regionList[idx] = reg;
          } else {
            regionList.push(reg);
          }
        }
      }

      if (mod.contentOverrides?.customEvents) {
        for (const ev of mod.contentOverrides.customEvents) {
          const idx = eventList.findIndex((e) => e.id === ev.id);
          if (idx >= 0) {
            eventList[idx] = ev;
          } else {
            eventList.push(ev);
          }
        }
      }
    }

    return {
      manifest: finalManifest,
      theme: finalTheme,
      assets: finalAssets,
      apostles: apostleList,
      regions: regionList,
      events: eventList,
    };
  }, [installedMods]);

  return (
    <ModContext.Provider
      value={{
        manifest,
        theme,
        assets,
        apostles,
        regions,
        events,
        installedMods,
        toggleMod,
        installMod,
        resetMods,
      }}
    >
      {children}
    </ModContext.Provider>
  );
};

export function useGamePackage() {
  const ctx = useContext(ModContext);
  if (!ctx) {
    throw new Error('useGamePackage must be used within a ModProvider');
  }
  return ctx;
}

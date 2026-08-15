import { GameManifest, ThemeTokens, GameAssetMap } from '../config/gameConfig';
import { ApostleDefinition, RegionDefinition, EventCard } from '../types/game';

export interface SovereignModManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  isOfficial?: boolean;
  enabled?: boolean;
}

export interface ContentOverrides {
  customApostles?: ApostleDefinition[];
  customRegions?: RegionDefinition[];
  customEvents?: EventCard[];
  targetHarvestsOverride?: number;
  globalTrackStartOverride?: number;
}

export interface SovereignModPackage {
  manifest: SovereignModManifest;
  contentOverrides?: ContentOverrides;
  themeOverrides?: Partial<ThemeTokens>;
  assetOverrides?: Partial<GameAssetMap>;
  brandingOverrides?: Partial<GameManifest>;
}

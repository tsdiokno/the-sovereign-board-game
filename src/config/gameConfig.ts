export interface GameManifest {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  tagline: string;
  version: string;
  author: string;
  description: string;
  epigraph: {
    verse: string;
    text: string;
    reference: string;
  };
  legal: {
    copyrightNotice: string;
    licenseName: string;
    licenseUrl: string;
    moddingPolicyUrl: string;
  };
}

export interface ThemeTokens {
  id: string;
  name: string;
  primaryAccent: string;
  secondaryAccent: string;
  bgDark: string;
  cardBg: string;
  borderAccent: string;
  parchmentBg: string;
  parchmentText: string;
}

export interface GameAssetMap {
  icons: {
    seeds: string;
    harvest: string;
    crowns: string;
    pride: string;
    heat: string;
  };
  portraits: Record<string, string>;
  backgrounds: {
    boardTexture?: string;
    parchmentTexture?: string;
  };
}

export interface GamePackage {
  manifest: GameManifest;
  theme: ThemeTokens;
  assets: GameAssetMap;
}

export const DEFAULT_GAME_MANIFEST: GameManifest = {
  id: 'official.the-sovereign.acts-of-the-apostles',
  name: 'The Sovereign: Acts of the Apostles™',
  shortName: 'The Sovereign™',
  subtitle: 'Acts of the Apostles™',
  tagline: 'A cooperative historical tabletop simulation of apostolic mission, imperial persecution, providential decrees, and church planting.',
  version: '1.0.0',
  author: 'Sovereign Authors',
  description: 'Players take on the roles of apostolic missionaries navigating the Roman Empire—planting churches, facing imperial persecution, resolving providential theological decrees, and confronting spiritual pride.',
  epigraph: {
    verse: '1 Corinthians 3:6–7',
    text: 'I planted, Apollos watered, but God gave the growth. So neither he who plants nor he who waters is anything, but only God who gives the growth.',
    reference: '— 1 Corinthians 3:6–7',
  },
  legal: {
    copyrightNotice: 'Copyright (C) 2026 The Sovereign: Acts of the Apostles™ Authors. All rights reserved.',
    licenseName: 'GNU AGPLv3 + Commons Clause',
    licenseUrl: './LICENSE.md',
    moddingPolicyUrl: './MODDING-POLICY.md',
  },
};

export const DEFAULT_THEME: ThemeTokens = {
  id: 'theme.byzantine_gold',
  name: 'Byzantine Gold & Parchment',
  primaryAccent: '#f59e0b', // amber-500
  secondaryAccent: '#d97706', // amber-600
  bgDark: '#0c0a09', // stone-950
  cardBg: '#1c1917', // stone-900
  borderAccent: '#78350f', // amber-900
  parchmentBg: '#fef3c7', // amber-100
  parchmentText: '#451a03', // amber-950
};

export const DEFAULT_ASSETS: GameAssetMap = {
  icons: {
    seeds: '🌱',
    harvest: '🏛️',
    crowns: '👑',
    pride: '🦚',
    heat: '🔥',
  },
  portraits: {
    Paul: 'Pa',
    Peter: 'Pe',
    Thomas: 'Th',
    James: 'Ja',
    John: 'Jo',
    Andrew: 'An',
  },
  backgrounds: {},
};

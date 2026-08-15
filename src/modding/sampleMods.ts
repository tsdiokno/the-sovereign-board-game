import { SovereignModPackage } from './types';

export const SAMPLE_COMMUNITY_MODS: SovereignModPackage[] = [
  {
    manifest: {
      id: 'community.epistles-expansion',
      name: 'Epistle Pioneers Expansion',
      version: '1.1.0',
      author: 'Apostolic Modding Guild',
      description: 'Introduces Barnabas ("Son of Encouragement") and Silas ("The Hymnist") into the playable apostolic fellowship, plus the Illyricum frontier province.',
      enabled: false,
    },
    contentOverrides: {
      customApostles: [
        {
          name: 'Barnabas' as any,
          title: 'Son of Encouragement',
          icon: 'Ba',
          color: '#14b8a6', // teal-500
          borderClass: 'border-teal-500',
          bgClass: 'bg-teal-600',
          ability: 'Can sacrifice 1 Crown to remove 2 Pride from any fellow Apostle.',
          detailedAbility: 'Barnabas can encourage disheartened or proud brethren. Whenever a player gains Pride, Barnabas can spend a Crown to absorb and cleanse it.',
        },
        {
          name: 'Silas' as any,
          title: 'The Midnight Hymnist',
          icon: 'Si',
          color: '#ec4899', // pink-500
          borderClass: 'border-pink-500',
          bgClass: 'bg-pink-600',
          ability: 'While arrested, sings hymns to grant all stationed apostles +1 Seed.',
          detailedAbility: 'Silas turns imprisonment into revival. When rolling while arrested, earthquake deliverance triggers on a 4, 5, or 6.',
        },
      ],
      customRegions: [
        {
          id: 'illyricum' as any,
          name: 'Illyricum Frontier',
          desc: 'Remote mountain passes across the Adriatic. Yields +1 Crown upon initial planting.',
          threshold: 3,
        },
      ],
      customEvents: [
        {
          id: 'berean_examination',
          name: 'The Berean Examination',
          desc: 'The noble Bereans search the scriptures daily to verify the apostolic preaching.',
          mechanic: 'All living apostles examine their doctrine: Discard 1 Pride if you possess at least 1 Crown.',
        },
      ],
    },
  },
  {
    manifest: {
      id: 'community.theme-imperial-crimson',
      name: 'Imperial Rome Theme Pack',
      version: '1.0.0',
      author: 'Byzantine Design Studio',
      description: 'Overhauls the interface palette into imperial Roman crimson, tyrian purple, and marble accents.',
      enabled: false,
    },
    themeOverrides: {
      id: 'theme.imperial_crimson',
      name: 'Imperial Tyrian & Marble',
      primaryAccent: '#f43f5e', // rose-500
      secondaryAccent: '#e11d48', // rose-600
      borderAccent: '#881337', // rose-900
      bgDark: '#0f0508',
      cardBg: '#1f0d14',
    },
    brandingOverrides: {
      tagline: 'Imperial Rome Edition: Evangelizing through the Pax Romana under Nero and Claudius.',
    },
  },
];

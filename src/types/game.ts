export type ApostleId = 'Paul' | 'Peter' | 'Thomas' | 'James' | 'John' | 'Andrew';

export type RegionId = 'jerusalem' | 'antioch' | 'asia_minor' | 'greece' | 'rome' | 'ends_earth';

export interface ApostleDefinition {
  name: ApostleId;
  title: string;
  icon: string;
  color: string;
  borderClass: string;
  bgClass: string;
  ability: string;
  detailedAbility: string;
}

export interface RegionDefinition {
  id: RegionId;
  name: string;
  desc: string;
  threshold: number;
}

export interface RegionState extends RegionDefinition {
  seeds: number;
  harvests: number;
}

export interface Player {
  id: number;
  playerName: string;
  apostle: ApostleId;
  icon: string;
  color: string;
  ability: string;
  region: RegionId;
  heat: number;
  crowns: number;
  pride: number;
  isArrested: boolean;
  isMartyred: boolean;
  requiresRestoration: boolean;
}

export type ChronicleEntryType = 'narrative' | 'system' | 'event' | 'victory' | 'warning';

export interface ChronicleEntry {
  id: string;
  timestamp: string;
  text: string;
  type: ChronicleEntryType;
  mechanic?: string;
  round: number;
}

export interface EventCard {
  id: string;
  name: string;
  desc: string;
  mechanic: string;
}

export type GamePhase = 'setup' | 'playing' | 'event' | 'endgame';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  board: RegionState[];
  globalTrack: number; // 1 to 10
  churchHarvests: number;
  targetHarvests: number;
  currentPlayerIndex: number;
  roundNumber: number;
  lockedRegion: RegionId | null;
  currentEvent: EventCard | null;
  lastDiceRoll: {
    type: 'sovereign' | 'intercession';
    value: number;
    title: string;
    description: string;
  } | null;
  turnActionTaken: boolean;
  endgameQueue: Player[];
  endgameStatus: 'in_progress' | 'victory' | 'defeat' | null;
  endgameLogs: string[];
}

import { APOSTLES, REGIONS } from '../data/apostles';
import { EVENTS } from '../data/events';
import {
  ApostleDefinition,
  ApostleId,
  ChronicleEntry,
  ChronicleEntryType,
  EventCard,
  GameState,
  Player,
  RegionDefinition,
  RegionId,
  RegionState,
} from '../types/game';

export interface GameEngineOptions {
  apostles?: ApostleDefinition[];
  regions?: RegionDefinition[];
  events?: EventCard[];
  targetHarvests?: number;
  globalTrackStart?: number;
}

export function createInitialState(
  playerCount: number = 4,
  options?: GameEngineOptions
): GameState {
  const availableApostles = options?.apostles || APOSTLES;
  const availableRegions = options?.regions || REGIONS;

  const shuffledApostles = [...availableApostles].sort(() => 0.5 - Math.random());
  const players: Player[] = [];

  const startingRegionId = (availableRegions[0]?.id || 'jerusalem') as RegionId;

  for (let i = 0; i < playerCount; i++) {
    const ap = shuffledApostles[i % shuffledApostles.length];
    players.push({
      id: i,
      playerName: `Player ${i + 1}`,
      apostle: ap.name,
      icon: ap.icon,
      color: ap.color,
      ability: ap.ability,
      region: startingRegionId,
      heat: ap.name === 'James' ? 5 : 0,
      crowns: 0,
      pride: 0,
      isArrested: false,
      isMartyred: false,
      requiresRestoration: false,
    });
  }

  const board: RegionState[] = availableRegions.map((r) => ({
    ...r,
    seeds: 0,
    harvests: 0,
  }));

  return {
    phase: 'playing',
    players,
    board,
    globalTrack: options?.globalTrackStart ?? 10,
    churchHarvests: 0,
    targetHarvests: options?.targetHarvests ?? 5,
    currentPlayerIndex: 0,
    roundNumber: 1,
    lockedRegion: null,
    currentEvent: null,
    lastDiceRoll: null,
    turnActionTaken: false,
    endgameQueue: [],
    endgameStatus: null,
    endgameLogs: [],
  };
}

export function createInitialChronicle(): ChronicleEntry[] {
  return [
    {
      id: 'entry-init-1',
      timestamp: 'R1 Start',
      round: 1,
      type: 'narrative',
      text: '“In the first book, O Theophilus, I have dealt with all that Jesus began to do and teach...” — The mission commences across the Roman world.',
      mechanic: 'Harvest 5 churches to win. Cast crowns at the final gathering without choking on Pride.',
    },
  ];
}

export function getRegionName(id: RegionId, board?: RegionState[]): string {
  if (board) {
    const found = board.find((x) => x.id === id);
    if (found) return found.name;
  }
  const r = REGIONS.find((x) => x.id === id);
  return r ? r.name : id;
}

export function addSeedToRegion(
  board: RegionState[],
  regionId: RegionId,
  amount: number,
  lockedRegion: RegionId | null
): { newBoard: RegionState[]; added: boolean } {
  if (lockedRegion === regionId) {
    return { newBoard: board, added: false };
  }
  const newBoard = board.map((r) => {
    if (r.id === regionId) {
      return { ...r, seeds: r.seeds + amount };
    }
    return r;
  });
  return { newBoard, added: true };
}

export function rollSovereignDie(
  state: GameState,
  targetRegionId: RegionId,
  overrideDie?: number
): {
  nextState: GameState;
  newLogs: ChronicleEntry[];
} {
  const logs: ChronicleEntry[] = [];
  const player = state.players[state.currentPlayerIndex];
  const die = overrideDie ?? Math.floor(Math.random() * 6) + 1;

  let currentPlayers = state.players.map((p) => (p.id === player.id ? { ...p, region: targetRegionId } : p));
  let currentBoard = [...state.board];
  let globalTrack = state.globalTrack;

  let rollTitle = '';
  let rollDesc = '';

  const activePlayer = currentPlayers.find((p) => p.id === player.id)!;

  switch (die) {
    case 1: {
      rollTitle = '1: The Judas Factor';
      rollDesc = 'Betrayal! Authorities seize the Apostle. +Heat, Persecution escalates, and Arrest occurs.';
      let baseHeat = activePlayer.apostle === 'James' ? 2 : 1;
      if (targetRegionId === 'rome' || targetRegionId === 'jerusalem') {
        baseHeat += 1;
      }
      globalTrack = Math.max(1, globalTrack - 1);

      currentPlayers = currentPlayers.map((p) => {
        if (p.id === activePlayer.id) {
          return {
            ...p,
            heat: p.heat + baseHeat,
            isArrested: true,
          };
        }
        return p;
      });

      logs.push({
        id: `roll-${Date.now()}-1`,
        timestamp: `R${state.roundNumber}`,
        round: state.roundNumber,
        type: 'warning',
        text: `Betrayal! The local prefect seized ${activePlayer.apostle} in ${getRegionName(targetRegionId, currentBoard)}.`,
        mechanic: `[1: The Judas Factor] +${baseHeat} Heat, Global Persecution drops to ${globalTrack}. ${activePlayer.apostle} is Arrested.`,
      });
      break;
    }
    case 2: {
      rollTitle = '2: Stony Ground';
      rollDesc = 'The seed falls upon hard rocky soil and takes no root.';
      if (targetRegionId === 'greece') {
        currentPlayers = currentPlayers.map((p) =>
          p.id === activePlayer.id ? { ...p, pride: p.pride + 1 } : p
        );
        logs.push({
          id: `roll-${Date.now()}-2`,
          timestamp: `R${state.roundNumber}`,
          round: state.roundNumber,
          type: 'narrative',
          text: `The Athenian philosophers mocked ${activePlayer.apostle}'s message on the Areopagus.`,
          mechanic: `[2: Stony Ground] No seeds placed. Greece Regional Rule: Gained +1 Pride from the intellectual dispute.`,
        });
      } else {
        logs.push({
          id: `roll-${Date.now()}-2`,
          timestamp: `R${state.roundNumber}`,
          round: state.roundNumber,
          type: 'narrative',
          text: `The seed fell upon deaf ears in ${getRegionName(targetRegionId, currentBoard)}. The people turned away.`,
          mechanic: `[2: Stony Ground] Total failure. No seeds placed.`,
        });
      }
      break;
    }
    case 3: {
      rollTitle = '3: Thorns';
      rollDesc = 'The poisoned success. Seeds are planted, but worldly praise fosters pride.';
      const { newBoard, added } = addSeedToRegion(currentBoard, targetRegionId, 1, state.lockedRegion);
      currentBoard = newBoard;

      if (targetRegionId === 'antioch') {
        logs.push({
          id: `roll-${Date.now()}-3`,
          timestamp: `R${state.roundNumber}`,
          round: state.roundNumber,
          type: 'narrative',
          text: `${activePlayer.apostle} preached in Antioch with humility and grace.`,
          mechanic: `[3: Thorns] +1 Seed in Antioch. Antioch Regional Rule: Protected from Pride!`,
        });
      } else {
        let peterSkipped = false;
        currentPlayers = currentPlayers.map((p) => {
          if (p.id === activePlayer.id) {
            const nextP = { ...p, pride: p.pride + 1 };
            if (p.apostle === 'Peter') {
              nextP.requiresRestoration = true;
              peterSkipped = true;
            }
            return nextP;
          }
          return p;
        });

        logs.push({
          id: `roll-${Date.now()}-3`,
          timestamp: `R${state.roundNumber}`,
          round: state.roundNumber,
          type: 'narrative',
          text: `${activePlayer.apostle} saw converts, but public acclaim stirred dangerous pride.`,
          mechanic: `[3: Thorns] ${added ? '+1 Seed' : 'Seed blocked (locked)'}, +1 Pride gained.${peterSkipped ? " Peter's hypocrisy exposed: will skip next turn." : ''}`,
        });
      }
      break;
    }
    case 4: {
      rollTitle = '4: Providential Detour';
      rollDesc = 'The Holy Spirit forbids the intended course and redirects the journey.';
      const randomRegion = currentBoard[Math.floor(Math.random() * currentBoard.length)].id;

      currentPlayers = currentPlayers.map((p) =>
        p.id === activePlayer.id ? { ...p, region: randomRegion } : p
      );

      const { newBoard, added } = addSeedToRegion(currentBoard, randomRegion, 1, state.lockedRegion);
      currentBoard = newBoard;

      logs.push({
        id: `roll-${Date.now()}-4`,
        timestamp: `R${state.roundNumber}`,
        round: state.roundNumber,
        type: 'narrative',
        text: `The Spirit forbade ${activePlayer.apostle} from remaining in ${getRegionName(targetRegionId, currentBoard)}, redirecting them to ${getRegionName(randomRegion, currentBoard)}!`,
        mechanic: `[4: Providential Detour] Forcibly relocated to ${getRegionName(randomRegion, currentBoard)}. ${added ? '+1 Seed planted' : 'Planting blocked'}.`,
      });
      break;
    }
    case 5: {
      rollTitle = '5: Apollos Waters';
      rollDesc = 'Corporate grace. Strengthening the weakest frontier.';
      if (activePlayer.apostle === 'Thomas') {
        const { newBoard, added } = addSeedToRegion(currentBoard, targetRegionId, 1, state.lockedRegion);
        currentBoard = newBoard;
        logs.push({
          id: `roll-${Date.now()}-5`,
          timestamp: `R${state.roundNumber}`,
          round: state.roundNumber,
          type: 'narrative',
          text: `Thomas labored with steadfast focus on his own territory.`,
          mechanic: `[5: Apollos Waters] Thomas Passive Override: Placed +1 Seed locally in ${getRegionName(targetRegionId, currentBoard)}.`,
        });
      } else {
        const lowestRegion = [...currentBoard].sort((a, b) => a.seeds - b.seeds)[0];
        const seedAmount = activePlayer.apostle === 'Andrew' ? 2 : 1;
        const { newBoard, added } = addSeedToRegion(currentBoard, lowestRegion.id, seedAmount, state.lockedRegion);
        currentBoard = newBoard;

        logs.push({
          id: `roll-${Date.now()}-5`,
          timestamp: `R${state.roundNumber}`,
          round: state.roundNumber,
          type: 'narrative',
          text: `Another brother watered the field in ${lowestRegion.name}, sustaining the struggling church.`,
          mechanic: `[5: Apollos Waters] ${added ? `+${seedAmount} Seed(s)` : 'Seed blocked'} sent to weakest region (${lowestRegion.name}).${activePlayer.apostle === 'Andrew' ? " (Andrew's Bringer bonus applied)" : ''}`,
        });
      }
      break;
    }
    case 6: {
      rollTitle = '6: Irresistible Grace';
      rollDesc = 'Massive breakthrough! The Word multiplies rapidly with great power.';
      const { newBoard, added } = addSeedToRegion(currentBoard, targetRegionId, 2, state.lockedRegion);
      currentBoard = newBoard;

      logs.push({
        id: `roll-${Date.now()}-6`,
        timestamp: `R${state.roundNumber}`,
        round: state.roundNumber,
        type: 'narrative',
        text: `The Holy Spirit fell with tremendous power upon the people of ${getRegionName(targetRegionId, currentBoard)}!`,
        mechanic: `[6: Irresistible Grace] ${added ? '+2 Seeds planted locally' : 'Planting blocked by decree'}.`,
      });
      break;
    }
  }

  // Check Martyrdom & Harvests
  const checked = checkMartyrdomsAndHarvests({
    ...state,
    players: currentPlayers,
    board: currentBoard,
    globalTrack,
  });

  return {
    nextState: {
      ...checked.state,
      lastDiceRoll: {
        type: 'sovereign',
        value: die,
        title: rollTitle,
        description: rollDesc,
      },
      turnActionTaken: true,
    },
    newLogs: [...logs, ...checked.logs],
  };
}

export function rollIntercessionDie(
  state: GameState,
  overrideDie?: number
): {
  nextState: GameState;
  newLogs: ChronicleEntry[];
} {
  const logs: ChronicleEntry[] = [];
  const martyr = state.players[state.currentPlayerIndex];
  const die = overrideDie ?? Math.floor(Math.random() * 6) + 1;

  let currentPlayers = [...state.players];
  let currentBoard = [...state.board];
  let globalTrack = state.globalTrack;

  let rollTitle = '';
  let rollDesc = '';

  switch (die) {
    case 1: {
      rollTitle = '1: How Long, O Lord?';
      rollDesc = 'Judgment and wrath are delayed by heavenly petitions. Global Persecution Track +1 (safer).';
      globalTrack = Math.min(10, globalTrack + 1);
      logs.push({
        id: `intercession-${Date.now()}-1`,
        timestamp: `R${state.roundNumber}`,
        round: state.roundNumber,
        type: 'narrative',
        text: `“How long, O Lord, holy and true, dost thou not judge?” — Persecution recedes slightly.`,
        mechanic: `[1: How Long, O Lord?] Global Persecution Track increased to ${globalTrack}.`,
      });
      break;
    }
    case 2: {
      rollTitle = '2: Grace to Endure';
      rollDesc = 'Humility and endurance descend from on high. -1 Pride removed from the proudest living Apostle.';
      const livingPlayers = currentPlayers.filter((p) => !p.isMartyred && p.pride > 0);
      if (livingPlayers.length > 0) {
        const proudest = livingPlayers.reduce((prev, curr) => (curr.pride > prev.pride ? curr : prev));
        currentPlayers = currentPlayers.map((p) =>
          p.id === proudest.id ? { ...p, pride: Math.max(0, p.pride - 1) } : p
        );
        logs.push({
          id: `intercession-${Date.now()}-2`,
          timestamp: `R${state.roundNumber}`,
          round: state.roundNumber,
          type: 'narrative',
          text: `Heavenly grace humbles ${proudest.apostle}, freeing them from self-glory.`,
          mechanic: `[2: Grace to Endure] -1 Pride removed from ${proudest.apostle}.`,
        });
      } else {
        logs.push({
          id: `intercession-${Date.now()}-2`,
          timestamp: `R${state.roundNumber}`,
          round: state.roundNumber,
          type: 'system',
          text: `Prayers for humility rise up, but no brethren are currently afflicted by Pride.`,
          mechanic: `[2: Grace to Endure] Effect fizzled (no living players with Pride > 0).`,
        });
      }
      break;
    }
    case 3: {
      rollTitle = '3: The Blood Speaks';
      rollDesc = 'The blood of the martyr is the seed of the Church. +1 Seed placed in the martyr\'s resting region.';
      const { newBoard, added } = addSeedToRegion(currentBoard, martyr.region, 1, state.lockedRegion);
      currentBoard = newBoard;
      logs.push({
        id: `intercession-${Date.now()}-3`,
        timestamp: `R${state.roundNumber}`,
        round: state.roundNumber,
        type: 'narrative',
        text: `The testimony of ${martyr.apostle}'s martyrdom sparks bold new faith in ${getRegionName(martyr.region, currentBoard)}.`,
        mechanic: `[3: The Blood Speaks] ${added ? `+1 Seed placed in ${getRegionName(martyr.region, currentBoard)}` : 'Seed blocked'}.`,
      });
      break;
    }
    case 4: {
      rollTitle = '4: Angelic Deliverance';
      rollDesc = 'An angel of the Lord opens prison gates! One arrested brother is instantly freed.';
      const arrestedPlayer = currentPlayers.find((p) => p.isArrested && !p.isMartyred);
      if (arrestedPlayer) {
        currentPlayers = currentPlayers.map((p) =>
          p.id === arrestedPlayer.id ? { ...p, isArrested: false } : p
        );
        logs.push({
          id: `intercession-${Date.now()}-4`,
          timestamp: `R${state.roundNumber}`,
          round: state.roundNumber,
          type: 'narrative',
          text: `An angel of the Lord struck off the chains of ${arrestedPlayer.apostle} in the dead of night!`,
          mechanic: `[4: Angelic Deliverance] ${arrestedPlayer.apostle} is freed from prison.`,
        });
      } else {
        logs.push({
          id: `intercession-${Date.now()}-4`,
          timestamp: `R${state.roundNumber}`,
          round: state.roundNumber,
          type: 'system',
          text: `An angelic presence fills the city gates, but none of the brethren are currently in chains.`,
          mechanic: `[4: Angelic Deliverance] No effect (no living players currently arrested).`,
        });
      }
      break;
    }
    case 5:
    case 6: {
      rollTitle = '5/6: Holy Boldness';
      rollDesc = 'Boldness floods the mother church. +1 Seed placed directly in Jerusalem.';
      const firstRegionId = (currentBoard[0]?.id || 'jerusalem') as RegionId;
      const { newBoard, added } = addSeedToRegion(currentBoard, firstRegionId, 1, state.lockedRegion);
      currentBoard = newBoard;
      logs.push({
        id: `intercession-${Date.now()}-5`,
        timestamp: `R${state.roundNumber}`,
        round: state.roundNumber,
        type: 'narrative',
        text: `A mighty rushing wind of boldness sweeps across the believers in ${getRegionName(firstRegionId, currentBoard)}!`,
        mechanic: `[5/6: Holy Boldness] ${added ? `+1 Seed planted in ${getRegionName(firstRegionId, currentBoard)}` : 'Seed blocked'}.`,
      });
      break;
    }
  }

  const checked = checkMartyrdomsAndHarvests({
    ...state,
    players: currentPlayers,
    board: currentBoard,
    globalTrack,
  });

  return {
    nextState: {
      ...checked.state,
      lastDiceRoll: {
        type: 'intercession',
        value: die,
        title: rollTitle,
        description: rollDesc,
      },
      turnActionTaken: true,
    },
    newLogs: [...logs, ...checked.logs],
  };
}

export function checkMartyrdomsAndHarvests(state: GameState): {
  state: GameState;
  logs: ChronicleEntry[];
} {
  const logs: ChronicleEntry[] = [];
  let players = [...state.players];
  let board = [...state.board];
  let churchHarvests = state.churchHarvests;

  // 1. Check Martyrdoms
  players = players.map((p) => {
    if (p.isMartyred || p.apostle === 'John') {
      return p;
    }
    if (p.heat >= state.globalTrack) {
      logs.push({
        id: `martyr-${p.id}-${Date.now()}`,
        timestamp: `R${state.roundNumber}`,
        round: state.roundNumber,
        type: 'warning',
        text: `MARTYRDOM! ${p.apostle} poured out their life as a drink offering in ${getRegionName(p.region, board)}.`,
        mechanic: `Heat (${p.heat}) reached Global Persecution threshold (${state.globalTrack}). +3 Seeds placed in ${getRegionName(p.region, board)}.`,
      });

      // +3 Seeds to martyr's region
      const { newBoard } = addSeedToRegion(board, p.region, 3, state.lockedRegion);
      board = newBoard;

      return {
        ...p,
        isMartyred: true,
        isArrested: false,
      };
    }
    return p;
  });

  // 2. Check Harvests
  board = board.map((r) => {
    let thresh = r.threshold;
    const peterPresent = players.some(
      (p) => p.apostle === 'Peter' && p.region === r.id && !p.isMartyred && !p.isArrested
    );
    if (peterPresent) {
      thresh = 2;
    }

    if (r.seeds >= thresh) {
      const crownsToAdd = r.id === 'rome' ? 2 : 1;

      churchHarvests += 1;

      logs.push({
        id: `harvest-${r.id}-${Date.now()}`,
        timestamp: `R${state.roundNumber}`,
        round: state.roundNumber,
        type: 'victory',
        text: `GREAT HARVEST IN ${r.name.toUpperCase()}! A church is permanently planted for the Lord.`,
        mechanic: `Seeds met threshold (${thresh}). Harvest count: ${churchHarvests}/${state.targetHarvests}. Stationed apostles gain +${crownsToAdd} Crown(s).`,
      });

      players = players.map((p) => {
        if (p.region === r.id && !p.isMartyred) {
          return { ...p, crowns: p.crowns + crownsToAdd };
        }
        return p;
      });

      return {
        ...r,
        seeds: 0,
        harvests: r.harvests + 1,
      };
    }
    return r;
  });

  let phase = state.phase;
  let endgameQueue = state.endgameQueue;
  let endgameStatus = state.endgameStatus;

  if (churchHarvests >= state.targetHarvests && phase !== 'endgame') {
    phase = 'endgame';
    endgameQueue = [...players].filter((p) => !p.isMartyred).sort((a, b) => b.crowns - a.crowns);
    endgameStatus = 'in_progress';
  }

  return {
    state: {
      ...state,
      players,
      board,
      churchHarvests,
      phase,
      endgameQueue,
      endgameStatus,
    },
    logs,
  };
}

export function advanceTurn(
  state: GameState,
  eventsList: EventCard[] = EVENTS
): {
  nextState: GameState;
  newLogs: ChronicleEntry[];
} {
  const logs: ChronicleEntry[] = [];
  const nextPlayerIndex = state.currentPlayerIndex + 1;

  if (nextPlayerIndex >= state.players.length) {
    // Round finished -> draw interactive Decree Event
    const list = eventsList.length > 0 ? eventsList : EVENTS;
    const randomEvent = list[Math.floor(Math.random() * list.length)];
    logs.push({
      id: `round-end-${state.roundNumber}`,
      timestamp: `End of R${state.roundNumber}`,
      round: state.roundNumber,
      type: 'event',
      text: `A Providential Decree falls upon the Church: “${randomEvent.name}”.`,
      mechanic: randomEvent.mechanic,
    });

    return {
      nextState: {
        ...state,
        currentPlayerIndex: 0,
        roundNumber: state.roundNumber + 1,
        lockedRegion: null,
        currentEvent: randomEvent,
        phase: 'event',
        turnActionTaken: false,
        lastDiceRoll: null,
      },
      newLogs: logs,
    };
  }

  return {
    nextState: {
      ...state,
      currentPlayerIndex: nextPlayerIndex,
      turnActionTaken: false,
      lastDiceRoll: null,
    },
    newLogs: logs,
  };
}

export function resolveEndgameProcess(
  state: GameState
): {
  nextState: GameState;
  logMessage: string;
} {
  const queue = [...state.endgameQueue];

  if (queue.length === 0) {
    const allMartyred = state.players.every((p) => p.isMartyred);
    if (allMartyred) {
      return {
        nextState: {
          ...state,
          endgameStatus: 'victory',
          endgameLogs: [
            ...state.endgameLogs,
            'All apostles were martyred in holy fidelity. The Church triumphs in Soli Deo Gloria!',
          ],
        },
        logMessage: 'Victory: All apostles martyred in faithfulness.',
      };
    }

    return {
      nextState: {
        ...state,
        endgameStatus: 'defeat',
        endgameLogs: [
          ...state.endgameLogs,
          'TOTAL DEPRAVITY: Every surviving apostle choked on their accumulated Pride. The table loses.',
        ],
      },
      logMessage: 'Defeat: All living apostles choked on Pride.',
    };
  }

  const currentApostle = queue[0];
  const requiredCrowns = currentApostle.pride * 2;

  if (currentApostle.crowns >= requiredCrowns) {
    return {
      nextState: {
        ...state,
        endgameStatus: 'victory',
        endgameLogs: [
          ...state.endgameLogs,
          `SOLI DEO GLORIA! ${currentApostle.apostle} successfully discarded ${requiredCrowns} Crowns to overcome Pride (${currentApostle.pride})! The table wins!`,
        ],
      },
      logMessage: `Victory: ${currentApostle.apostle} successfully cast crowns!`,
    };
  } else {
    queue.shift();
    return {
      nextState: {
        ...state,
        endgameQueue: queue,
        endgameLogs: [
          ...state.endgameLogs,
          `${currentApostle.apostle} choked on their Pride (Had ${currentApostle.crowns} Crowns, needed ${requiredCrowns}). The burden passes to the next brother...`,
        ],
      },
      logMessage: `${currentApostle.apostle} failed to cast crowns. Burden passes.`,
    };
  }
}

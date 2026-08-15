import React, { useState, useEffect } from 'react';
import { ChronicleEntry, GameState, RegionId } from './types/game';
import {
  advanceTurn,
  createInitialChronicle,
  createInitialState,
  rollIntercessionDie,
  rollSovereignDie,
} from './engine/gameEngine';
import { TopBar } from './components/layout/TopBar';
import { BoardGrid } from './components/board/BoardGrid';
import { PlayerList } from './components/controls/PlayerList';
import { ActionPanel } from './components/controls/ActionPanel';
import { ChronicleLog } from './components/chronicle/ChronicleLog';
import { EventModal } from './components/modals/EventModal';
import { EndgameModal } from './components/modals/EndgameModal';
import { RulesModal } from './components/modals/RulesModal';
import { ModManagerModal } from './components/modals/ModManagerModal';
import { SetupScreen } from './components/setup/SetupScreen';
import { ModProvider, useGamePackage } from './modding/ModContext';

function GameApp() {
  const { apostles, regions, events, manifest } = useGamePackage();
  const [isSetup, setIsSetup] = useState(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isModsOpen, setIsModsOpen] = useState(false);
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState(4, { apostles, regions, events })
  );
  const [chronicle, setChronicle] = useState<ChronicleEntry[]>(() => createInitialChronicle());
  const [selectedTargetRegion, setSelectedTargetRegion] = useState<RegionId>(() =>
    (regions[0]?.id || 'jerusalem') as RegionId
  );

  const activePlayer = gameState.players[gameState.currentPlayerIndex];

  // Synchronize target region when active player changes
  useEffect(() => {
    if (activePlayer && !gameState.turnActionTaken) {
      setSelectedTargetRegion(activePlayer.region);
    }
  }, [gameState.currentPlayerIndex, activePlayer?.id, gameState.turnActionTaken]);

  const handleStartGame = (playerCount: number) => {
    const freshState = createInitialState(playerCount, { apostles, regions, events });
    setGameState(freshState);
    setChronicle(createInitialChronicle());
    setSelectedTargetRegion((regions[0]?.id || 'jerusalem') as RegionId);
    setIsSetup(false);
  };

  const handleRestart = () => {
    setIsSetup(true);
  };

  const handleRollSovereign = () => {
    const { nextState, newLogs } = rollSovereignDie(gameState, selectedTargetRegion);
    setGameState(nextState);
    setChronicle((prev) => [...newLogs, ...prev]);
  };

  const handleRollIntercession = () => {
    const { nextState, newLogs } = rollIntercessionDie(gameState);
    setGameState(nextState);
    setChronicle((prev) => [...newLogs, ...prev]);
  };

  const handleEndTurn = () => {
    // If active player was skipping due to arrest or restoration, clear those flags
    let updatedPlayers = gameState.players;
    if (activePlayer) {
      updatedPlayers = gameState.players.map((p) => {
        if (p.id === activePlayer.id) {
          return {
            ...p,
            isArrested: p.apostle === 'Paul' ? p.isArrested : false,
            requiresRestoration: false,
          };
        }
        return p;
      });
    }

    const stateWithClearedFlags = {
      ...gameState,
      players: updatedPlayers,
    };

    const { nextState, newLogs } = advanceTurn(stateWithClearedFlags, events);
    setGameState(nextState);
    if (newLogs.length > 0) {
      setChronicle((prev) => [...newLogs, ...prev]);
    }
  };

  const handleResolveEvent = (nextState: GameState, logs: ChronicleEntry[]) => {
    setGameState(nextState);
    setChronicle((prev) => [...logs, ...prev]);
  };

  if (isSetup) {
    return (
      <>
        <SetupScreen
          onStartGame={handleStartGame}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenMods={() => setIsModsOpen(true)}
        />
        <RulesModal
          isOpen={isRulesOpen}
          onClose={() => setIsRulesOpen(false)}
        />
        <ModManagerModal
          isOpen={isModsOpen}
          onClose={() => setIsModsOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-stone-950 text-stone-100 p-3 sm:p-4 gap-3 overflow-hidden font-sans select-none">
      {/* Top Bar Trackers & Nav */}
      <TopBar
        roundNumber={gameState.roundNumber}
        globalTrack={gameState.globalTrack}
        churchHarvests={gameState.churchHarvests}
        targetHarvests={gameState.targetHarvests}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenMods={() => setIsModsOpen(true)}
        onRestart={handleRestart}
      />

      {/* Main Content Layout: 3 Columns on Large Screens */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* Left / Center Column: Province Map & Board (5 cols) */}
        <section className="lg:col-span-5 h-full overflow-hidden flex flex-col rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <BoardGrid
            board={gameState.board}
            players={gameState.players}
            lockedRegion={gameState.lockedRegion}
            selectedTargetRegion={selectedTargetRegion}
            onSelectRegion={(reg) => {
              if (!gameState.turnActionTaken && !activePlayer?.isMartyred) {
                setSelectedTargetRegion(reg);
              }
            }}
          />
        </section>

        {/* Center / Controls Column: Active Player Actions & Roster (3 cols) */}
        <section className="lg:col-span-3 h-full overflow-y-auto flex flex-col gap-3 pr-1">
          <ActionPanel
            gameState={gameState}
            selectedRegion={selectedTargetRegion}
            onSelectRegion={setSelectedTargetRegion}
            onRollSovereign={handleRollSovereign}
            onRollIntercession={handleRollIntercession}
            onEndTurn={handleEndTurn}
          />

          <div className="flex-1 flex flex-col rounded-xl border border-stone-800 bg-stone-900/60 p-3 min-h-[220px] overflow-hidden">
            <h4 className="font-serif text-sm font-bold text-amber-300 mb-2 flex items-center justify-between">
              <span>The Apostolic Fellowship</span>
              <span className="text-[11px] font-sans font-normal text-stone-400">
                {gameState.players.length} Missionaries
              </span>
            </h4>
            <PlayerList
              players={gameState.players}
              currentPlayerIndex={gameState.currentPlayerIndex}
              globalTrack={gameState.globalTrack}
            />
          </div>
        </section>

        {/* Right Column: Luke's Chronicle Parchment (4 cols) */}
        <section className="lg:col-span-4 h-full overflow-hidden flex flex-col">
          <ChronicleLog entries={chronicle} />
        </section>
      </main>

      {/* Interactive Decree Event Modal */}
      <EventModal
        isOpen={gameState.phase === 'event'}
        event={gameState.currentEvent}
        gameState={gameState}
        onResolve={handleResolveEvent}
      />

      {/* The Final Gathering / Endgame Modal */}
      <EndgameModal
        isOpen={gameState.phase === 'endgame'}
        gameState={gameState}
        onUpdateState={setGameState}
        onRestart={handleRestart}
      />

      {/* Comprehensive Rulebook Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Mod and Content Package Manager Modal */}
      <ModManagerModal
        isOpen={isModsOpen}
        onClose={() => setIsModsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ModProvider>
      <GameApp />
    </ModProvider>
  );
}

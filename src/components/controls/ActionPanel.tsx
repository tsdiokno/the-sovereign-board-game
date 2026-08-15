import React from 'react';
import { GameState, RegionId } from '../../types/game';
import { REGIONS } from '../../data/apostles';
import { Dices, Sparkles, Shield, ArrowRight, Compass, HeartHandshake } from 'lucide-react';
import { ApostleBadge } from '../board/ApostleBadge';

interface ActionPanelProps {
  gameState: GameState;
  selectedRegion: RegionId;
  onSelectRegion: (regionId: RegionId) => void;
  onRollSovereign: () => void;
  onRollIntercession: () => void;
  onEndTurn: () => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  gameState,
  selectedRegion,
  onSelectRegion,
  onRollSovereign,
  onRollIntercession,
  onEndTurn,
}) => {
  const activePlayer = gameState.players[gameState.currentPlayerIndex];
  if (!activePlayer) return null;

  const isMartyred = activePlayer.isMartyred;
  const isArrested = activePlayer.isArrested && activePlayer.apostle !== 'Paul';
  const isResting = activePlayer.requiresRestoration;
  const actionTaken = gameState.turnActionTaken;

  // If player is arrested (and not Paul) or resting, they cannot roll this turn
  const mustSkipTurn = (isArrested || isResting) && !actionTaken;

  return (
    <div id="action-panel-container" className="flex flex-col rounded-xl border border-stone-800 bg-stone-900/90 p-4 shadow-lg">
      {/* Active Player Card Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <ApostleBadge player={activePlayer} size="md" showStatus />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                Current Turn
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-100">
              {activePlayer.playerName} ({activePlayer.apostle})
            </h3>
          </div>
        </div>
      </div>

      {/* Action Workflow Controls */}
      <div className="flex flex-col gap-3">
        {/* Turn State Banner */}
        {isMartyred ? (
          <div className="rounded-lg border border-rose-900/60 bg-rose-950/30 p-3 text-xs text-rose-200">
            <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-1">
              <HeartHandshake className="w-4 h-4 text-rose-400" />
              <span>The Altar of Heaven</span>
            </div>
            <p className="leading-relaxed">
              {activePlayer.apostle} has been martyred. Roll the <strong>Intercession Die</strong> to plead for the surviving brethren, break prison chains, or place heavenly seed.
            </p>
          </div>
        ) : isArrested ? (
          <div className="rounded-lg border border-amber-900/60 bg-amber-950/30 p-3 text-xs text-amber-200">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Bound in Chains</span>
            </div>
            <p className="leading-relaxed">
              {activePlayer.apostle} sits imprisoned in {selectedRegion.toUpperCase()}. Turn is spent awaiting deliverance. Click &quot;End Turn&quot; to advance.
            </p>
          </div>
        ) : isResting ? (
          <div className="rounded-lg border border-blue-900/60 bg-blue-950/30 p-3 text-xs text-blue-200">
            <div className="flex items-center gap-1.5 font-bold text-blue-300 mb-1">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Sabbatical & Restoration</span>
            </div>
            <p className="leading-relaxed">
              {activePlayer.apostle} is recovering from spiritual exhaustion or pride. Turn is spent resting. Click &quot;End Turn&quot; to advance.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-300">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Mission Province:</span>
            </label>
            <select
              id="region-select-input"
              value={selectedRegion}
              disabled={actionTaken}
              onChange={(e) => onSelectRegion(e.target.value as RegionId)}
              className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-stone-100 focus:border-amber-400 focus:outline-none disabled:opacity-50"
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (Req: {r.threshold} seeds) {gameState.lockedRegion === r.id ? '🔒 [LOCKED]' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          {!actionTaken && !mustSkipTurn && (
            <>
              {!isMartyred ? (
                <button
                  id="btn-roll-sovereign"
                  onClick={onRollSovereign}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-bold text-stone-950 shadow-md transition-all hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  <Dices className="w-4 h-4" />
                  <span>Roll Sovereign Die</span>
                </button>
              ) : (
                <button
                  id="btn-roll-intercession"
                  onClick={onRollIntercession}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Roll Intercession Die</span>
                </button>
              )}
            </>
          )}

          {(actionTaken || mustSkipTurn) && (
            <button
              id="btn-end-turn"
              onClick={onEndTurn}
              className="flex items-center justify-center gap-2 rounded-lg bg-stone-800 px-4 py-2.5 text-sm font-bold text-stone-100 transition-all hover:bg-stone-700 active:scale-95 border border-stone-700 cursor-pointer"
            >
              <span>End Turn & Pass</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>

        {/* Last Dice Roll Outcome Card */}
        {gameState.lastDiceRoll && (
          <div className="mt-2 rounded-lg border border-amber-500/30 bg-stone-950/80 p-3 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500/20 font-mono text-xs font-bold text-amber-300 border border-amber-500/40">
                {gameState.lastDiceRoll.value}
              </span>
              <span>{gameState.lastDiceRoll.title}</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {gameState.lastDiceRoll.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

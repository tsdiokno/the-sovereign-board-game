import React from 'react';
import { Player } from '../../types/game';
import { ApostleBadge } from '../board/ApostleBadge';
import { Flame, Crown, AlertTriangle, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  currentPlayerIndex: number;
  globalTrack: number;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  currentPlayerIndex,
  globalTrack,
}) => {
  return (
    <div id="player-list-container" className="flex flex-col gap-2.5 overflow-y-auto">
      {players.map((p, idx) => {
        const isActive = idx === currentPlayerIndex;
        const requiredCrownsForPride = p.pride * 2;
        const hasPrideRisk = p.pride > 0 && p.crowns < requiredCrownsForPride;

        return (
          <div
            key={p.id}
            id={`player-card-${p.id}`}
            className={`rounded-xl border p-3 transition-all duration-200 ${
              isActive
                ? 'border-amber-400/80 bg-stone-900 shadow-md ring-1 ring-amber-400/30'
                : p.isMartyred
                ? 'border-rose-950/60 bg-stone-950/80 opacity-80'
                : 'border-stone-800 bg-stone-900/60'
            }`}
          >
            {/* Header with name and status badge */}
            <div className="flex items-center justify-between gap-2 border-b border-stone-800/80 pb-2 mb-2">
              <div className="flex items-center gap-2.5">
                <ApostleBadge player={p} size="sm" showStatus />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-sm text-stone-100">
                      {p.playerName}
                    </span>
                    <span className="text-xs text-amber-300/90 font-medium">
                      ({p.apostle})
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400 leading-tight">
                    {p.ability}
                  </div>
                </div>
              </div>

              {/* Status Pills */}
              <div>
                {p.isMartyred ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-950 px-2 py-0.5 text-[11px] font-bold text-rose-300 border border-rose-800">
                    Martyred ✝
                  </span>
                ) : p.isArrested ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-950 px-2 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-800">
                    Chains ⛓
                  </span>
                ) : p.requiresRestoration ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-950 px-2 py-0.5 text-[11px] font-bold text-blue-300 border border-blue-800">
                    Resting 💤
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-900">
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Stat Counters: Heat, Crowns, Pride */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {/* Heat */}
              <div
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg border ${
                  p.heat >= globalTrack - 1 && !p.isMartyred && p.apostle !== 'John'
                    ? 'border-rose-700/80 bg-rose-950/40 text-rose-300 font-bold animate-pulse'
                    : 'border-stone-800/80 bg-stone-950/50 text-stone-300'
                }`}
                title={`Heat: ${p.heat}/${globalTrack}. If Heat >= ${globalTrack}, martyrdom occurs.`}
              >
                <div className="flex items-center gap-1 text-[10px] text-stone-400">
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>Heat</span>
                </div>
                <span className="font-mono text-sm font-bold text-rose-400">
                  {p.heat} <span className="text-[10px] text-stone-400">/ {globalTrack}</span>
                </span>
              </div>

              {/* Crowns */}
              <div
                className="flex flex-col items-center justify-center p-1.5 rounded-lg border border-stone-800/80 bg-stone-950/50 text-stone-300"
                title={`Crowns: ${p.crowns}. Discarded at endgame to cover Pride.`}
              >
                <div className="flex items-center gap-1 text-[10px] text-stone-400">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>Crowns</span>
                </div>
                <span className="font-mono text-sm font-bold text-amber-300">
                  {p.crowns}
                </span>
              </div>

              {/* Pride */}
              <div
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg border ${
                  hasPrideRisk
                    ? 'border-purple-800/80 bg-purple-950/40 text-purple-300'
                    : 'border-stone-800/80 bg-stone-950/50 text-stone-300'
                }`}
                title={`Pride: ${p.pride}. Requires ${requiredCrownsForPride} Crowns to safely cast at the endgame.`}
              >
                <div className="flex items-center gap-1 text-[10px] text-stone-400">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Pride</span>
                </div>
                <span className="font-mono text-sm font-bold text-purple-300">
                  {p.pride}
                </span>
              </div>
            </div>

            {/* Pride danger warning */}
            {hasPrideRisk && !p.isMartyred && (
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-purple-300 bg-purple-950/30 px-2 py-0.5 rounded border border-purple-900/60">
                <AlertTriangle className="w-3 h-3 text-purple-400 shrink-0" />
                <span>Needs {requiredCrownsForPride - p.crowns} more Crown(s) to survive Final Gathering</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

import React from 'react';
import { Player, RegionId, RegionState } from '../../types/game';
import { ApostleBadge } from './ApostleBadge';
import { Lock, Sparkles, Sprout, Landmark } from 'lucide-react';

interface RegionCardProps {
  region: RegionState;
  isLocked: boolean;
  stationedPlayers: Player[];
  isSelectedTarget?: boolean;
  onSelect?: () => void;
}

export const RegionCard: React.FC<RegionCardProps> = ({
  region,
  isLocked,
  stationedPlayers,
  isSelectedTarget = false,
  onSelect,
}) => {
  const hasPeter = stationedPlayers.some((p) => p.apostle === 'Peter' && !p.isMartyred && !p.isArrested);
  const effectiveThreshold = hasPeter ? 2 : region.threshold;

  return (
    <div
      id={`region-card-${region.id}`}
      onClick={onSelect}
      className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
        isLocked
          ? 'border-rose-800 bg-stone-900/80 opacity-75'
          : isSelectedTarget
          ? 'border-amber-400 bg-stone-900 ring-2 ring-amber-400/40 shadow-lg shadow-amber-950/20'
          : 'border-stone-800 bg-stone-900/90 hover:border-stone-700'
      } ${onSelect ? 'cursor-pointer' : ''}`}
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-lg font-bold text-amber-300">
              {region.name}
            </h4>
            {isLocked && (
              <span className="flex items-center gap-1 rounded bg-rose-950/80 px-1.5 py-0.5 text-xs font-semibold text-rose-300 border border-rose-800">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
                hasPeter
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-stone-800 text-stone-300'
              }`}
              title={hasPeter ? "Peter's Rock ability: Harvest threshold reduced to 2!" : undefined}
            >
              Req: {effectiveThreshold} Seeds
              {hasPeter && <Sparkles className="w-3 h-3 text-emerald-400" />}
            </span>
          </div>
        </div>

        {/* Description / Rules */}
        <p className="mt-2 text-xs text-stone-400 leading-relaxed italic min-h-[32px]">
          {region.desc}
        </p>
      </div>

      {/* Stats & Tokens */}
      <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-col gap-2">
        {/* Seeds and Harvests status */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium text-stone-300">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>Seeds:</span>
            <span className="font-mono text-sm font-bold text-emerald-400">
              {region.seeds} / {effectiveThreshold}
            </span>
          </div>

          <div className="flex items-center gap-1 text-stone-400">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Churches:</span>
            <span className="font-mono font-semibold text-amber-300">{region.harvests}</span>
          </div>
        </div>

        {/* Visual Seed Progress Bar */}
        <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-600 to-amber-400 h-full transition-all duration-300"
            style={{
              width: `${Math.min(100, (region.seeds / effectiveThreshold) * 100)}%`,
            }}
          />
        </div>

        {/* Stationed Apostles */}
        <div className="min-h-[34px] pt-1">
          <div className="text-[11px] font-medium text-stone-400 mb-1">
            Stationed Apostles ({stationedPlayers.length}):
          </div>
          {stationedPlayers.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 items-center">
              {stationedPlayers.map((p) => (
                <ApostleBadge key={p.id} player={p} size="sm" showStatus />
              ))}
            </div>
          ) : (
            <div className="text-xs text-stone-400 italic">None stationed</div>
          )}
        </div>
      </div>
    </div>
  );
};

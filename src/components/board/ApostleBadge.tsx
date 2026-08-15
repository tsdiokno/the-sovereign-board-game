import React from 'react';
import { Player } from '../../types/game';

interface ApostleBadgeProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

export const ApostleBadge: React.FC<ApostleBadgeProps> = ({
  player,
  size = 'md',
  showStatus = false,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }[size];

  return (
    <div className="relative inline-flex items-center justify-center group" title={`${player.playerName} (${player.apostle})`}>
      <div
        id={`apostle-badge-${player.id}`}
        className={`${sizeClasses} rounded-full font-bold flex items-center justify-center text-white border-2 border-stone-900 shadow-md transition-transform group-hover:scale-110`}
        style={{ backgroundColor: player.color }}
      >
        {player.icon}
      </div>

      {showStatus && (
        <>
          {player.isMartyred && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-600 text-[9px] text-white ring-1 ring-stone-900 font-bold" title="Martyred">
              ✝
            </span>
          )}
          {!player.isMartyred && player.isArrested && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[9px] text-stone-950 ring-1 ring-stone-900 font-bold" title="Arrested">
              ⛓
            </span>
          )}
          {!player.isMartyred && player.requiresRestoration && (
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[9px] text-white ring-1 ring-stone-900 font-bold" title="Resting / Needs Restoration">
              💤
            </span>
          )}
        </>
      )}
    </div>
  );
};

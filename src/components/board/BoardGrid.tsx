import React from 'react';
import { Player, RegionId, RegionState } from '../../types/game';
import { RegionCard } from './RegionCard';

interface BoardGridProps {
  board: RegionState[];
  players: Player[];
  lockedRegion: RegionId | null;
  selectedTargetRegion?: RegionId;
  onSelectRegion?: (regionId: RegionId) => void;
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  board,
  players,
  lockedRegion,
  selectedTargetRegion,
  onSelectRegion,
}) => {
  return (
    <div id="board-grid-container" className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif text-lg font-bold text-amber-200">
          The Mediterranean Provinces
        </h3>
        <span className="text-xs text-stone-400">
          Plant seeds to trigger harvests across the empire
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pr-1">
        {board.map((region) => {
          const stationed = players.filter((p) => p.region === region.id && !p.isMartyred);
          const isLocked = lockedRegion === region.id;
          const isSelected = selectedTargetRegion === region.id;

          return (
            <RegionCard
              key={region.id}
              region={region}
              isLocked={isLocked}
              stationedPlayers={stationed}
              isSelectedTarget={isSelected}
              onSelect={onSelectRegion ? () => onSelectRegion(region.id) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};

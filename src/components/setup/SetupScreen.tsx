import React, { useState } from 'react';
import { Play, Users, BookOpen, Package, Shield } from 'lucide-react';
import { useGamePackage } from '../../modding/ModContext';

interface SetupScreenProps {
  onStartGame: (playerCount: number) => void;
  onOpenRules: () => void;
  onOpenMods: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  onStartGame,
  onOpenRules,
  onOpenMods,
}) => {
  const { manifest, theme, apostles, regions, installedMods } = useGamePackage();
  const [playerCount, setPlayerCount] = useState<number>(4);

  const maxSelectable = Math.min(apostles.length, 6);
  const activeModsCount = installedMods.filter((m) => m.manifest.enabled).length;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-stone-950 text-stone-100">
      <div
        id="setup-screen-container"
        className="w-full max-w-2xl rounded-2xl border-2 border-amber-500/60 bg-stone-900/95 p-8 shadow-2xl space-y-6 text-center"
      >
        {/* Title and biblical lore from GamePackage */}
        <div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              A Tabletop Historical Simulation
            </span>
            {activeModsCount > 0 && (
              <span className="rounded bg-amber-950 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-800 uppercase">
                {activeModsCount} Mod{activeModsCount > 1 ? 's' : ''} Active
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wide text-amber-300 mt-1 uppercase">
            {manifest.name}
          </h1>
          <p className="mt-2 text-sm italic text-stone-300 max-w-lg mx-auto leading-relaxed">
            &quot;{manifest.epigraph.text}&quot;
            <br />
            <span className="text-xs text-amber-400/90 font-medium">{manifest.epigraph.reference}</span>
          </p>
        </div>

        {/* Core premise */}
        <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 text-xs text-stone-300 text-left space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>The Apostolic Commission</span>
          </div>
          <p>
            You and your fellow apostles journey across the {regions.length} Roman provinces — {regions.map((r) => r.name).join(', ')}.
          </p>
          <p>
            Plant seeds to establish <strong>5 vibrant churches</strong> while enduring imperial persecution, theological disputes, and martyrdom. In the end, cast your crowns before the throne without choking on spiritual pride!
          </p>
        </div>

        {/* Player Count Selector */}
        <div className="flex flex-col items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-stone-200">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Select Number of Apostles (2 - {maxSelectable} Players):</span>
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {[2, 3, 4, 5, 6].filter((count) => count <= maxSelectable).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setPlayerCount(count)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all cursor-pointer ${
                  playerCount === count
                    ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-300 scale-105'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                }`}
              >
                {count} Apostles
              </button>
            ))}
          </div>
        </div>

        {/* Apostle Roster Preview from Active Mod Package */}
        <div className="text-left space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-400 uppercase tracking-wider">
            <span>Apostolic Roster ({apostles.length} Available Figures)</span>
            <span className="text-[11px] text-amber-400 font-mono">Core + Modded</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
            {apostles.map((a) => (
              <div
                key={a.name}
                className="rounded-lg border border-stone-800 bg-stone-950/60 p-2 flex items-center gap-2"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: a.color }}
                >
                  {a.icon}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-xs text-stone-200 truncate">{a.name}</div>
                  <div className="text-[10px] text-stone-400 truncate">{a.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="btn-start-game"
            onClick={() => onStartGame(playerCount)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3.5 text-base font-bold text-stone-950 shadow-lg hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-stone-950" />
            <span>Commence the Mission</span>
          </button>

          <button
            type="button"
            onClick={onOpenMods}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-950/40 px-5 py-3.5 text-sm font-semibold text-amber-300 hover:bg-amber-900/60 transition-all cursor-pointer"
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Mods &amp; Packages</span>
          </button>

          <button
            type="button"
            onClick={onOpenRules}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-5 py-3.5 text-sm font-semibold text-stone-200 hover:bg-stone-700 hover:text-white transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Rulebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};

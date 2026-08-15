import React from 'react';
import { Flame, Landmark, BookOpen, RotateCcw, AlertTriangle, Package } from 'lucide-react';
import { useGamePackage } from '../../modding/ModContext';

interface TopBarProps {
  roundNumber: number;
  globalTrack: number;
  churchHarvests: number;
  targetHarvests: number;
  onOpenRules: () => void;
  onOpenMods: () => void;
  onRestart: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  roundNumber,
  globalTrack,
  churchHarvests,
  targetHarvests,
  onOpenRules,
  onOpenMods,
  onRestart,
}) => {
  const { manifest, installedMods } = useGamePackage();
  const isDanger = globalTrack <= 4;
  const activeModsCount = installedMods.filter((m) => m.manifest.enabled).length;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-800 bg-stone-900/95 px-5 py-3 shadow-lg">
      {/* Title & Lore Epigraph */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-lg font-bold tracking-wider text-amber-400 uppercase">
              {manifest.shortName}
            </h1>
            <span className="rounded bg-amber-950 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-800 uppercase tracking-wider">
              {manifest.subtitle}
            </span>
          </div>
          <span className="text-[11px] italic text-stone-400 hidden sm:inline">
            &quot;{manifest.epigraph.text}&quot; {manifest.epigraph.reference}
          </span>
        </div>
      </div>

      {/* Center Trackers */}
      <div className="flex items-center gap-4 text-xs">
        {/* Round */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-stone-800 bg-stone-950 px-3 py-1.5 shadow-inner">
          <span className="text-[10px] uppercase font-semibold text-stone-400">Round</span>
          <span className="font-mono text-base font-bold text-blue-400">
            {roundNumber}
          </span>
        </div>

        {/* Global Persecution Track */}
        <div
          className={`flex flex-col items-center justify-center rounded-lg border px-3 py-1.5 shadow-inner transition-colors ${
            isDanger
              ? 'border-rose-700 bg-rose-950/60 animate-pulse text-rose-300'
              : 'border-stone-800 bg-stone-950 text-stone-300'
          }`}
          title="Global Persecution Track: When an Apostle's Heat equals or exceeds this number, martyrdom occurs."
        >
          <div className="flex items-center gap-1 text-[10px] uppercase font-semibold">
            <Flame className="w-3 h-3 text-rose-400" />
            <span className="text-stone-400">Persecution</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-base font-bold text-rose-400">
            {globalTrack} <span className="text-[10px] text-stone-500 font-normal">/ 10</span>
            {isDanger && <AlertTriangle className="w-3 h-3 text-rose-400" />}
          </div>
        </div>

        {/* Harvest Goal */}
        <div
          className="flex flex-col items-center justify-center rounded-lg border border-stone-800 bg-stone-950 px-3 py-1.5 shadow-inner"
          title="Harvest Goal: Planted churches needed to trigger The Final Gathering."
        >
          <div className="flex items-center gap-1 text-[10px] uppercase font-semibold">
            <Landmark className="w-3 h-3 text-amber-400" />
            <span className="text-stone-400">Harvests</span>
          </div>
          <span className="font-mono text-base font-bold text-amber-300">
            {churchHarvests} <span className="text-[10px] text-stone-500 font-normal">/ {targetHarvests}</span>
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMods}
          className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-900/60 hover:text-amber-200 transition-colors cursor-pointer"
          title="Manage Installed Mods & Content Packages"
        >
          <Package className="w-3.5 h-3.5 text-amber-400" />
          <span>Mods</span>
          {activeModsCount > 0 && (
            <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[9px] font-bold text-stone-950">
              {activeModsCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenRules}
          className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-200 hover:bg-stone-700 hover:text-white transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Rules &amp; Lore</span>
        </button>

        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:bg-stone-700 hover:text-white transition-colors cursor-pointer"
          title="Restart Mission"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>
    </header>
  );
};

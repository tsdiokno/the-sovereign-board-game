import React, { useRef, useEffect } from 'react';
import { ChronicleEntry } from '../../types/game';
import { Scroll, Sparkles, AlertCircle, Bookmark, CheckCircle2 } from 'lucide-react';

interface ChronicleLogProps {
  entries: ChronicleEntry[];
}

export const ChronicleLog: React.FC<ChronicleLogProps> = ({ entries }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Smoothly scroll to top on new entry (since latest entries are at the top)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [entries.length]);

  return (
    <div
      id="chronicle-panel-container"
      className="flex flex-col h-full rounded-xl border-2 border-stone-700/80 bg-[#f7f1e3] text-stone-900 shadow-xl overflow-hidden"
    >
      {/* Parchment Header */}
      <div className="flex items-center justify-between border-b-2 border-[#d9ccb0] bg-[#eedec0] px-4 py-3">
        <div className="flex items-center gap-2">
          <Scroll className="w-5 h-5 text-[#6d4c2b]" />
          <h3 className="font-serif text-base font-bold text-[#4a331c] tracking-wide">
            Luke&apos;s Chronicle
          </h3>
        </div>
        <span className="text-xs font-serif italic text-[#7d5f3f]">
          Acts of the Apostles
        </span>
      </div>

      {/* Entries List */}
      <div
        ref={containerRef}
        id="chronicle-scroll-area"
        className="flex-1 overflow-y-auto p-4 space-y-3 font-serif text-sm leading-relaxed"
      >
        {entries.length === 0 ? (
          <div className="text-center italic text-stone-500 py-6">
            The parchment lies open, awaiting the records of the mission...
          </div>
        ) : (
          entries.map((entry) => {
            const isEvent = entry.type === 'event';
            const isWarning = entry.type === 'warning';
            const isVictory = entry.type === 'victory';

            return (
              <div
                key={entry.id}
                className={`rounded-lg p-3 transition-colors border shadow-xs ${
                  isVictory
                    ? 'border-emerald-600/60 bg-emerald-100/60 text-emerald-950'
                    : isWarning
                    ? 'border-rose-400/60 bg-rose-100/70 text-rose-950'
                    : isEvent
                    ? 'border-purple-300/80 bg-purple-100/60 text-purple-950'
                    : 'border-[#dfd0b5] bg-[#fbf7ee] text-stone-800'
                }`}
              >
                {/* Entry Meta Header */}
                <div className="flex items-center justify-between gap-2 text-xs font-sans mb-1.5 opacity-80">
                  <div className="flex items-center gap-1.5 font-bold">
                    {isVictory && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                    {isWarning && <AlertCircle className="w-3.5 h-3.5 text-rose-700" />}
                    {isEvent && <Bookmark className="w-3.5 h-3.5 text-purple-700" />}
                    <span>{entry.timestamp}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    {entry.type}
                  </span>
                </div>

                {/* Narrative Text */}
                <p className="font-serif text-sm font-medium text-stone-900 leading-snug">
                  {entry.text}
                </p>

                {/* Mechanic Note */}
                {entry.mechanic && (
                  <div className="mt-2 rounded border border-stone-400/40 bg-white/70 p-2 font-mono text-[11px] text-stone-800 leading-tight">
                    <span className="font-bold text-stone-900">[Mechanic]</span>{' '}
                    {entry.mechanic}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

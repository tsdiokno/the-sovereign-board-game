import React from 'react';
import { X, BookOpen, Dices, Flame, Sparkles, Shield, Trophy } from 'lucide-react';
import { useGamePackage } from '../../modding/ModContext';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const { manifest, apostles, regions } = useGamePackage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs overflow-y-auto">
      <div
        id="rules-modal-container"
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl border border-stone-700 bg-stone-900 p-6 text-stone-100 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-xl font-bold text-amber-300">
              {manifest.name} — Game Rulebook &amp; Lore
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Rules Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 text-sm text-stone-300 pr-1">
          {/* Victory & Endgame */}
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 font-serif text-base font-bold text-amber-400">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Core Goal &amp; The Final Gathering</span>
            </h3>
            <p className="leading-relaxed">
              Work cooperatively as the Apostles in the book of Acts to plant <strong>5 Churches</strong> (trigger 5 Harvests) before Global Persecution wipes the church out. When 5 harvests occur, the table enters <strong>The Final Gathering</strong>. Surviving leaders must cast their crowns: each apostle needs <strong>2 Crowns for every 1 Pride point</strong>. If they succeed, the table wins in <em>Soli Deo Gloria</em>! If they choke on pride, the burden passes down the line.
            </p>
          </section>

          {/* Sovereign Die Outcomes */}
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 font-serif text-base font-bold text-amber-400">
              <Dices className="w-4 h-4 text-amber-400" />
              <span>The Sovereign Die (Rolled on Living Turns)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-stone-800 bg-stone-950 p-2.5">
                <strong className="text-rose-400">1: The Judas Factor</strong>
                <p className="mt-0.5 text-stone-400">Arrested! +Heat (+2 for James), Global Persecution drops by 1.</p>
              </div>
              <div className="rounded-lg border border-stone-800 bg-stone-950 p-2.5">
                <strong className="text-stone-300">2: Stony Ground</strong>
                <p className="mt-0.5 text-stone-400">No seeds planted. In Greece: gain +1 Pride from philosophical pride.</p>
              </div>
              <div className="rounded-lg border border-stone-800 bg-stone-950 p-2.5">
                <strong className="text-purple-300">3: Thorns</strong>
                <p className="mt-0.5 text-stone-400">+1 Seed, +1 Pride. In Antioch: immune to pride. Peter skips next turn if pride gained.</p>
              </div>
              <div className="rounded-lg border border-stone-800 bg-stone-950 p-2.5">
                <strong className="text-blue-300">4: Providential Detour</strong>
                <p className="mt-0.5 text-stone-400">Spirit relocates apostle to a random province and places +1 Seed there.</p>
              </div>
              <div className="rounded-lg border border-stone-800 bg-stone-950 p-2.5">
                <strong className="text-emerald-300">5: Apollos Waters</strong>
                <p className="mt-0.5 text-stone-400">Places +1 Seed (+2 for Andrew) in the weakest province on the board.</p>
              </div>
              <div className="rounded-lg border border-stone-800 bg-stone-950 p-2.5">
                <strong className="text-amber-300">6: Irresistible Grace</strong>
                <p className="mt-0.5 text-stone-400">Massive breakthrough! +2 Seeds placed locally in target province.</p>
              </div>
            </div>
          </section>

          {/* Intercession Die */}
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 font-serif text-base font-bold text-blue-400">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>The Intercession Die (Rolled by Martyred Apostles)</span>
            </h3>
            <p className="text-xs text-stone-400">
              When an Apostle&apos;s Heat reaches the Global Track, they are martyred (+3 Seeds to their region). On their subsequent turns, they roll the Intercession Die:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-stone-800 bg-stone-950 p-2">
                <strong className="text-blue-300">1: How Long, O Lord?</strong> Global Persecution +1 (Safer).
              </div>
              <div className="rounded-lg border border-stone-800 bg-stone-950 p-2">
                <strong className="text-blue-300">2: Grace to Endure</strong> -1 Pride removed from proudest living apostle.
              </div>
              <div className="rounded-lg border border-stone-800 bg-stone-950 p-2">
                <strong className="text-blue-300">3: The Blood Speaks</strong> +1 Seed placed in martyr&apos;s region.
              </div>
              <div className="rounded-lg border border-stone-800 bg-stone-950 p-2">
                <strong className="text-blue-300">4: Angelic Deliverance</strong> Frees an arrested apostle from prison.
              </div>
              <div className="rounded-lg border border-stone-800 bg-stone-950 p-2 md:col-span-2">
                <strong className="text-blue-300">5 or 6: Holy Boldness</strong> +1 Seed placed in Jerusalem.
              </div>
            </div>
          </section>

          {/* Dynamic Apostle Passives from Active Package */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-amber-400">
                The Apostles &amp; Special Abilities
              </h3>
              <span className="text-xs text-stone-400">{apostles.length} Figures Available</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {apostles.map((a) => (
                <div key={a.name} className="rounded-lg border border-stone-800 bg-stone-950 p-2.5">
                  <div className="flex items-center gap-2 font-bold text-stone-200">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white" style={{ backgroundColor: a.color }}>
                      {a.icon}
                    </span>
                    <span>{a.name} — {a.title}</span>
                  </div>
                  <p className="mt-1 text-stone-400">{a.detailedAbility}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Dynamic Regions from Active Package */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-amber-400">
                Provinces of the Empire
              </h3>
              <span className="text-xs text-stone-400">{regions.length} Regions</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {regions.map((r) => (
                <div key={r.id} className="rounded-lg border border-stone-800 bg-stone-950 p-2">
                  <div className="font-bold text-amber-300">{r.name} (Req: {r.threshold} Seeds)</div>
                  <div className="text-stone-400 mt-0.5">{r.desc}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-800 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>
              <strong>{manifest.name}</strong> • {manifest.legal.licenseName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-stone-800 px-4 py-2 text-xs font-bold text-stone-200 hover:bg-stone-700 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { GameState } from '../../types/game';
import { resolveEndgameProcess } from '../../engine/gameEngine';
import { Crown, Sparkles, AlertTriangle, RefreshCw, Trophy, Skull } from 'lucide-react';

interface EndgameModalProps {
  isOpen: boolean;
  gameState: GameState;
  onUpdateState: (newState: GameState) => void;
  onRestart: () => void;
}

export const EndgameModal: React.FC<EndgameModalProps> = ({
  isOpen,
  gameState,
  onUpdateState,
  onRestart,
}) => {
  if (!isOpen) return null;

  const queue = gameState.endgameQueue;
  const status = gameState.endgameStatus;
  const currentLeader = queue[0];
  const allMartyred = gameState.players.every((p) => p.isMartyred);

  const handleCastCrowns = () => {
    const { nextState } = resolveEndgameProcess(gameState);
    onUpdateState(nextState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div
        id="endgame-modal-container"
        className="w-full max-w-lg rounded-2xl border-2 border-amber-500/80 bg-stone-900 p-6 text-stone-100 shadow-2xl text-center space-y-5"
      >
        {/* Header Title */}
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            The Final Gathering
          </span>
          <h2 className="font-serif text-3xl font-bold text-amber-300 mt-1">
            Casting Crowns
          </h2>
          <p className="text-xs italic text-stone-300 mt-1">
            &quot;The four and twenty elders fall down before him that sat on the throne, and cast their crowns...&quot; — Rev 4:10
          </p>
        </div>

        {/* Dynamic Status Display */}
        {status === 'victory' ? (
          <div className="rounded-xl border-2 border-emerald-500/80 bg-emerald-950/60 p-5 space-y-3">
            <div className="flex justify-center">
              <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-emerald-300">
              SOLI DEO GLORIA!
            </h3>
            <p className="text-sm text-stone-200 leading-relaxed">
              The table has overcome persecution, false teachers, and spiritual pride. Five vibrant churches stand in the Roman world to God&apos;s eternal glory!
            </p>
          </div>
        ) : status === 'defeat' ? (
          <div className="rounded-xl border-2 border-rose-600/80 bg-rose-950/60 p-5 space-y-3">
            <div className="flex justify-center">
              <Skull className="w-12 h-12 text-rose-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-rose-400">
              TOTAL DEPRAVITY
            </h3>
            <p className="text-sm text-stone-200 leading-relaxed">
              Every surviving apostle choked on accumulated spiritual pride and lacked sufficient crowns to cast before the throne. The table has lost.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {allMartyred ? (
              <div className="rounded-xl border border-amber-500/40 bg-stone-950/80 p-4 text-sm text-stone-300">
                <p className="text-amber-300 font-bold text-base mb-1">
                  All Apostles Martyred in Faithfulness
                </p>
                <p>Every brother gave their life as a faithful martyr. The church wins in holy perfection!</p>
              </div>
            ) : currentLeader ? (
              <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-4 text-sm space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow"
                    style={{ backgroundColor: currentLeader.color }}
                  >
                    {currentLeader.icon}
                  </div>
                  <span className="font-serif text-lg font-bold text-stone-100">
                    {currentLeader.playerName} ({currentLeader.apostle})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-1">
                  <div className="rounded bg-stone-900 p-2 border border-stone-800">
                    <div className="text-stone-400">Crowns Held</div>
                    <div className="font-mono text-lg font-bold text-amber-300">
                      {currentLeader.crowns}
                    </div>
                  </div>
                  <div className="rounded bg-stone-900 p-2 border border-stone-800">
                    <div className="text-stone-400">Pride Accumulated</div>
                    <div className="font-mono text-lg font-bold text-purple-300">
                      {currentLeader.pride}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-stone-300">
                  Must discard <strong className="text-amber-300">{currentLeader.pride * 2} Crowns</strong> (2 Crowns per Pride point) to cast their crowns without choking.
                </div>

                {currentLeader.crowns >= currentLeader.pride * 2 ? (
                  <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 py-1.5 px-2 rounded border border-emerald-800">
                    ✓ Has enough Crowns ({currentLeader.crowns} ≥ {currentLeader.pride * 2}) to achieve victory!
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-rose-400 bg-rose-950/40 py-1.5 px-2 rounded border border-rose-800">
                    ⚠ Short by {currentLeader.pride * 2 - currentLeader.crowns} Crown(s)! Will choke on pride and pass burden.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Endgame Logs */}
        {gameState.endgameLogs.length > 0 && (
          <div className="text-left rounded-lg bg-stone-950 p-3 text-xs space-y-1 max-h-32 overflow-y-auto border border-stone-800 font-mono">
            {gameState.endgameLogs.map((log, idx) => (
              <div key={idx} className="text-stone-300">
                • {log}
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-center gap-3">
          {status === 'in_progress' && (
            <button
              id="btn-cast-crowns"
              onClick={handleCastCrowns}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-bold text-stone-950 shadow-lg hover:from-amber-400 hover:to-amber-500 cursor-pointer active:scale-95 text-base"
            >
              <Crown className="w-5 h-5" />
              <span>Cast Crowns</span>
            </button>
          )}

          {(status === 'victory' || status === 'defeat') && (
            <button
              id="btn-restart-endgame"
              onClick={onRestart}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-stone-700 to-stone-800 px-6 py-3 font-bold text-stone-100 shadow-lg hover:from-stone-600 hover:to-stone-700 border border-stone-600 cursor-pointer active:scale-95 text-base"
            >
              <RefreshCw className="w-5 h-5 text-amber-400" />
              <span>Commence New Mission</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

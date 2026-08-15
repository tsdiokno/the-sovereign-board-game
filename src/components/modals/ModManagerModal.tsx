import React, { useState } from 'react';
import { useGamePackage } from '../../modding/ModContext';
import { Package, ToggleLeft, ToggleRight, Plus, Upload, CheckCircle2, RotateCcw, X, Palette, Sparkles, Shield } from 'lucide-react';

interface ModManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModManagerModal: React.FC<ModManagerModalProps> = ({ isOpen, onClose }) => {
  const { installedMods, toggleMod, installMod, resetMods, manifest, theme } = useGamePackage();
  const [modJsonInput, setModJsonInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isAddingMod, setIsAddingMod] = useState(false);

  if (!isOpen) return null;

  const handleInstallCustom = () => {
    if (!modJsonInput.trim()) return;
    const res = installMod(modJsonInput);
    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message });
      setModJsonInput('');
      setIsAddingMod(false);
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        id="mod-manager-modal"
        className="w-full max-w-2xl rounded-2xl border-2 border-amber-500/70 bg-stone-900 p-6 shadow-2xl space-y-6 text-stone-100 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-300 flex items-center gap-2">
                <span>Mod & Content Package Manager</span>
              </h2>
              <p className="text-xs text-stone-400">
                Active Core: <strong className="text-amber-400">{manifest.name}</strong> (v{manifest.version})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Theme & Core Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-3 flex items-center gap-3">
            <Palette className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="overflow-hidden">
              <div className="text-[11px] uppercase font-bold text-stone-400">Active Theme</div>
              <div className="text-xs font-bold text-amber-200 truncate">{theme.name}</div>
            </div>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-3 flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="overflow-hidden">
              <div className="text-[11px] uppercase font-bold text-stone-400">Architecture</div>
              <div className="text-xs font-bold text-emerald-300 truncate">Data-Driven Mod Packages</div>
            </div>
          </div>
        </div>

        {/* Status Notification */}
        {statusMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-200'
                : 'bg-rose-950/80 border-rose-700 text-rose-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Installed Mod Packages List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-400">
            <span>Installed Community & Official Packages</span>
            <span>{installedMods.filter((m) => m.manifest.enabled).length} Active</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {installedMods.map((mod) => {
              const isEnabled = !!mod.manifest.enabled;
              return (
                <div
                  key={mod.manifest.id}
                  className={`rounded-xl border p-3.5 transition-all flex items-center justify-between gap-4 ${
                    isEnabled
                      ? 'border-amber-500/60 bg-amber-950/20 shadow-sm'
                      : 'border-stone-800 bg-stone-950/40 opacity-75'
                  }`}
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-stone-200">
                        {mod.manifest.name}
                      </span>
                      <span className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px] font-mono text-stone-400">
                        v{mod.manifest.version}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 line-clamp-2">
                      {mod.manifest.description}
                    </p>
                    <div className="text-[11px] text-amber-400/80 font-medium">
                      Author: {mod.manifest.author}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleMod(mod.manifest.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isEnabled
                        ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {isEnabled ? (
                      <>
                        <ToggleRight className="w-4 h-4" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        <span>Disabled</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Custom Mod JSON toggle */}
        {isAddingMod ? (
          <div className="rounded-xl border border-stone-700 bg-stone-950 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" /> Paste Mod JSON Manifest
              </span>
              <button
                onClick={() => setIsAddingMod(false)}
                className="text-stone-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
            <textarea
              value={modJsonInput}
              onChange={(e) => setModJsonInput(e.target.value)}
              placeholder={`{\n  "manifest": {\n    "id": "my-custom-mod",\n    "name": "Acts of Peter & John Extra",\n    "version": "1.0.0",\n    "author": "Theophilus",\n    "description": "Adds customized regional modifiers"\n  }\n}`}
              className="w-full h-28 bg-stone-900 rounded-lg p-2.5 font-mono text-xs text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-none resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleInstallCustom}
                className="px-4 py-2 rounded-lg bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 cursor-pointer"
              >
                Install & Activate Package
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setIsAddingMod(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Import Custom Mod JSON</span>
            </button>

            <button
              onClick={resetMods}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-300 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All to Default</span>
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="border-t border-stone-800 pt-3 text-[11px] text-stone-400 text-center">
          Any installed mod packages will automatically take effect on the next round or when starting a new game.
        </div>
      </div>
    </div>
  );
};

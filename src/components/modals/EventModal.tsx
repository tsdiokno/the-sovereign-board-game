import React, { useState } from 'react';
import { ChronicleEntry, EventCard, GameState, Player, RegionId, RegionState } from '../../types/game';
import { addSeedToRegion, getRegionName, checkMartyrdomsAndHarvests } from '../../engine/gameEngine';
import { Scroll, Sparkles, AlertCircle, ShieldAlert, Check } from 'lucide-react';
import { REGIONS } from '../../data/apostles';

interface EventModalProps {
  isOpen: boolean;
  event: EventCard | null;
  gameState: GameState;
  onResolve: (nextState: GameState, logs: ChronicleEntry[]) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  event,
  gameState,
  onResolve,
}) => {
  if (!isOpen || !event) return null;

  // Local form state for choices
  const [councilChoice, setCouncilChoice] = useState<'concede' | 'debate' | 'paul'>('concede');
  const [simonVeto, setSimonVeto] = useState(false);
  const [simonChoices, setSimonChoices] = useState<Record<number, 'refuse' | 'accept'>>({});
  const [johnAbsorb, setJohnAbsorb] = useState(false);
  const [careChoices, setCareChoices] = useState<Record<number, 'rest' | 'push'>>({});
  const [andrewTarget, setAndrewTarget] = useState<number | 'none'>('none');
  const [jamesAbsorb, setJamesAbsorb] = useState(false);
  const [neroChoices, setNeroChoices] = useState<Record<number, 'hide' | 'defy'>>({});
  const [famineChoices, setFamineChoices] = useState<Record<number, 'pride' | 'crown'>>({});
  const [paxChoices, setPaxChoices] = useState<Record<number, 'sabbatical' | 'evangelize'>>({});
  const [paulGalatians, setPaulGalatians] = useState(false);

  const livingPlayers = gameState.players.filter((p) => !p.isMartyred);
  const paulPlayer = gameState.players.find((p) => p.apostle === 'Paul' && !p.isMartyred && !p.isArrested && p.crowns >= 2);
  const peterPlayer = gameState.players.find((p) => p.apostle === 'Peter' && !p.isMartyred);
  const johnPlayer = gameState.players.find((p) => p.apostle === 'John' && !p.isMartyred);
  const thomasPlayer = gameState.players.find((p) => p.apostle === 'Thomas' && !p.isMartyred);
  const andrewPlayer = gameState.players.find((p) => p.apostle === 'Andrew' && !p.isMartyred);
  const jamesPlayer = gameState.players.find((p) => p.apostle === 'James' && !p.isMartyred);
  const paulAnyLiving = gameState.players.find((p) => p.apostle === 'Paul' && !p.isMartyred);

  const highestSeedRegion = [...gameState.board].sort((a, b) => b.seeds - a.seeds)[0];

  const handleResolve = () => {
    let currentPlayers = [...gameState.players];
    let currentBoard = [...gameState.board];
    let globalTrack = gameState.globalTrack;
    let lockedRegion = gameState.lockedRegion;
    const logs: ChronicleEntry[] = [];

    switch (event.id) {
      case 'council_of_jerusalem': {
        if (councilChoice === 'paul' && paulPlayer) {
          currentPlayers = currentPlayers.map((p) =>
            p.id === paulPlayer.id ? { ...p, crowns: p.crowns - 2 } : p
          );
          logs.push({
            id: `evt-resolve-${Date.now()}`,
            timestamp: `R${gameState.roundNumber} Decree`,
            round: gameState.roundNumber,
            type: 'event',
            text: 'Paul paid 2 Crowns to bring canonical harmony at the Jerusalem Council!',
            mechanic: 'No pride taken, no regions locked.',
          });
        } else if (councilChoice === 'debate') {
          lockedRegion = 'antioch';
          logs.push({
            id: `evt-resolve-${Date.now()}`,
            timestamp: `R${gameState.roundNumber} Decree`,
            round: gameState.roundNumber,
            type: 'event',
            text: 'The Council chose deep theological debate. The mission in Antioch is halted for 1 round.',
            mechanic: 'Antioch is locked this round.',
          });
        } else {
          currentPlayers = currentPlayers.map((p) =>
            !p.isMartyred ? { ...p, pride: p.pride + 1 } : p
          );
          logs.push({
            id: `evt-resolve-${Date.now()}`,
            timestamp: `R${gameState.roundNumber} Decree`,
            round: gameState.roundNumber,
            type: 'event',
            text: 'The table conceded to compromise. Spiritual pride infiltrates the leadership.',
            mechanic: 'Every living apostle gained +1 Pride.',
          });
        }
        break;
      }

      case 'simon_magus': {
        if (simonVeto) {
          logs.push({
            id: `evt-resolve-${Date.now()}`,
            timestamp: `R${gameState.roundNumber} Decree`,
            round: gameState.roundNumber,
            type: 'event',
            text: 'Peter rebuked Simon: "May your silver perish with you!" The decree was vetoed.',
            mechanic: 'Event completely neutralized by Peter.',
          });
        } else {
          const acceptedNames: string[] = [];
          currentPlayers = currentPlayers.map((p) => {
            if (!p.isMartyred && simonChoices[p.id] === 'accept' && p.crowns >= 1) {
              acceptedNames.push(p.apostle);
              // Add seed locally
              const { newBoard } = addSeedToRegion(currentBoard, p.region, 1, lockedRegion);
              currentBoard = newBoard;
              return { ...p, crowns: p.crowns - 1, pride: p.pride + 1 };
            }
            return p;
          });

          if (acceptedNames.length > 0) {
            logs.push({
              id: `evt-resolve-${Date.now()}`,
              timestamp: `R${gameState.roundNumber} Decree`,
              round: gameState.roundNumber,
              type: 'event',
              text: `${acceptedNames.join(', ')} accepted Simon's silver for immediate ministry funds.`,
              mechanic: 'Each accepting apostle paid 1 Crown, gained +1 Seed locally, and took +1 Pride.',
            });
          } else {
            logs.push({
              id: `evt-resolve-${Date.now()}`,
              timestamp: `R${gameState.roundNumber} Decree`,
              round: gameState.roundNumber,
              type: 'event',
              text: 'All living apostles refused the magician\'s corrupted silver.',
              mechanic: 'No changes.',
            });
          }
        }
        break;
      }

      case 'ephesian_riot': {
        if (johnAbsorb && johnPlayer) {
          currentPlayers = currentPlayers.map((p) =>
            p.id === johnPlayer.id ? { ...p, heat: p.heat + 4 } : p
          );
          logs.push({
            id: `evt-resolve-${Date.now()}`,
            timestamp: `R${gameState.roundNumber} Decree`,
            round: gameState.roundNumber,
            type: 'event',
            text: 'John courageously stood before the raging theater mob, absorbing their fury!',
            mechanic: 'John took +4 Heat. Asia Minor seeds were preserved.',
          });
        } else {
          currentBoard = currentBoard.map((r) =>
            r.id === 'asia_minor' ? { ...r, seeds: 0 } : r
          );
          const affected: string[] = [];
          currentPlayers = currentPlayers.map((p) => {
            if (p.region === 'asia_minor' && !p.isMartyred) {
              affected.push(p.apostle);
              return { ...p, heat: p.heat + 2 };
            }
            return p;
          });
          logs.push({
            id: `evt-resolve-${Date.now()}`,
            timestamp: `R${gameState.roundNumber} Decree`,
            round: gameState.roundNumber,
            type: 'event',
            text: 'The Ephesian mob destroyed all mission seedlings in Asia Minor.',
            mechanic: `Asia Minor seeds wiped. ${affected.length > 0 ? affected.join(', ') + ' took +2 Heat.' : 'No apostles were stationed in Asia Minor.'}`,
          });
        }
        break;
      }

      case 'euroclydon_shipwreck': {
        currentPlayers = currentPlayers.map((p) => {
          if (!p.isMartyred && p.apostle !== 'Thomas') {
            const randomReg = REGIONS[Math.floor(Math.random() * REGIONS.length)].id;
            return { ...p, region: randomReg };
          }
          return p;
        });
        logs.push({
          id: `evt-resolve-${Date.now()}`,
          timestamp: `R${gameState.roundNumber} Decree`,
          round: gameState.roundNumber,
          type: 'event',
          text: 'The Euroclydon shattered seafaring vessels! Surviving apostles were washed ashore across random provinces.',
          mechanic: 'All living apostles (except Thomas) scattered to random regions.',
        });
        break;
      }

      case 'care_of_churches': {
        currentPlayers = currentPlayers.map((p) => {
          if (!p.isMartyred) {
            const choice = careChoices[p.id] || 'push';
            if (choice === 'rest') {
              return { ...p, requiresRestoration: true };
            } else {
              // Pushing through
              if (typeof andrewTarget === 'number' && andrewTarget === p.id && andrewPlayer) {
                // Andrew absorbs
                return p;
              }
              return { ...p, pride: p.pride + 1 };
            }
          }
          return p;
        });

        if (typeof andrewTarget === 'number' && andrewPlayer) {
          const absorbedPlayer = currentPlayers.find((p) => p.id === andrewTarget);
          currentPlayers = currentPlayers.map((p) =>
            p.id === andrewPlayer.id ? { ...p, pride: p.pride + 1 } : p
          );
          logs.push({
            id: `evt-resolve-${Date.now()}`,
            timestamp: `R${gameState.roundNumber} Decree`,
            round: gameState.roundNumber,
            type: 'event',
            text: `Andrew bore the spiritual exhaustion and pride burden of ${absorbedPlayer?.apostle || 'his brother'}.`,
            mechanic: 'Andrew absorbed +1 Pride for his brother.',
          });
        }

        logs.push({
          id: `evt-resolve-${Date.now()}`,
          timestamp: `R${gameState.roundNumber} Decree`,
          round: gameState.roundNumber,
          type: 'event',
          text: 'The weight of pastoral oversight was felt across all assemblies.',
          mechanic: 'Resting apostles skip next turn; pushing apostles gained Pride.',
        });
        break;
      }

      case 'nero_blame': {
        globalTrack = Math.max(1, globalTrack - 2);
        if (jamesAbsorb && jamesPlayer) {
          currentPlayers = currentPlayers.map((p) =>
            p.id === jamesPlayer.id ? { ...p, heat: p.heat + 4 } : p
          );
          logs.push({
            id: `evt-resolve-${Date.now()}`,
            timestamp: `R${gameState.roundNumber} Decree`,
            round: gameState.roundNumber,
            type: 'event',
            text: 'James stepped out into the open forum to draw Nero\'s wrath onto himself!',
            mechanic: `Global Persecution Track dropped to ${globalTrack}. James took +4 Heat; all other brothers acted without penalty.`,
          });
        } else {
          currentPlayers = currentPlayers.map((p) => {
            if (!p.isMartyred) {
              const choice = neroChoices[p.id] || 'defy';
              if (choice === 'hide') {
                return { ...p, requiresRestoration: true };
              } else {
                return { ...p, heat: p.heat + 2 };
              }
            }
            return p;
          });
          logs.push({
            id: `evt-resolve-${Date.now()}`,
            timestamp: `R${gameState.roundNumber} Decree`,
            round: gameState.roundNumber,
            type: 'event',
            text: 'Nero blamed the believers for the Great Fire of Rome.',
            mechanic: `Global Persecution Track dropped to ${globalTrack}. Hiding apostles skip next turn; defying apostles took +2 Heat.`,
          });
        }
        break;
      }

      case 'judean_famine': {
        currentPlayers = currentPlayers.map((p) => {
          if (!p.isMartyred) {
            const choice = famineChoices[p.id] || 'pride';
            if (choice === 'crown' && p.crowns >= 1) {
              return { ...p, crowns: p.crowns - 1 };
            } else {
              return { ...p, pride: p.pride + 1 };
            }
          }
          return p;
        });
        logs.push({
          id: `evt-resolve-${Date.now()}`,
          timestamp: `R${gameState.roundNumber} Decree`,
          round: gameState.roundNumber,
          type: 'event',
          text: 'Famine swept through Judea. Sacrifices and pride were weighed.',
          mechanic: 'Players gave up 1 Crown to feed the saints or gained +1 Pride.',
        });
        break;
      }

      case 'macedonian_call': {
        const { newBoard, added } = addSeedToRegion(currentBoard, 'greece', 2, lockedRegion);
        currentBoard = newBoard;
        logs.push({
          id: `evt-resolve-${Date.now()}`,
          timestamp: `R${gameState.roundNumber} Decree`,
          round: gameState.roundNumber,
          type: 'event',
          text: 'A vision appeared: "Come over to Macedonia and help us!" The Macedonian field is ready.',
          mechanic: `${added ? '+2 Seeds added to Greece' : 'Seeds blocked by lock'}.`,
        });
        break;
      }

      case 'pax_romana': {
        globalTrack = Math.min(10, globalTrack + 1);
        currentPlayers = currentPlayers.map((p) => {
          if (!p.isMartyred) {
            const choice = paxChoices[p.id] || 'evangelize';
            if (choice === 'sabbatical') {
              return { ...p, pride: Math.max(0, p.pride - 1), requiresRestoration: true };
            } else {
              const { newBoard } = addSeedToRegion(currentBoard, p.region, 1, lockedRegion);
              currentBoard = newBoard;
              return { ...p, heat: p.heat + 1 };
            }
          }
          return p;
        });
        logs.push({
          id: `evt-resolve-${Date.now()}`,
          timestamp: `R${gameState.roundNumber} Decree`,
          round: gameState.roundNumber,
          type: 'event',
          text: 'Pax Romana opened safe missionary paths throughout the provinces.',
          mechanic: `Global Persecution Track increased to ${globalTrack}. Sabbaticals and evangelism resolved.`,
        });
        break;
      }

      case 'the_judaizers': {
        if (paulGalatians && paulAnyLiving) {
          currentPlayers = currentPlayers.map((p) =>
            p.id === paulAnyLiving.id ? { ...p, pride: p.pride + 1 } : p
          );
          logs.push({
            id: `evt-resolve-${Date.now()}`,
            timestamp: `R${gameState.roundNumber} Decree`,
            round: gameState.roundNumber,
            type: 'event',
            text: 'Paul penned a fierce Epistle to the Galatians, exposing false legalism!',
            mechanic: 'Paul took +1 Pride; no seeds were destroyed.',
          });
        } else {
          if (highestSeedRegion && highestSeedRegion.seeds > 0) {
            currentBoard = currentBoard.map((r) =>
              r.id === highestSeedRegion.id ? { ...r, seeds: r.seeds - 1 } : r
            );
            logs.push({
              id: `evt-resolve-${Date.now()}`,
              timestamp: `R${gameState.roundNumber} Decree`,
              round: gameState.roundNumber,
              type: 'event',
              text: `The Judaizers sowed confusion in ${highestSeedRegion.name}.`,
              mechanic: `-1 Seed removed from ${highestSeedRegion.name}.`,
            });
          }
        }
        break;
      }
    }

    // Check Martyrdom & Harvests
    const checked = checkMartyrdomsAndHarvests({
      ...gameState,
      players: currentPlayers,
      board: currentBoard,
      globalTrack,
      lockedRegion,
      phase: gameState.phase === 'endgame' ? 'endgame' : 'playing',
      currentEvent: null,
    });

    onResolve(checked.state, [...logs, ...checked.logs]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs overflow-y-auto">
      <div
        id="event-modal-container"
        className="w-full max-w-xl rounded-2xl border-2 border-purple-600/80 bg-stone-900 p-6 text-stone-100 shadow-2xl space-y-4"
      >
        {/* Header */}
        <div className="border-b border-purple-900/60 pb-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-bold">
            <Scroll className="w-4 h-4 text-purple-400" />
            <span>A Decree of Providence (Round {gameState.roundNumber - 1})</span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold text-amber-300">
            {event.name}
          </h2>
          <p className="mt-2 text-xs italic text-stone-300 leading-relaxed">
            {event.desc}
          </p>
        </div>

        {/* Mechanic Overview */}
        <div className="rounded-lg border border-purple-800/40 bg-purple-950/30 p-3 text-xs text-purple-200">
          <span className="font-bold text-purple-300">[Rule]</span> {event.mechanic}
        </div>

        {/* Dynamic Decision UI based on Event */}
        <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 space-y-3">
          {event.id === 'council_of_jerusalem' && (
            <div className="space-y-3 text-sm">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="council"
                  value="concede"
                  checked={councilChoice === 'concede'}
                  onChange={() => setCouncilChoice('concede')}
                  className="mt-1"
                />
                <div>
                  <strong className="text-amber-200">Concede:</strong> The council compromises on rules. Every living Apostle takes +1 Pride.
                </div>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="council"
                  value="debate"
                  checked={councilChoice === 'debate'}
                  onChange={() => setCouncilChoice('debate')}
                  className="mt-1"
                />
                <div>
                  <strong className="text-amber-200">Debate:</strong> The dispute halts missionary expansion. Antioch is locked for 1 round.
                </div>
              </label>

              {paulPlayer && (
                <div className="mt-2 rounded-lg border border-amber-500/40 bg-amber-950/30 p-2.5">
                  <label className="flex items-start gap-2 cursor-pointer text-amber-300 font-medium">
                    <input
                      type="radio"
                      name="council"
                      value="paul"
                      checked={councilChoice === 'paul'}
                      onChange={() => setCouncilChoice('paul')}
                      className="mt-1"
                    />
                    <div>
                      <strong>Paul&apos;s Apostolic Override:</strong> Paul spends 2 Crowns (Has: {paulPlayer.crowns}) to authoritatively settle the doctrine with zero penalties!
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {event.id === 'simon_magus' && (
            <div className="space-y-3 text-sm">
              {peterPlayer && (
                <div className="rounded-lg border border-emerald-600/40 bg-emerald-950/30 p-2.5 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer text-emerald-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={simonVeto}
                      onChange={(e) => setSimonVeto(e.target.checked)}
                    />
                    <span>Peter&apos;s Rebuking Veto: &quot;May your silver perish with you!&quot; (Cancels event)</span>
                  </label>
                </div>
              )}

              {!simonVeto && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-stone-300">
                    Individual Apostle Decisions:
                  </div>
                  {livingPlayers.map((p) => {
                    const canAccept = p.crowns >= 1;
                    return (
                      <div key={p.id} className="flex items-center justify-between gap-3 text-xs border-b border-stone-800 pb-1.5">
                        <span className="font-semibold text-stone-200">
                          {p.playerName} ({p.apostle}) - {p.crowns} Crowns
                        </span>
                        <select
                          value={simonChoices[p.id] || 'refuse'}
                          onChange={(e) =>
                            setSimonChoices({ ...simonChoices, [p.id]: e.target.value as 'refuse' | 'accept' })
                          }
                          className="rounded border border-stone-700 bg-stone-900 px-2 py-1 text-stone-100"
                        >
                          <option value="refuse">Refuse Simon</option>
                          <option value="accept" disabled={!canAccept}>
                            {canAccept ? 'Accept (-1 Crown, +1 Seed, +1 Pride)' : 'Cannot Accept (Needs 1 Crown)'}
                          </option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {event.id === 'ephesian_riot' && (
            <div className="space-y-3 text-sm">
              {johnPlayer ? (
                <div className="rounded-lg border border-purple-500/40 bg-purple-950/30 p-2.5">
                  <label className="flex items-center gap-2 cursor-pointer text-purple-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={johnAbsorb}
                      onChange={(e) => setJohnAbsorb(e.target.checked)}
                    />
                    <span>John&apos;s Exile Override: John steps forward to absorb the mob (+4 Heat to John, Asia Minor seeds spared).</span>
                  </label>
                </div>
              ) : (
                <div className="text-xs text-rose-300 italic">
                  Asia Minor will lose all planted seeds. Any apostle stationed there takes +2 Heat.
                </div>
              )}
            </div>
          )}

          {event.id === 'euroclydon_shipwreck' && (
            <div className="text-xs text-stone-300 space-y-2">
              <p>All surviving brethren will be swept by Mediterranean winds to random provinces.</p>
              {thomasPlayer && (
                <div className="rounded border border-amber-600/40 bg-amber-950/20 p-2 text-amber-300">
                  <strong>Thomas&apos;s Passive:</strong> Used to treacherous outer frontiers, Thomas is immune to the shipwreck and remains in place.
                </div>
              )}
            </div>
          )}

          {event.id === 'care_of_churches' && (
            <div className="space-y-3 text-sm">
              <div className="text-xs font-semibold text-stone-300">
                Individual Apostle Choices:
              </div>
              {livingPlayers.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 text-xs border-b border-stone-800 pb-1.5">
                  <span className="font-semibold text-stone-200">
                    {p.playerName} ({p.apostle})
                  </span>
                  <select
                    value={careChoices[p.id] || 'push'}
                    onChange={(e) =>
                      setCareChoices({ ...careChoices, [p.id]: e.target.value as 'rest' | 'push' })
                    }
                    className="rounded border border-stone-700 bg-stone-900 px-2 py-1 text-stone-100"
                  >
                    <option value="push">Push Through (+1 Pride)</option>
                    <option value="rest">Rest & Sabbatical (Skip Next Turn)</option>
                  </select>
                </div>
              ))}

              {andrewPlayer && (
                <div className="mt-2 rounded-lg border border-orange-500/40 bg-orange-950/30 p-2.5 text-xs text-orange-200">
                  <label className="block font-semibold text-orange-300 mb-1">
                    Andrew&apos;s Bringer Override: Bear a brother&apos;s Pride burden:
                  </label>
                  <select
                    value={andrewTarget}
                    onChange={(e) => setAndrewTarget(e.target.value === 'none' ? 'none' : Number(e.target.value))}
                    className="w-full rounded border border-stone-700 bg-stone-900 px-2 py-1 text-stone-100"
                  >
                    <option value="none">-- Do not absorb any brother&apos;s pride --</option>
                    {livingPlayers
                      .filter((p) => p.apostle !== 'Andrew')
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          Absorb Pride for {p.playerName} ({p.apostle})
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {event.id === 'nero_blame' && (
            <div className="space-y-3 text-sm">
              <div className="text-xs text-rose-300">
                Global Persecution Track will drop by 2.
              </div>
              {jamesPlayer && (
                <div className="rounded-lg border border-rose-500/40 bg-rose-950/30 p-2.5">
                  <label className="flex items-center gap-2 cursor-pointer text-rose-300 font-semibold text-xs">
                    <input
                      type="checkbox"
                      checked={jamesAbsorb}
                      onChange={(e) => setJamesAbsorb(e.target.checked)}
                    />
                    <span>James&apos;s Martyr Override: James draws the imperial cohorts onto himself (+4 Heat to James; everyone else defies safely).</span>
                  </label>
                </div>
              )}

              {!jamesAbsorb && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-stone-300">
                    Individual Apostle Choices:
                  </div>
                  {livingPlayers.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-3 text-xs border-b border-stone-800 pb-1.5">
                      <span className="font-semibold text-stone-200">
                        {p.playerName} ({p.apostle})
                      </span>
                      <select
                        value={neroChoices[p.id] || 'defy'}
                        onChange={(e) =>
                          setNeroChoices({ ...neroChoices, [p.id]: e.target.value as 'hide' | 'defy' })
                        }
                        className="rounded border border-stone-700 bg-stone-900 px-2 py-1 text-stone-100"
                      >
                        <option value="defy">Defy Imperial Edict (+2 Heat)</option>
                        <option value="hide">Go Underground (Skip Next Turn)</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {event.id === 'judean_famine' && (
            <div className="space-y-3 text-sm">
              <div className="text-xs font-semibold text-stone-300">
                Choose sacrifice or self-preservation:
              </div>
              {livingPlayers.map((p) => {
                const canFeed = p.crowns >= 1;
                return (
                  <div key={p.id} className="flex items-center justify-between gap-3 text-xs border-b border-stone-800 pb-1.5">
                    <span className="font-semibold text-stone-200">
                      {p.playerName} ({p.apostle}) - {p.crowns} Crowns
                    </span>
                    <select
                      value={famineChoices[p.id] || 'pride'}
                      onChange={(e) =>
                        setFamineChoices({ ...famineChoices, [p.id]: e.target.value as 'pride' | 'crown' })
                      }
                      className="rounded border border-stone-700 bg-stone-900 px-2 py-1 text-stone-100"
                    >
                      <option value="pride">Feed Yourself (+1 Pride)</option>
                      <option value="crown" disabled={!canFeed}>
                        {canFeed ? 'Feed the Saints (-1 Crown)' : 'Cannot Feed Saints (0 Crowns)'}
                      </option>
                    </select>
                  </div>
                );
              })}
            </div>
          )}

          {event.id === 'macedonian_call' && (
            <div className="text-xs text-emerald-300 space-y-1">
              <p>The vision is clear: &quot;Come over to Macedonia and help us!&quot;</p>
              <p>Greece will receive +2 Seeds automatically.</p>
            </div>
          )}

          {event.id === 'pax_romana' && (
            <div className="space-y-3 text-sm">
              <div className="text-xs text-stone-300">
                Global Persecution Track increases by 1 (Safer).
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-stone-300">
                  Apostle Ministry Choices:
                </div>
                {livingPlayers.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 text-xs border-b border-stone-800 pb-1.5">
                    <span className="font-semibold text-stone-200">
                      {p.playerName} ({p.apostle})
                    </span>
                    <select
                      value={paxChoices[p.id] || 'evangelize'}
                      onChange={(e) =>
                        setPaxChoices({ ...paxChoices, [p.id]: e.target.value as 'sabbatical' | 'evangelize' })
                      }
                      className="rounded border border-stone-700 bg-stone-900 px-2 py-1 text-stone-100"
                    >
                      <option value="evangelize">Evangelize Boldly (+1 Heat, +1 Seed locally)</option>
                      <option value="sabbatical">Spiritual Sabbatical (-1 Pride, Skip Turn)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.id === 'the_judaizers' && (
            <div className="space-y-3 text-sm">
              <div className="text-xs text-stone-300">
                The province of <strong className="text-amber-300">{highestSeedRegion?.name || 'highest seeds'}</strong> is under theological attack and will lose 1 Seed.
              </div>
              {paulAnyLiving && (
                <div className="rounded-lg border border-blue-500/40 bg-blue-950/30 p-2.5">
                  <label className="flex items-center gap-2 cursor-pointer text-blue-300 font-semibold text-xs">
                    <input
                      type="checkbox"
                      checked={paulGalatians}
                      onChange={(e) => setPaulGalatians(e.target.checked)}
                    />
                    <span>Paul&apos;s Galatians Defense: Paul writes an aggressive epistle defending grace (+1 Pride to Paul, 0 seeds lost).</span>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end pt-2">
          <button
            id="btn-resolve-event"
            onClick={handleResolve}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 font-bold text-white shadow-lg transition-all hover:from-purple-500 hover:to-indigo-500 cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Resolve Decree</span>
          </button>
        </div>
      </div>
    </div>
  );
};

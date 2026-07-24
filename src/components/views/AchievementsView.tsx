import React from 'react';
import { GameState } from '../../types/game';
import { formatMoney } from '../../utils/formatters';
import { Trophy, CheckCircle2 } from 'lucide-react';

interface AchievementsViewProps {
  state: GameState;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ state }) => {
  const unlockedCount = state.achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Yutuqlar va Shon-Sharaf Zali</h2>
          <p className="text-sm text-slate-400">
            Imperiyaning muhim marralariga erishing, unvonlarni qo'lga kiriting va mukofot pullariga ega bo'ling.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ochilgan Yutuqlar</div>
            <div className="text-base font-black text-amber-400">
              {unlockedCount} / {state.achievements.length} Yutuqlar
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {state.achievements.map((ach) => {
          const pct = Math.min(100, Math.round((ach.progress / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-5 flex flex-col justify-between space-y-4 transition-all ${
                ach.unlocked
                  ? 'border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      ach.unlocked
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Trophy className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white">{ach.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                  </div>
                </div>

                {ach.unlocked && (
                  <span className="text-amber-400 text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Bajarilgan
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400 font-semibold">
                  <span>Jarayon ({pct}%)</span>
                  <span className="text-slate-300">Mukofot: {formatMoney(ach.rewardCash)}</span>
                </div>

                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      ach.unlocked ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

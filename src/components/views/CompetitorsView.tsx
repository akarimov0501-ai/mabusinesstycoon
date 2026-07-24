import React from 'react';
import { GameState } from '../../types/game';
import { formatMoney } from '../../utils/formatters';
import {
  Swords,
  CheckCircle2,
  Crown,
} from 'lucide-react';

interface CompetitorsViewProps {
  state: GameState;
  onAcquireCompetitor: (compId: string) => void;
}

export const CompetitorsView: React.FC<CompetitorsViewProps> = ({
  state,
  onAcquireCompetitor,
}) => {
  const currency = state.currency || 'USD';

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Raqobatchilar & Sindikat</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Korporatsiyalar bilan raqobatlashing yoki ularni sotib oling.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-3.5 py-2 flex items-center gap-3 self-start sm:self-auto">
          <Crown className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sotib Olingan</div>
            <div className="text-sm sm:text-base font-black text-amber-400">
              {state.competitors.filter((c) => c.isAcquired).length} / {state.competitors.length} Monopoliya
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {state.competitors.map((comp) => {
          const canAfford = state.cash >= comp.acquisitionCost;

          return (
            <div
              key={comp.id}
              className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-4 sm:p-6 flex flex-col justify-between space-y-3.5 transition-all ${
                comp.isAcquired
                  ? 'border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${comp.logoColor} flex items-center justify-center text-slate-950 font-black shadow-md shrink-0`}
                  >
                    <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-lg text-white">{comp.name}</h3>
                    <p className="text-[11px] sm:text-xs text-slate-400">CEO: {comp.ceo}</p>
                  </div>
                </div>

                {comp.isAcquired && (
                  <span className="text-amber-400 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Shuba
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <div className="text-slate-400 text-[11px]">Sohasi:</div>
                  <div className="font-bold text-slate-200 text-xs sm:text-sm mt-0.5">{comp.sector}</div>
                </div>

                <div>
                  <div className="text-slate-400 text-[11px]">Bozor Ulushi:</div>
                  <div className="font-bold text-amber-400 text-xs sm:text-sm mt-0.5">{comp.marketShare}%</div>
                </div>
              </div>

              {/* Takeover Button */}
              <div>
                {comp.isAcquired ? (
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-300 text-center font-bold text-xs border border-amber-500/20">
                    👑 Imperiyaga Qo'shib Olindi
                  </div>
                ) : (
                  <button
                    onClick={() => onAcquireCompetitor(comp.id)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 sm:py-3 px-3 rounded-2xl font-bold text-xs flex flex-wrap items-center justify-between gap-1 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Swords className="w-4 h-4 shrink-0" /> Sotib Olish
                    </span>
                    <span>{formatMoney(comp.acquisitionCost, currency)}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

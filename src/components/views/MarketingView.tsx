import React from 'react';
import { GameState } from '../../types/game';
import { formatMoney } from '../../utils/formatters';
import {
  Megaphone,
  Sparkles,
  Power,
} from 'lucide-react';

interface MarketingViewProps {
  state: GameState;
  onToggleMarketing: (mktId: string) => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({
  state,
  onToggleMarketing,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Marketing va PR Reklama</h2>
          <p className="text-sm text-slate-400">
            Kompaniya obro'si va sotuv hajmini oshirish uchun raqamli hamda an'anaviy reklamalarni ishga tushiring.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-4">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Brend Obro'si</div>
            <div className="text-base font-black text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {Math.round(state.reputation)}/100
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Mijozlar Sadoqati</div>
            <div className="text-base font-black text-emerald-400">{Math.round(state.customerSatisfaction)}%</div>
          </div>
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {state.marketing.map((mkt) => {
          return (
            <div
              key={mkt.id}
              className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-6 flex flex-col justify-between space-y-4 transition-all ${
                mkt.active
                  ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      mkt.active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{mkt.name}</h3>
                    <span className="text-[10px] font-bold text-amber-400 px-2.5 py-0.5 rounded-md bg-amber-500/10">
                      {mkt.type} Reklamasi
                    </span>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    mkt.active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {mkt.active ? "Faol" : "To'xtatilgan"}
                </div>
              </div>

              {/* Stats & Costs */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <div className="text-slate-400">Sotuv Ko'paytirgichi:</div>
                  <div className="font-bold text-emerald-400 text-sm mt-0.5">
                    +{Math.round((mkt.revenueMultiplier - 1) * 100)}% Daromad
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Kampaniya Xarajati:</div>
                  <div className="font-bold text-rose-400 text-sm mt-0.5">
                    -{formatMoney(mkt.costPerSec)}/sek
                  </div>
                </div>
              </div>

              {/* Action Toggle Button */}
              <button
                onClick={() => onToggleMarketing(mkt.id)}
                className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  mkt.active
                    ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{mkt.active ? 'Reklamani To\'xtatish' : 'Reklamani Ishga Tushirish'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

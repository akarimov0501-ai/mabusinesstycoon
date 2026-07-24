import React, { useState } from 'react';
import { GameState } from '../../types/game';
import { formatMoney } from '../../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Building,
} from 'lucide-react';

interface InvestmentsViewProps {
  state: GameState;
  onBuyStock: (id: string, shares: number) => void;
  onSellStock: (id: string, shares: number) => void;
  onBuyCrypto: (id: string, amount: number) => void;
  onSellCrypto: (id: string, amount: number) => void;
  onBuyRealEstate: (id: string) => void;
  onBuyRealEstateWithMortgage?: (id: string) => void;
}

export const InvestmentsView: React.FC<InvestmentsViewProps> = ({
  state,
  onBuyStock,
  onSellStock,
  onBuyCrypto,
  onSellCrypto,
  onBuyRealEstate,
  onBuyRealEstateWithMortgage,
}) => {
  const [tab, setTab] = useState<'stocks' | 'crypto' | 'real_estate'>('stocks');
  const currency = state.currency || 'USD';

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Moliya va Birja</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Kapitalni aksiyalar, kriptovalyuta va ko'chmas mulkka yo'naltiring.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-white/5 backdrop-blur-xl p-1 rounded-2xl border border-white/10 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setTab('stocks')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
              tab === 'stocks'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Aksiyalar
          </button>
          <button
            onClick={() => setTab('crypto')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
              tab === 'crypto'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kriptovalyuta
          </button>
          <button
            onClick={() => setTab('real_estate')}
            className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
              tab === 'real_estate'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ko'chmas Mulk
          </button>
        </div>
      </div>

      {/* Stocks Tab */}
      {tab === 'stocks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {state.stocks.map((st) => {
            const isUp = st.trend === 'up';
            const divYield = st.dividendYield ? (st.dividendYield * 100).toFixed(1) : undefined;

            return (
              <div
                key={st.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-sm sm:text-base text-white">{st.name}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 px-1.5 py-0.5 rounded-md bg-slate-800">
                        {st.symbol}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{st.sector} Sohasida</span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-sm sm:text-base text-white">{formatMoney(st.price, currency)}</div>
                    <div
                      className={`text-xs font-bold flex items-center justify-end gap-1 ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {isUp ? "+O'sishda" : "-Tushishda"}
                    </div>
                  </div>
                </div>

                {/* Portfolio Holding & Dividend info */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center flex-wrap gap-1">
                    <span className="text-slate-400">Egalik Qilingan:</span>
                    <span className="font-bold text-amber-400">{st.ownedShares} dona ({formatMoney(st.ownedShares * st.price, currency)})</span>
                  </div>
                  {divYield && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Dividend:</span>
                      <span className="font-bold text-emerald-400">+{divYield}% / Yillik</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSellStock(st.id, 10)}
                    disabled={st.ownedShares < 10}
                    className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    10 Sotish
                  </button>

                  <button
                    onClick={() => onBuyStock(st.id, 10)}
                    className="py-2 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20 transition-all cursor-pointer truncate"
                  >
                    10 Olish ({formatMoney(st.price * 10, currency)})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Crypto Tab */}
      {tab === 'crypto' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {state.crypto.map((cr) => {
            return (
              <div
                key={cr.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 shadow-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white">{cr.name}</h3>
                    <span className="text-xs font-mono text-purple-400 font-bold">{cr.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-sm sm:text-base text-white">{formatMoney(cr.price, currency)}</div>
                    <span className="text-[9px] text-amber-400 font-bold uppercase">Kripto Volatillik</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs flex justify-between items-center">
                  <span className="text-slate-400">Egalik Qilingan:</span>
                  <span className="font-bold text-purple-300">{cr.ownedTokens.toFixed(2)} {cr.symbol}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSellCrypto(cr.id, 1)}
                    disabled={cr.ownedTokens < 1}
                    className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    1 Sotish
                  </button>

                  <button
                    onClick={() => onBuyCrypto(cr.id, 1)}
                    className="py-2 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                  >
                    1 Sotib Olish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Real Estate Tab */}
      {tab === 'real_estate' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {state.realEstate.map((re) => {
            const canAffordCash = state.cash >= re.cost;
            const downRatio = re.downPaymentRatio ?? 0.25;
            const downPaymentCost = re.cost * downRatio;
            const canAffordMortgage = state.cash >= downPaymentCost;

            return (
              <div
                key={re.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-white">{re.name}</h3>
                    <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-xl bg-emerald-500/10 shrink-0">
                      Egalik: {re.ownedCount}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{re.location}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ijara Daromadi:</span>
                    <span className="font-bold text-emerald-400">+{formatMoney(re.monthlyIncome * (re.occupancyRate ?? 0.95), currency)}/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mulk Narxi (100%):</span>
                    <span className="font-bold text-slate-200">{formatMoney(re.cost, currency)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Ipoteka Boshlang'ich ({(downRatio * 100).toFixed(0)}%):</span>
                    <span className="font-bold text-blue-400">{formatMoney(downPaymentCost, currency)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Option 1: Buy with 100% Cash */}
                  <button
                    onClick={() => onBuyRealEstate(re.id)}
                    disabled={!canAffordCash}
                    className={`w-full py-2.5 px-3 rounded-2xl font-bold text-xs flex flex-wrap items-center justify-between gap-1 transition-all cursor-pointer ${
                      canAffordCash
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4 shrink-0" /> Naqd Xarid
                    </span>
                    <span>{formatMoney(re.cost, currency)}</span>
                  </button>

                  {/* Option 2: Buy with Bank Mortgage */}
                  {onBuyRealEstateWithMortgage && (
                    <button
                      onClick={() => onBuyRealEstateWithMortgage(re.id)}
                      disabled={!canAffordMortgage}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex flex-wrap items-center justify-between gap-1 transition-all cursor-pointer ${
                        canAffordMortgage
                          ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40'
                          : 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                      }`}
                    >
                      <span>🏦 Bank Ipotekasi ({(downRatio * 100).toFixed(0)}%)</span>
                      <span>{formatMoney(downPaymentCost, currency)}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

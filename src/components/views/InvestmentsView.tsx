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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Moliya va Investitsiya Birjasi</h2>
          <p className="text-sm text-slate-400">
            Erkin kapitalni aksiya, dividendlar, kriptovalyuta hamda ipoteka ko'chmas mulklariga yo'naltiring.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center bg-white/5 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setTab('stocks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'stocks'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Aksiyalar & Dividend
          </button>
          <button
            onClick={() => setTab('crypto')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'crypto'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kriptovalyuta
          </button>
          <button
            onClick={() => setTab('real_estate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'real_estate'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ko'chmas Mulk & Ipoteka
          </button>
        </div>
      </div>

      {/* Stocks Tab */}
      {tab === 'stocks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {state.stocks.map((st) => {
            const isUp = st.trend === 'up';
            const divYield = st.dividendYield ? (st.dividendYield * 100).toFixed(1) : undefined;

            return (
              <div
                key={st.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-white">{st.name}</span>
                      <span className="text-xs font-mono font-bold text-slate-400 px-2 py-0.5 rounded-md bg-slate-800">
                        {st.symbol}
                      </span>
                      {st.isIndexFund && (
                        <span className="text-[10px] font-bold text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                          Indeks ETF
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{st.sector} Sohasida</span>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-lg text-white">{formatMoney(st.price, currency)}</div>
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
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Egalik Qilingan Aksiyalar:</span>
                    <span className="font-bold text-amber-400">{st.ownedShares} dona ({formatMoney(st.ownedShares * st.price, currency)})</span>
                  </div>
                  {divYield && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Dividend Daromadorligi:</span>
                      <span className="font-bold text-emerald-400">+{divYield}% / Yillik</span>
                    </div>
                  )}
                  {st.peRatio && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">P/E Ko'rsatkichi:</span>
                      <span className="font-mono text-slate-300">{st.peRatio}x</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSellStock(st.id, 10)}
                    disabled={st.ownedShares < 10}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    10 Dona Sotish
                  </button>

                  <button
                    onClick={() => onBuyStock(st.id, 10)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    10 Dona Olish ({formatMoney(st.price * 10, currency)})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Crypto Tab */}
      {tab === 'crypto' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {state.crypto.map((cr) => {
            return (
              <div
                key={cr.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white">{cr.name}</h3>
                    <span className="text-xs font-mono text-purple-400 font-bold">{cr.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-base text-white">{formatMoney(cr.price, currency)}</div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Yuqori Tebranish</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs flex justify-between items-center">
                  <span className="text-slate-400">Egalik Qilingan Tokenlar:</span>
                  <span className="font-bold text-purple-300">{cr.ownedTokens.toFixed(2)} {cr.symbol}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSellCrypto(cr.id, 1)}
                    disabled={cr.ownedTokens < 1}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    1 Token Sotish
                  </button>

                  <button
                    onClick={() => onBuyCrypto(cr.id, 1)}
                    className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                  >
                    1 Token Sotib Olish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Real Estate Tab */}
      {tab === 'real_estate' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {state.realEstate.map((re) => {
            const canAffordCash = state.cash >= re.cost;
            const downRatio = re.downPaymentRatio ?? 0.25;
            const downPaymentCost = re.cost * downRatio;
            const canAffordMortgage = state.cash >= downPaymentCost;

            return (
              <div
                key={re.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base text-white">{re.name}</h3>
                    <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-xl bg-emerald-500/10">
                      Mavjud: {re.ownedCount} ta
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{re.location}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Oylik Ijara Daromadi:</span>
                    <span className="font-bold text-emerald-400">+{formatMoney(re.monthlyIncome * (re.occupancyRate ?? 0.95), currency)}/sek</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mulk Narxi (100%):</span>
                    <span className="font-bold text-slate-200">{formatMoney(re.cost, currency)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Ipoteka Boshlang'ich To'lov ({(downRatio * 100).toFixed(0)}%):</span>
                    <span className="font-bold text-blue-400">{formatMoney(downPaymentCost, currency)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Option 1: Buy with 100% Cash */}
                  <button
                    onClick={() => onBuyRealEstate(re.id)}
                    disabled={!canAffordCash}
                    className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                      canAffordCash
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Building className="w-4 h-4" /> 100% Naqd Xarid Qilish
                    </span>
                    <span>{formatMoney(re.cost, currency)}</span>
                  </button>

                  {/* Option 2: Buy with Bank Mortgage */}
                  {onBuyRealEstateWithMortgage && (
                    <button
                      onClick={() => onBuyRealEstateWithMortgage(re.id)}
                      disabled={!canAffordMortgage}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                        canAffordMortgage
                          ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40'
                          : 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                      }`}
                    >
                      <span>🏦 Bank Ipotekasi Bilan Xarid ({(downRatio * 100).toFixed(0)}%)</span>
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


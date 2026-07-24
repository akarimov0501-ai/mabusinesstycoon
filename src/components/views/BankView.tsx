import React, { useState } from 'react';
import { GameState, DetailedFinancials, BankLoan } from '../../types/game';
import { formatMoney, formatPercent } from '../../utils/formatters';
import { Landmark, ShieldCheck, CreditCard, ArrowUpRight, CheckCircle, Wallet } from 'lucide-react';

interface BankViewProps {
  state: GameState;
  financials: DetailedFinancials;
  onTakeLoan: (amount: number, termSec: number, loanType: BankLoan['loanType']) => void;
  onRepayLoan: (loanId: string) => void;
}

export function BankView({ state, financials, onTakeLoan, onRepayLoan }: BankViewProps) {
  const [customAmount, setCustomAmount] = useState<string>('10000');
  const [selectedTerm, setSelectedTerm] = useState<number>(300);

  const creditScore = state.creditScore || 650;
  const currency = state.currency || 'USD';

  // Credit Rating Tier calculation
  let creditTier = 'B';
  let tierColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  if (creditScore >= 800) {
    creditTier = 'AAA (A\'lo)';
    tierColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  } else if (creditScore >= 740) {
    creditTier = 'AA (Juda yaxshi)';
    tierColor = 'text-teal-400 border-teal-500/30 bg-teal-500/10';
  } else if (creditScore >= 680) {
    creditTier = 'A (Yaxshi)';
    tierColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
  } else if (creditScore >= 620) {
    creditTier = 'BBB (O\'rtacha)';
    tierColor = 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
  } else if (creditScore >= 550) {
    creditTier = 'BB (Kichik Xavf)';
    tierColor = 'text-orange-400 border-orange-500/30 bg-orange-500/10';
  } else {
    creditTier = 'D (Yuqori Xavf)';
    tierColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  }

  // Max loan limit formula based on credit score and net worth
  const maxLoanLimit = Math.max(5000, financials.netWorth * 1.5 * (creditScore / 600));
  const activeLoans = state.loans || [];

  const handleCustomLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(customAmount);
    if (!isNaN(num) && num > 0) {
      if (num > maxLoanLimit) {
        alert(`Maksimal ruxsat berilgan kredit miqdori: ${formatMoney(maxLoanLimit, currency)}`);
        return;
      }
      let type: BankLoan['loanType'] = 'micro';
      if (num > 1000000) type = 'line_of_credit';
      else if (num > 100000) type = 'commercial';
      onTakeLoan(num, selectedTerm, type);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-4 sm:p-6 rounded-3xl border border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden sm:block">
          <Landmark className="w-64 h-64 text-blue-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5">
              <Landmark className="w-4 h-4" />
              <span>Markaziy Xalqaro Moliya & Kredit Tizimi</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white">Bank va Kredit Markazi</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Imtiyozli kreditlar orqali biznesingizni kengaytiring va kredit reytingingizni oshiring.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            <div className="bg-slate-900/80 border border-slate-800 p-2.5 sm:p-3 px-3.5 sm:px-4 rounded-2xl flex-1 sm:flex-initial">
              <span className="text-[10px] sm:text-xs text-slate-400 block">MB Stavkasi</span>
              <span className="text-base sm:text-lg font-bold text-emerald-400">{formatPercent(state.centralBankRate || 0.085)}</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-2.5 sm:p-3 px-3.5 sm:px-4 rounded-2xl flex-1 sm:flex-initial">
              <span className="text-[10px] sm:text-xs text-slate-400 block">Inflyatsiya</span>
              <span className="text-base sm:text-lg font-bold text-amber-400">{formatPercent(state.inflationRate || 0.038)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Score & Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Credit Score Gauge Card */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 sm:p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Kredit Reytingi
              </span>
              <span className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full border font-bold ${tierColor}`}>
                {creditTier}
              </span>
            </div>

            <div className="text-center py-3">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">{creditScore}</div>
              <div className="text-[11px] text-slate-400 mt-1">300 va 850 oralig'ida</div>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden my-3 relative">
              <div
                className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, ((creditScore - 300) / 550) * 100)}%` }}
              />
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between">
            <span>Kredit Limit:</span>
            <span className="font-semibold text-white">{formatMoney(maxLoanLimit, currency)}</span>
          </div>
        </div>

        {/* Total Debt & Servicing Card */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 sm:p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-rose-400" />
                Faol Qarzdorlik
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {activeLoans.length} ta kredit
              </span>
            </div>

            <div className="py-2">
              <span className="text-xs text-slate-400">Umumiy bank qarzi</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">{formatMoney(financials.totalDebt, currency)}</div>
            </div>

            <div className="py-2 border-t border-slate-800/60 mt-1">
              <span className="text-xs text-slate-400">Soniyadagi to'lov</span>
              <div className="text-base sm:text-lg font-bold text-amber-400">-{formatMoney(financials.loanPayments, currency)}/s</div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
            * To'lovlar avtomatik yechiladi.
          </div>
        </div>

        {/* Custom Loan Calculator Card */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-4 sm:p-6 rounded-3xl flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <form onSubmit={handleCustomLoanSubmit} className="space-y-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              Tezkor Kredit Olish
            </span>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Mablag' summasi ($)</label>
              <input
                type="number"
                min="100"
                max={Math.floor(maxLoanLimit)}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Qaytarish muddati</label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value={150}>150 sek (Qisqa muddatli)</option>
                <option value={300}>300 sek (O'rta muddatli)</option>
                <option value={600}>600 sek (Uzoq muddatli)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              Kreditni Tasdiqlash
            </button>
          </form>
        </div>
      </div>

      {/* Preset Loan Offers */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Mavjud Bank Kredit Dasturlari</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Preset 1: Micro */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Kichik Biznes Kredit</div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{formatMoney(10000, currency)}</h3>
              <p className="text-xs text-slate-400 mt-1.5">Dastlabki savdo shoxobchalari va uskunalar uchun tezkor ssuda.</p>

              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Yillik stavka:</span>
                  <span className="font-semibold text-emerald-400">~{formatPercent((state.centralBankRate || 0.085) + 0.04)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Muddat:</span>
                  <span>300 sek</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onTakeLoan(10000, 300, 'micro')}
              className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              10,000 $ Kredit Olish
            </button>
          </div>

          {/* Preset 2: Commercial */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Tijorat Rivojlanish Krediti</div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{formatMoney(250000, currency)}</h3>
              <p className="text-xs text-slate-400 mt-1.5">Kompaniya tarmog'ini kengaytirish va yangi mamlakatlarga chiqish uchun.</p>

              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Yillik stavka:</span>
                  <span className="font-semibold text-blue-400">~{formatPercent((state.centralBankRate || 0.085) + 0.03)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Muddat:</span>
                  <span>450 sek</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onTakeLoan(250000, 450, 'commercial')}
              className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              250,000 $ Kredit Olish
            </button>
          </div>

          {/* Preset 3: Corporate Line */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition sm:col-span-2 lg:col-span-1">
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Korporativ Kredit Liniyasi</div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{formatMoney(5000000, currency)}</h3>
              <p className="text-xs text-slate-400 mt-1.5">Yirik zavodlar va osmon o'par binolar sotib olish uchun sindikat kredit.</p>

              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Yillik stavka:</span>
                  <span className="font-semibold text-purple-400">~{formatPercent((state.centralBankRate || 0.085) + 0.02)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Muddat:</span>
                  <span>600 sek</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onTakeLoan(5000000, 600, 'line_of_credit')}
              className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              5,000,000 $ Kredit Olish
            </button>
          </div>
        </div>
      </div>

      {/* Active Loans Table */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-6 rounded-3xl">
        <h2 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center justify-between">
          <span>Sizning Faol Kreditlaringiz</span>
          <span className="text-xs text-slate-400 font-normal">{activeLoans.length} ta faol shartnoma</span>
        </h2>

        {activeLoans.length === 0 ? (
          <div className="text-center py-8 sm:py-10 border border-dashed border-slate-800 rounded-2xl p-4">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400/50 mx-auto mb-2" />
            <p className="text-slate-400 text-xs sm:text-sm font-medium">Sizda faol bank kreditlari mavjud emas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeLoans.map((loan) => {
              const progress = Math.min(100, Math.max(0, ((loan.amount - loan.remainingAmount) / loan.amount) * 100));

              return (
                <div
                  key={loan.id}
                  className="bg-slate-950 border border-slate-800/80 p-3.5 sm:p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                >
                  <div className="space-y-1 w-full md:w-auto">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-xs sm:text-sm">{loan.name}</span>
                      <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold uppercase">
                        {loan.loanType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                      <span>Qolgan: <strong className="text-rose-400">{formatMoney(loan.remainingAmount, currency)}</strong></span>
                      <span>Stavka: <strong className="text-emerald-400">{formatPercent(loan.interestRate)}</strong></span>
                    </div>
                  </div>

                  <div className="w-full md:w-48 space-y-1">
                    <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-400">
                      <span>To'lov jarayoni</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onRepayLoan(loan.id)}
                    disabled={state.cash < loan.remainingAmount}
                    className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    Yopish ({formatMoney(loan.remainingAmount, currency)})
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

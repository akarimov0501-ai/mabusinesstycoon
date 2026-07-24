import React from 'react';
import { GameState, DetailedFinancials } from '../../types/game';
import { formatMoney, formatPercent } from '../../utils/formatters';
import { X, TrendingUp, FileText } from 'lucide-react';

interface FinancialReportModalProps {
  state: GameState;
  financials: DetailedFinancials;
  onClose: () => void;
}

export function FinancialReportModal({ state, financials, onClose }: FinancialReportModalProps) {
  const currency = state.currency || 'USD';

  const grossRev = financials.grossRevenue;
  const netProfit = financials.netProfitPerSec;

  const profitMargin = grossRev > 0 ? (netProfit / grossRev) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white leading-tight">Moliyaviy Hisobot (P&L)</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Daromad va xarajatlar tahlili</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-full transition cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-xs sm:text-sm">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 border border-slate-800 p-3 sm:p-4 rounded-2xl">
              <span className="text-[10px] sm:text-xs text-slate-400">Yalpi Tushum</span>
              <div className="text-base sm:text-xl font-black text-emerald-400 mt-0.5 truncate">+{formatMoney(grossRev, currency)}/s</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 sm:p-4 rounded-2xl">
              <span className="text-[10px] sm:text-xs text-slate-400">Umumiy Xarajatlar</span>
              <div className="text-base sm:text-xl font-black text-rose-400 mt-0.5 truncate">-{formatMoney(financials.totalExpenses, currency)}/s</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 sm:p-4 rounded-2xl">
              <span className="text-[10px] sm:text-xs text-slate-400">Sof Marja</span>
              <div className={`text-base sm:text-xl font-black mt-0.5 ${profitMargin >= 0 ? 'text-blue-400' : 'text-rose-500'}`}>
                {profitMargin.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
            <div className="p-3 sm:p-4 bg-slate-900/60 border-b border-slate-800 font-bold text-slate-300 text-[10px] sm:text-xs uppercase tracking-wider">
              Batafsil Daromad va Xarajat Moddalari
            </div>

            <div className="divide-y divide-slate-800/60 text-xs">
              {/* Income */}
              <div className="p-3 flex justify-between items-center bg-emerald-950/10">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  Yalpi Biznes & Investitsiya Tushumi
                </span>
                <span className="font-bold text-emerald-400">+{formatMoney(grossRev, currency)}</span>
              </div>

              {financials.stockDividendRevenue > 0 && (
                <div className="p-3 pl-6 flex justify-between items-center text-[11px] text-slate-300">
                  <span className="text-slate-400">• Dividendlar Tushumi</span>
                  <span className="font-mono text-emerald-400">+{formatMoney(financials.stockDividendRevenue, currency)}</span>
                </div>
              )}

              {/* COGS */}
              <div className="p-3 flex justify-between items-center text-[11px] text-slate-300">
                <span>• Mahsulot va Xizmatlar Tannarxi</span>
                <span className="font-mono text-rose-400 font-medium">-{formatMoney(financials.cogsExpenses, currency)}</span>
              </div>

              {/* Employees */}
              <div className="p-3 flex justify-between items-center text-[11px] text-slate-300">
                <span>• Xodimlar Oyligi & Soliq</span>
                <span className="font-mono text-rose-400 font-medium">-{formatMoney(financials.employeeExpenses, currency)}</span>
              </div>

              {/* Rent & Upkeep */}
              <div className="p-3 flex justify-between items-center text-[11px] text-slate-300">
                <span>• Bino Ijarasi & Mulk Solig'i</span>
                <span className="font-mono text-rose-400 font-medium">-{formatMoney(financials.rentExpenses, currency)}</span>
              </div>

              {/* Maintenance */}
              {financials.maintenanceExpenses > 0 && (
                <div className="p-3 flex justify-between items-center text-[11px] text-slate-300">
                  <span>• Uskunalar Ta'miri</span>
                  <span className="font-mono text-amber-400 font-medium">-{formatMoney(financials.maintenanceExpenses, currency)}</span>
                </div>
              )}

              {/* Marketing */}
              {financials.marketingExpenses > 0 && (
                <div className="p-3 flex justify-between items-center text-[11px] text-slate-300">
                  <span>• Reklama Kampaniyalari</span>
                  <span className="font-mono text-rose-400 font-medium">-{formatMoney(financials.marketingExpenses, currency)}</span>
                </div>
              )}

              {/* Bank Loans */}
              {financials.loanPayments > 0 && (
                <div className="p-3 flex justify-between items-center text-[11px] bg-rose-950/10">
                  <span className="text-rose-400 font-semibold">• Bank Kredit Foizi & To'lovi</span>
                  <span className="font-mono text-rose-400 font-bold">-{formatMoney(financials.loanPayments, currency)}</span>
                </div>
              )}

              {/* Taxes */}
              <div className="p-3 flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-800">
                <span>• Korporativ Foyda Solig'i ({formatPercent(financials.effectiveTax)})</span>
                <span className="font-mono text-amber-400 font-medium">-{formatMoney(financials.taxes, currency)}</span>
              </div>

              {/* Net Result */}
              <div className="p-3.5 flex justify-between items-center bg-slate-900 border-t-2 border-slate-800">
                <span className="font-extrabold text-white text-xs sm:text-sm">Sof Daromad (Net Cash Flow)</span>
                <span className={`text-sm sm:text-lg font-black ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {netProfit >= 0 ? '+' : ''}{formatMoney(netProfit, currency)}/s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-5 rounded-xl text-xs transition cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}

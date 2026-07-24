import React from 'react';
import { GameState, DetailedFinancials } from '../../types/game';
import { formatMoney, formatPercent } from '../../utils/formatters';
import { X, TrendingUp, TrendingDown, DollarSign, FileText, PieChart, ShieldAlert, Award } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Moliyaviy Natijalar Hisoboti (P&L)</h2>
              <p className="text-xs text-slate-400">Real vaqt rejimida daromad va xarajatlar tahlili</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Yalpi Tushum (Gross Revenue)</span>
              <div className="text-xl font-black text-emerald-400 mt-1">{formatMoney(grossRev, currency)}/sek</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Umumiy Xarajatlar</span>
              <div className="text-xl font-black text-rose-400 mt-1">{formatMoney(financials.totalExpenses, currency)}/sek</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Sof Marja (Profit Margin)</span>
              <div className={`text-xl font-black mt-1 ${profitMargin >= 0 ? 'text-blue-400' : 'text-rose-500'}`}>
                {profitMargin.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
            <div className="p-4 bg-slate-900/60 border-b border-slate-800 font-bold text-slate-300 text-xs uppercase tracking-wider">
              Batafsil Daromad va Xarajat Moddalari
            </div>

            <div className="divide-y divide-slate-800/60">
              {/* Income */}
              <div className="p-3.5 flex justify-between items-center bg-emerald-950/10">
                <span className="font-semibold text-emerald-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Yalpi Biznes va Investitsiya Tushumi
                </span>
                <span className="font-bold text-emerald-400">+{formatMoney(grossRev, currency)}</span>
              </div>

              {financials.stockDividendRevenue > 0 && (
                <div className="p-3.5 pl-8 flex justify-between items-center text-xs text-slate-300">
                  <span className="text-slate-400">• Aksiyalardan kelgan Dividendlar</span>
                  <span className="font-mono text-emerald-400">+{formatMoney(financials.stockDividendRevenue, currency)}</span>
                </div>
              )}

              {/* COGS */}
              <div className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-300">• Mahsulot va Xizmatlar Tannarxi (COGS)</span>
                <span className="font-mono text-rose-400 font-medium">-{formatMoney(financials.cogsExpenses, currency)}</span>
              </div>

              {/* Employees */}
              <div className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-300">• Xodimlar Oylik Maoshi va Mehnat Solig'i</span>
                <span className="font-mono text-rose-400 font-medium">-{formatMoney(financials.employeeExpenses, currency)}</span>
              </div>

              {/* Rent & Upkeep */}
              <div className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-300">• Bino Ijarasi va Ko'chmas Mulk Solig'i</span>
                <span className="font-mono text-rose-400 font-medium">-{formatMoney(financials.rentExpenses, currency)}</span>
              </div>

              {/* Maintenance */}
              {financials.maintenanceExpenses > 0 && (
                <div className="p-3.5 flex justify-between items-center text-xs">
                  <span className="text-slate-300">• Uskunalar va Asbob-uskuna Ta'miri</span>
                  <span className="font-mono text-amber-400 font-medium">-{formatMoney(financials.maintenanceExpenses, currency)}</span>
                </div>
              )}

              {/* Marketing */}
              {financials.marketingExpenses > 0 && (
                <div className="p-3.5 flex justify-between items-center text-xs">
                  <span className="text-slate-300">• Reklama va Marketing Kampaniyalari</span>
                  <span className="font-mono text-rose-400 font-medium">-{formatMoney(financials.marketingExpenses, currency)}</span>
                </div>
              )}

              {/* Bank Loans */}
              {financials.loanPayments > 0 && (
                <div className="p-3.5 flex justify-between items-center text-xs bg-rose-950/10">
                  <span className="text-slate-300 font-semibold text-rose-400">• Bank Kredit Foizi va Qarzlarni Uzish</span>
                  <span className="font-mono text-rose-400 font-bold">-{formatMoney(financials.loanPayments, currency)}</span>
                </div>
              )}

              {/* Taxes */}
              <div className="p-3.5 flex justify-between items-center text-xs border-t border-slate-800">
                <span className="text-slate-400">Korporativ Foyda Solig'i (Stavka: {formatPercent(financials.effectiveTax)})</span>
                <span className="font-mono text-amber-400 font-medium">-{formatMoney(financials.taxes, currency)}</span>
              </div>

              {/* Net Result */}
              <div className="p-4 flex justify-between items-center bg-slate-900 border-t-2 border-slate-800">
                <span className="font-extrabold text-white">Sof Daromad (Net Cash Flow)</span>
                <span className={`text-lg font-black ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {netProfit >= 0 ? '+' : ''}{formatMoney(netProfit, currency)}/sek
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-xl text-xs transition"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}

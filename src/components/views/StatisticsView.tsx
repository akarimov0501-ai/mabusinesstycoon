import React from 'react';
import { GameState } from '../../types/game';
import { formatMoney } from '../../utils/formatters';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface StatisticsViewProps {
  state: GameState;
  financials: {
    grossRevenue: number;
    totalExpenses: number;
    netProfitPerSec: number;
    netWorth: number;
    taxes: number;
  };
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  state,
  financials,
}) => {
  const currency = state.currency || 'USD';

  // Sector distribution data
  const sectorMap: Record<string, number> = {};
  state.businesses.forEach((b) => {
    if (b.level > 0) {
      const rev = b.baseRevenue * b.level;
      sectorMap[b.category] = (sectorMap[b.category] || 0) + rev;
    }
  });

  const sectorData = Object.entries(sectorMap).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Statistika va Analitika</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real vaqtdagi balans va pul oqimi grafiklari.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-3.5 py-2 flex items-center gap-3 self-start sm:self-auto">
          <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Umumiy Kapital</div>
            <div className="text-sm sm:text-base font-black text-emerald-400">{formatMoney(financials.netWorth, currency)}</div>
          </div>
        </div>
      </div>

      {/* Financial Statement Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 sm:p-4 space-y-1">
          <span className="text-[11px] sm:text-xs text-slate-400">Yalpi Daromad / s</span>
          <div className="text-base sm:text-xl font-black text-emerald-400 truncate">+{formatMoney(financials.grossRevenue, currency)}/s</div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 sm:p-4 space-y-1">
          <span className="text-[11px] sm:text-xs text-slate-400">Xarajatlar / s</span>
          <div className="text-base sm:text-xl font-black text-rose-400 truncate">-{formatMoney(financials.totalExpenses, currency)}/s</div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 sm:p-4 space-y-1">
          <span className="text-[11px] sm:text-xs text-slate-400">Soliqlar / s</span>
          <div className="text-base sm:text-xl font-black text-slate-300 truncate">-{formatMoney(financials.taxes, currency)}/s</div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 sm:p-4 space-y-1">
          <span className="text-[11px] sm:text-xs text-slate-400">Sof Foyda / s</span>
          <div className="text-base sm:text-xl font-black text-cyan-400 truncate">+{formatMoney(financials.netProfitPerSec, currency)}/s</div>
        </div>
      </div>

      {/* Cash Flow History Graph */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 space-y-4 shadow-lg">
        <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" /> Kapital Tarixi (Jonli Grafik)
        </h3>

        <div className="h-52 sm:h-64 w-full">
          {state.history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.history}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => formatMoney(v, currency)} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [formatMoney(val as number, currency), 'Qiymat']}
                />
                <Area type="monotone" dataKey="netWorth" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="Kapital" />
                <Area type="monotone" dataKey="cash" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} name="Naqd" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs sm:text-sm">
              Moliya nuqtalari yig'ilmoqda...
            </div>
          )}
        </div>
      </div>

      {/* Sector Revenue Breakdown Bar Chart */}
      {sectorData.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 space-y-4 shadow-lg">
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" /> Sohalar Daromadi (/sek)
          </h3>

          <div className="h-48 sm:h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => formatMoney(v, currency)} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [formatMoney(val as number, currency), 'Daromad/s']}
                />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

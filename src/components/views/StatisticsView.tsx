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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Moliya va Analitika Hisobotlari</h2>
          <p className="text-sm text-slate-400">
            Real vaqtdagi balans ko'rsatkichlari, daromad manbalari va oylik pul oqimi grafiklari.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Umumiy Kapital</div>
            <div className="text-base font-black text-emerald-400">{formatMoney(financials.netWorth)}</div>
          </div>
        </div>
      </div>

      {/* Financial Statement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Yalpi Daromad / sek</span>
          <div className="text-xl font-black text-emerald-400">+{formatMoney(financials.grossRevenue)}/sek</div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Operatsion Xarajatlar / sek</span>
          <div className="text-xl font-black text-rose-400">-{formatMoney(financials.totalExpenses)}/sek</div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Soliq To'lovlari / sek</span>
          <div className="text-xl font-black text-slate-300">-{formatMoney(financials.taxes)}/sek</div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Sof Foyda Marjasi / sek</span>
          <div className="text-xl font-black text-cyan-400">+{formatMoney(financials.netProfitPerSec)}/sek</div>
        </div>
      </div>

      {/* Cash Flow History Graph */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-lg">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" /> Kapital va Naqd Pul Tarixi (Jonli Grafik)
        </h3>

        <div className="h-64 w-full">
          {state.history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.history}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => formatMoney(v)} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [formatMoney(val as number), 'Qiymat']}
                />
                <Area type="monotone" dataKey="netWorth" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="Umumiy Kapital" />
                <Area type="monotone" dataKey="cash" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} name="Naqd Pul" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Moliya nuqtalari yig'ilmoqda...
            </div>
          )}
        </div>
      </div>

      {/* Sector Revenue Breakdown Bar Chart */}
      {sectorData.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-lg">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" /> Sohalar Bo'yicha Daromad Ulushi ($/sek)
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => formatMoney(v)} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [formatMoney(val as number), 'Daromad/sek']}
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

import React, { useState } from 'react';
import { GameState } from '../../types/game';
import { formatMoney, formatNumber } from '../../utils/formatters';
import {
  Zap,
  Coins,
  TrendingUp,
  Building2,
  Users,
  Globe,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CupSoda,
  Gift,
  Briefcase,
  Dices,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

interface DashboardViewProps {
  state: GameState;
  financials: {
    grossRevenue: number;
    totalExpenses: number;
    netProfitPerSec: number;
    netWorth: number;
    taxes: number;
    effectiveTax: number;
  };
  onTap: () => void;
  onNavigate: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  financials,
  onTap,
  onNavigate,
}) => {
  const activeBusinessesCount = state.businesses.filter((b) => b.level > 0).length;
  const activeCountriesCount = state.countries.filter((c) => c.isUnlocked).length;
  const totalEmployeesCount = state.employees.reduce((acc, e) => acc + e.count, 0);
  const currency = state.currency || 'USD';

  // Mini-game states: Omad g'ildiragi (Lucky Wheel) & VIP Muzokara
  const [spinMsg, setSpinMsg] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [dealStatus, setDealStatus] = useState<string | null>(null);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinMsg("G'ildirak aylanmoqda...");

    setTimeout(() => {
      setIsSpinning(false);
      // Scaled prize based on net worth or moderate cap
      const basePrize = Math.max(50, Math.min(2500, Math.floor(state.netWorth * 0.01)));
      const prizes = [
        { type: 'cash', amount: basePrize, label: `${formatMoney(basePrize, currency)} Naqd mukofot!` },
        { type: 'cash', amount: basePrize * 2, label: `${formatMoney(basePrize * 2, currency)} Grand mukofot!` },
        { type: 'cash', amount: basePrize * 4, label: `${formatMoney(basePrize * 4, currency)} Super Jekpot!` },
        { type: 'rp', amount: 50, label: "+50 Ilmiy Ball (RP)!" },
        { type: 'rp', amount: 150, label: "+150 VIP Ilmiy Ball (RP)!" },
      ];
      const win = prizes[Math.floor(Math.random() * prizes.length)];
      if (win.type === 'cash') {
        state.cash += win.amount;
        state.netWorth += win.amount;
      } else {
        state.researchPoints += win.amount;
      }
      setSpinMsg(`Siz yutdingiz: ${win.label}`);
    }, 1200);
  };

  const handleNegotiateDeal = (riskLevel: 'safe' | 'medium' | 'high') => {
    let successChance = 0.9;
    const baseReward = Math.max(100, Math.min(5000, Math.floor(state.netWorth * 0.02)));
    let reward = baseReward;
    if (riskLevel === 'medium') {
      successChance = 0.6;
      reward = baseReward * 3;
    } else if (riskLevel === 'high') {
      successChance = 0.35;
      reward = baseReward * 8;
    }

    const roll = Math.random();
    if (roll <= successChance) {
      state.cash += reward;
      state.netWorth += reward;
      setDealStatus(`Muvaffaqiyatli muzokara! Siz +${formatMoney(reward, currency)} foyda oldingiz!`);
    } else {
      setDealStatus("Muzokara omadsiz yakunlandi. Investor boshqa sherik tanladi.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Ticker Tape */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 overflow-hidden shadow-lg">
        <div className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BOZOR XABARLARI</span>
        </div>
        <div className="text-xs text-slate-300 font-medium truncate">
          <span className="text-slate-400">Bozor Trendi: </span>
          <span className="text-amber-400 font-bold">{state.marketTrend} Bozor</span> |{' '}
          <span className="text-slate-400">MB Stavkasi: </span>
          <span className="text-emerald-400 font-bold">{((state.centralBankRate || 0.085) * 100).toFixed(1)}%</span> |{' '}
          <span className="text-slate-400">Inflyatsiya: </span>
          <span className="text-cyan-400 font-bold">{(state.inflationRate * 100).toFixed(1)}%</span> |{' '}
          <span className="text-slate-400">Kredit Reytingi: </span>
          <span className="text-emerald-400 font-bold">{state.creditScore || 650} Score</span>
        </div>
      </div>

      {/* Top Banner & Quick Booster Button */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome & Fast Booster Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="space-y-2 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Bosh Qarorgoh - Toshkent Bosh Ofisi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              $100 Milliardlik Imperiyangizni Boshlang
            </h2>
            <p className="text-slate-300 text-sm max-w-xl">
              Ko'p tarmoqli kompaniyalarni boshqaring, 7 ta mamlakatda filiallarni oching, malakali mutaxassislarni yollang va birjani zabt eting.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 relative z-10">
            <button
              id="tap-booster-btn"
              onClick={onTap}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center gap-2.5 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <CupSoda className="w-5 h-5" />
              <span>Salqin Ichimliklar Boost (+{formatMoney(state.tapEarnings)})</span>
            </button>

            <button
              onClick={() => onNavigate('businesses')}
              className="px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 border border-slate-700/60 transition-colors"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Bizneslarni Boshqarish</span>
            </button>
          </div>
        </div>

        {/* Quick Empire Pulse Stats */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            Imperiya Moliya Holati
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" /> Yalpi Daromad:
              </span>
              <span className="font-bold text-emerald-400">+{formatMoney(financials.grossRevenue)}/sek</span>
            </div>

            <div className="flex justify-between items-center text-sm p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-400" /> Operatsion Xarajatlar:
              </span>
              <span className="font-bold text-rose-400">-{formatMoney(financials.totalExpenses)}/sek</span>
            </div>

            <div className="flex justify-between items-center text-sm p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Korporativ Soliq ({(financials.effectiveTax * 100).toFixed(0)}%):
              </span>
              <span className="font-bold text-slate-300">-{formatMoney(financials.taxes)}/sek</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini-Games Section: Lucky Wheel & VIP Contract Negotiation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lucky Wheel Card */}
        <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/20 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Omad G'ildiragi (Kunlik Bonus)</h4>
                <p className="text-xs text-slate-400">Aylantiring va instant naqd pul va RP mukofotlarini oling!</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center space-y-3">
            <div className="text-3xl font-black text-purple-400 tracking-wider animate-pulse flex items-center gap-2">
              <Dices className="w-8 h-8 text-amber-400" />
              <span>SPIN & WIN</span>
            </div>
            {spinMsg && (
              <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {spinMsg}
              </div>
            )}
            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSpinning ? "Aylanmoqda..." : "Omadni Sinash (Aylantirish)"}
            </button>
          </div>
        </div>

        {/* VIP Deal Negotiation Card */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">VIP Investor Muzokaralari</h4>
                <p className="text-xs text-slate-400">Eksklyuziv shartnoma. Xavf va mukofot darajasini tanlang!</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            {dealStatus && (
              <div className="text-xs font-semibold p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {dealStatus}
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleNegotiateDeal('safe')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-center space-y-1 transition-all cursor-pointer"
              >
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Xavfsiz</div>
                <div className="text-xs font-extrabold text-white">+$10,000</div>
                <div className="text-[9px] text-slate-400">90% imkoniyat</div>
              </button>

              <button
                onClick={() => handleNegotiateDeal('medium')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-center space-y-1 transition-all cursor-pointer"
              >
                <div className="text-[10px] text-amber-400 font-bold uppercase">O'rtacha</div>
                <div className="text-xs font-extrabold text-white">+$50,000</div>
                <div className="text-[9px] text-slate-400">60% imkoniyat</div>
              </button>

              <button
                onClick={() => handleNegotiateDeal('high')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-rose-500/30 text-center space-y-1 transition-all cursor-pointer"
              >
                <div className="text-[10px] text-rose-400 font-bold uppercase">Yuqori Xavf</div>
                <div className="text-xs font-extrabold text-white">+$250,000</div>
                <div className="text-[9px] text-slate-400">35% imkoniyat</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-1 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Umumiy Kapital</div>
          <div className="text-lg sm:text-2xl font-black text-cyan-400 tracking-tight">
            {formatMoney(financials.netWorth)}
          </div>
          <div className="text-[11px] text-slate-500">Aktivlar va Naqd Pul</div>
        </div>

        {/* Total Earned */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-1 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Jami Topilgan Foyda</div>
          <div className="text-lg sm:text-2xl font-black text-emerald-400 tracking-tight">
            {formatMoney(state.totalEarned)}
          </div>
          <div className="text-[11px] text-slate-500">Umumiy yaratilgan qiymat</div>
        </div>

        {/* Global Workforce */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-1 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Xodimlar Soni</div>
          <div className="text-lg sm:text-2xl font-black text-amber-400 tracking-tight">
            {formatNumber(totalEmployeesCount)} kishi
          </div>
          <div className="text-[11px] text-slate-500">Kayfiyat: {Math.round(state.employeeHappiness)}%</div>
        </div>

        {/* Research Points */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-1 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Ilmiy Ballar</div>
          <div className="text-lg sm:text-2xl font-black text-purple-400 tracking-tight">
            {formatNumber(Math.floor(state.researchPoints))} RP
          </div>
          <div className="text-[11px] text-slate-500">Texnologiyalar uchun mavjud</div>
        </div>
      </div>

      {/* Quick Access Navigation Modules */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg text-white tracking-tight">Imperiya Strategik Modullari</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('businesses')}
            className="group bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 rounded-2xl p-4 text-left transition-all space-y-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200 flex items-center justify-between">
                <span>Bizneslar</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {activeBusinessesCount} ta faol biznes tarmog'i mavjud.
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('employees')}
            className="group bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 rounded-2xl p-4 text-left transition-all space-y-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200 flex items-center justify-between">
                <span>HR va Xodimlar</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Menejerlar, dasturchilar va trening dasturlari.
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('investments')}
            className="group bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 rounded-2xl p-4 text-left transition-all space-y-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200 flex items-center justify-between">
                <span>Investitsiya va Birja</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Aksiyalar, Kripto, Oltin va Ko'chmas mulk.
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('world')}
            className="group bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 rounded-2xl p-4 text-left transition-all space-y-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-200 flex items-center justify-between">
                <span>Dunyo Xaritasi</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {activeCountriesCount}/7 Davlatlar ochilgan.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { GameState, DetailedFinancials, LuxuryCategory, LuxuryAsset, ForbesEntry } from '../../types/game';
import { formatMoney } from '../../utils/formatters';
import { FORBES_NPC_LIST } from '../../data/luxuryAssets';
import {
  Crown,
  Car,
  Home,
  Building,
  Landmark,
  Plane,
  Ship,
  Palette,
  Gem,
  Globe,
  Rocket,
  Sparkles,
  DollarSign,
  Wallet,
  Award,
  ArrowRightLeft,
  CheckCircle2,
  TrendingUp,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface LuxuryViewProps {
  state: GameState;
  financials: DetailedFinancials;
  onBuyAsset: (id: string, count?: number) => void;
  onSellAsset: (id: string, count?: number) => void;
  onPayDividend: (amount: number) => void;
  onSetCeoSalary: (salaryPerSec: number) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Car,
  Home,
  Building,
  Landmark,
  Plane,
  Ship,
  Palette,
  Crown,
  Gem,
  Globe,
  Rocket,
  Sparkles,
};

export const LuxuryView: React.FC<LuxuryViewProps> = ({
  state,
  financials,
  onBuyAsset,
  onSellAsset,
  onPayDividend,
  onSetCeoSalary,
}) => {
  const currency = state.currency || 'USD';
  const [activeTab, setActiveTab] = useState<LuxuryCategory | 'all' | 'forbes'>('all');
  const [dividendInput, setDividendInput] = useState<string>('');
  const [showDividendModal, setShowDividendModal] = useState<boolean>(false);
  const [ceoSalaryInput, setCeoSalaryInput] = useState<number>(state.ceoSalaryPerSec || 0);

  const personalCash = state.personalCash || 0;
  const prestigePoints = state.prestigePoints || 0;
  const luxuryAssets = state.luxuryAssets || [];

  // Calculate owned assets summary
  const ownedAssets = luxuryAssets.filter((a) => (a.ownedCount || 0) > 0);
  const totalOwnedCount = ownedAssets.reduce((sum, a) => sum + (a.ownedCount || 0), 0);
  const totalLuxuryValue = ownedAssets.reduce((sum, a) => sum + a.cost * (a.ownedCount || 0), 0);
  const totalUpkeep = ownedAssets.reduce((sum, a) => sum + (a.upkeepPerSec || 0) * (a.ownedCount || 0), 0);

  // Forbes Leaderboard Calculation
  const playerNetWorth = financials.netWorth;
  const playerForbesEntry: ForbesEntry = {
    rank: 0,
    name: 'Siz (Imperiya Magnati)',
    netWorth: playerNetWorth,
    companyName: 'Bosh Korporatsiya',
    isPlayer: true,
    avatar: '👑',
    country: '🇺🇸 US',
  };

  const allForbesList: ForbesEntry[] = [...FORBES_NPC_LIST, playerForbesEntry]
    .sort((a, b) => b.netWorth - a.netWorth)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  const playerRank = allForbesList.find((item) => item.isPlayer)?.rank || 999;

  const handleDividendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(dividendInput);
    if (!isNaN(amount) && amount > 0) {
      onPayDividend(amount);
      setDividendInput('');
      setShowDividendModal(false);
    }
  };

  const handleSalaryChange = (newSal: number) => {
    setCeoSalaryInput(newSal);
    onSetCeoSalary(newSal);
  };

  const filteredAssets =
    activeTab === 'all'
      ? luxuryAssets
      : activeTab === 'forbes'
      ? []
      : luxuryAssets.filter((a) => a.category === activeTab);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 border border-amber-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              <span>Phase 1: Hashamat & Personal Empire</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Shaxsiy Boylik & Garaj
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Korporatsiya foydasidan shaxsiy hisobingizga dividentlar o'tkazing va dunyoning eng qimmatbaho superkarlari, yaxtalari, qasrlari hamda kosmik ob'ektlarini sotib oling.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            {/* Shaxsiy Balans */}
            <div className="bg-slate-900/80 backdrop-blur border border-amber-500/30 rounded-2xl p-3.5 space-y-1">
              <div className="text-[10px] text-amber-300 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                <span>Shaxsiy Balans</span>
              </div>
              <div className="text-lg md:text-xl font-black text-amber-400">
                {formatMoney(personalCash, currency)}
              </div>
              <div className="text-[10px] text-slate-400">Faqat Luxury xaridlar uchun</div>
            </div>

            {/* Prestige Points */}
            <div className="bg-slate-900/80 backdrop-blur border border-purple-500/30 rounded-2xl p-3.5 space-y-1">
              <div className="text-[10px] text-purple-300 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Prestige Nufuz</span>
              </div>
              <div className="text-lg md:text-xl font-black text-purple-300">
                {prestigePoints.toLocaleString()} PTS
              </div>
              <div className="text-[10px] text-slate-400">{ownedAssets.length} ta Mulk sohibi</div>
            </div>

            {/* Forbes Rank */}
            <div className="bg-slate-900/80 backdrop-blur border border-cyan-500/30 rounded-2xl p-3.5 space-y-1 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-cyan-300 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Forbes Reytingi</span>
              </div>
              <div className="text-lg md:text-xl font-black text-cyan-400">
                #{playerRank} <span className="text-xs font-normal text-slate-400">Dunyo bo'yicha</span>
              </div>
              <div className="text-[10px] text-slate-400">Net Worth: {formatMoney(financials.netWorth, currency)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* CEO Salary & Dividend Management Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CEO Salary Controller */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">CEO Maoshi Sozlamasi</h3>
                <p className="text-xs text-slate-400">Kompaniyadan shaxsiy balansingizga har soniya tushadi</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-extrabold text-emerald-400">
                +{formatMoney(state.ceoSalaryPerSec || 0, currency)}/s
              </div>
              <div className="text-[10px] text-slate-400">Kompaniya xarajatlariga kiradi</div>
            </div>
          </div>

          {/* Salary Selector Presets */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[0, 100, 1000, 10000, 100000].map((sal) => (
              <button
                key={sal}
                onClick={() => handleSalaryChange(sal)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                  (state.ceoSalaryPerSec || 0) === sal
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {sal === 0 ? '0' : `$${sal >= 1000 ? `${sal / 1000}k` : sal}`}
              </button>
            ))}
          </div>
        </div>

        {/* Instant Dividend Transfer Button */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Kompaniya Dividend To'lovi</h3>
                <p className="text-xs text-slate-400">Kompaniya naqd pulidan shaxsiy hisobga bir martalik o'tkazma</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Mavjud Corporate Cash</div>
              <div className="text-sm font-bold text-amber-400">{formatMoney(state.cash, currency)}</div>
            </div>
          </div>

          <button
            onClick={() => setShowDividendModal(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
          >
            <DollarSign className="w-4 h-4" />
            <span>Dividend O'tkazish ($)</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
            activeTab === 'all'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Barcha Mulklar ({luxuryAssets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('Supercars')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
            activeTab === 'Supercars'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Car className="w-3.5 h-3.5 text-red-400" />
          <span>Superkarlar</span>
        </button>

        <button
          onClick={() => setActiveTab('RealEstate')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
            activeTab === 'RealEstate'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-blue-400" />
          <span>Qasrlar & Penthouse</span>
        </button>

        <button
          onClick={() => setActiveTab('YachtsJets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
            activeTab === 'YachtsJets'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Plane className="w-3.5 h-3.5 text-cyan-400" />
          <span>Yaxtalar & Jetlar</span>
        </button>

        <button
          onClick={() => setActiveTab('ArtCollectibles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
            activeTab === 'ArtCollectibles'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Gem className="w-3.5 h-3.5 text-purple-400" />
          <span>San'at & Olmoslar</span>
        </button>

        <button
          onClick={() => setActiveTab('IslandsSpace')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
            activeTab === 'IslandsSpace'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Rocket className="w-3.5 h-3.5 text-emerald-400" />
          <span>Orollar & Kosmos</span>
        </button>

        <button
          onClick={() => setActiveTab('forbes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
            activeTab === 'forbes'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Forbes Top 100 Reytingi</span>
        </button>
      </div>

      {/* Forbes Leaderboard View */}
      {activeTab === 'forbes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span>Forbes Global Billionaires List 2026</span>
              </h2>
              <p className="text-xs text-slate-400">Dunyoning eng boy insonlari ro'yxati va sizning o'rningiz</p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold">
              Sizning O'rningiz: #{playerRank}
            </div>
          </div>

          <div className="divide-y divide-slate-800/60">
            {allForbesList.map((entry) => (
              <div
                key={entry.name}
                className={`py-3.5 px-4 rounded-2xl flex items-center justify-between transition ${
                  entry.isPlayer
                    ? 'bg-gradient-to-r from-amber-500/20 via-slate-800 to-amber-500/10 border border-amber-500/40'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`font-black text-sm w-8 text-center ${
                      entry.rank === 1
                        ? 'text-amber-400 text-base'
                        : entry.rank === 2
                        ? 'text-slate-300 text-base'
                        : entry.rank === 3
                        ? 'text-amber-600 text-base'
                        : 'text-slate-500'
                    }`}
                  >
                    #{entry.rank}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                    {entry.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      <span>{entry.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{entry.country}</span>
                      {entry.isPlayer && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{entry.companyName}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-sm text-emerald-400">
                    {formatMoney(entry.netWorth, currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">Net Worth</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Asset Cards Grid */}
      {activeTab !== 'forbes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssets.map((asset) => {
            const IconComponent = ICON_MAP[asset.iconName] || Crown;
            const count = asset.ownedCount || 0;
            const isOwned = count > 0;
            const canAfford1 = personalCash >= asset.cost;
            const canAfford5 = personalCash >= asset.cost * 5;
            const canAfford10 = personalCash >= asset.cost * 10;

            return (
              <div
                key={asset.id}
                className={`group relative rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isOwned
                    ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900'
                }`}
              >
                {/* Status Badge */}
                {isOwned && (
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>x{count} Egasi</span>
                  </div>
                )}

                <div className="p-5 space-y-4">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isOwned
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-slate-800 text-amber-400 border-slate-700 group-hover:scale-105 transition-transform'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                        {asset.category}
                      </div>
                      <h3 className="font-extrabold text-white text-base leading-tight truncate">
                        {asset.name}
                      </h3>
                      {asset.location && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Globe className="w-3 h-3 text-slate-500" />
                          <span>{asset.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {asset.description}
                  </p>

                  {/* Specs & Prestige Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                      <div className="text-[10px] text-slate-400 font-medium">Prestige Nufuzi</div>
                      <div className="font-extrabold text-purple-300 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-purple-400" />
                        <span>+{asset.prestigePoints * Math.max(1, count)} PTS</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                      <div className="text-[10px] text-slate-400 font-medium">Texnik Xarakteristika</div>
                      <div className="font-semibold text-slate-200 text-[11px] truncate">
                        {asset.specs || 'Noyob Mulk'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar with Multi-Quantity Buttons */}
                <div className="p-5 pt-0 border-t border-slate-800/60 mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Dona Narxi</div>
                      <div className="font-black text-base text-amber-400">
                        {formatMoney(asset.cost, currency)}
                      </div>
                    </div>
                    {isOwned && (
                      <button
                        onClick={() => onSellAsset(asset.id, 1)}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-rose-300 border border-slate-700 hover:border-rose-500/40 text-[11px] font-bold transition"
                        title="1 dona sotish (80% reselling)"
                      >
                        1x Sotish
                      </button>
                    )}
                  </div>

                  {/* Multi-Buy Buttons (+1, +5, +10) */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => onBuyAsset(asset.id, 1)}
                      disabled={!canAfford1}
                      className={`py-2 rounded-xl font-black text-xs transition border ${
                        canAfford1
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      +1x
                    </button>

                    <button
                      onClick={() => onBuyAsset(asset.id, 5)}
                      disabled={!canAfford5}
                      className={`py-2 rounded-xl font-black text-xs transition border ${
                        canAfford5
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      +5x
                    </button>

                    <button
                      onClick={() => onBuyAsset(asset.id, 10)}
                      disabled={!canAfford10}
                      className={`py-2 rounded-xl font-black text-xs transition border ${
                        canAfford10
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      +10x
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dividend Modal */}
      {showDividendModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                <span>Dividend O'tkazish ($)</span>
              </h3>
              <button
                onClick={() => setShowDividendModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Kompaniya naqd pulidan shaxsiy balansingizga pul o'tkazing. Ushbu mablag'lar faqat luxury buyumlar va shaxsiy kolleksiya uchun ishlatiladi.
            </p>

            <form onSubmit={handleDividendSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Dividend Summasi ($)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={dividendInput}
                    onChange={(e) => setDividendInput(e.target.value)}
                    placeholder="Masalan: 1000000"
                    min="1"
                    max={state.cash}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setDividendInput(Math.floor(state.cash * 0.5).toString())}
                    className="absolute right-2 top-2 px-2.5 py-1 rounded-xl bg-slate-800 text-amber-400 text-[10px] font-bold"
                  >
                    50% Max
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDividendModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
                >
                  Tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

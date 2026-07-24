import React, { useState } from 'react';
import { GameState, BusinessCategory } from '../../types/game';
import { formatMoney } from '../../utils/formatters';
import {
  CupSoda,
  ShoppingBag,
  Coffee,
  Cake,
  Shirt,
  ShoppingCart,
  Building2,
  Gem,
  Utensils,
  UtensilsCrossed,
  Smartphone,
  Laptop,
  Code,
  Brain,
  Bot,
  Car,
  Plane,
  Ship,
  Factory,
  Truck,
  Landmark,
  TrendingUp,
  Sun,
  Fuel,
  Pill,
  HeartPulse,
  Tv,
  Video,
  Building,
  Watch,
  Rocket,
  Globe,
  UserCheck,
  Plus,
  Lock,
} from 'lucide-react';

interface BusinessesViewProps {
  state: GameState;
  onBuyBusiness: (id: string) => void;
  onHireManager: (id: string) => void;
  onMaintainBusiness?: (id: string) => void;
}

const CATEGORIES: (BusinessCategory | 'All')[] = [
  'All',
  'Starting',
  'Retail',
  'Food',
  'Technology',
  'Transportation',
  'Manufacturing',
  'Finance',
  'Energy',
  'Construction',
  'Late Game',
];

const CATEGORY_LABELS: Record<string, string> = {
  All: 'Barchasi',
  Starting: 'Boshlang\'ich',
  Retail: 'Chakana Savdo',
  Food: 'Umumiy Ovqatlanish',
  Technology: 'Texnologiya va IT',
  Transportation: 'Transport & Logistika',
  Manufacturing: 'Sanoat & Zavodlar',
  Finance: 'Moliya & Bank',
  Energy: 'Energetika',
  Construction: 'Qurilish & Osmono\'par',
  'Late Game': 'Kosmik & Yirik',
};

export const BusinessesView: React.FC<BusinessesViewProps> = ({
  state,
  onBuyBusiness,
  onHireManager,
  onMaintainBusiness,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'All'>('All');
  const currency = state.currency || 'USD';

  // Helper function to map string icon key to Lucide component
  const renderIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 sm:w-6 sm:h-6' };
    switch (iconName) {
      case 'CupSoda': return <CupSoda {...props} />;
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      case 'Coffee': return <Coffee {...props} />;
      case 'Cake': return <Cake {...props} />;
      case 'Shirt': return <Shirt {...props} />;
      case 'ShoppingCart': return <ShoppingCart {...props} />;
      case 'Building2': return <Building2 {...props} />;
      case 'Gem': return <Gem {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'UtensilsCrossed': return <UtensilsCrossed {...props} />;
      case 'Smartphone': return <Smartphone {...props} />;
      case 'Laptop': return <Laptop {...props} />;
      case 'Code': return <Code {...props} />;
      case 'Brain': return <Brain {...props} />;
      case 'Bot': return <Bot {...props} />;
      case 'Car': return <Car {...props} />;
      case 'Plane': return <Plane {...props} />;
      case 'Ship': return <Ship {...props} />;
      case 'Factory': return <Factory {...props} />;
      case 'Truck': return <Truck {...props} />;
      case 'Landmark': return <Landmark {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'Fuel': return <Fuel {...props} />;
      case 'Pill': return <Pill {...props} />;
      case 'HeartPulse': return <HeartPulse {...props} />;
      case 'Tv': return <Tv {...props} />;
      case 'Video': return <Video {...props} />;
      case 'Building': return <Building {...props} />;
      case 'Watch': return <Watch {...props} />;
      case 'Rocket': return <Rocket {...props} />;
      case 'Globe': return <Globe {...props} />;
      default: return <Building2 {...props} />;
    }
  };

  const filteredBusinesses = state.businesses.filter((b) => {
    if (selectedCategory === 'All') return true;
    return b.category === selectedCategory;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header & Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Biznes Portfeli</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Kompaniyalarni sotib oling, darajasini oshiring va menejerlarni yollang.
          </p>
        </div>

        <div className="text-left sm:text-right text-xs text-slate-400">
          <div>Mavjud Balans: <span className="font-bold text-amber-400">{formatMoney(state.cash, currency)}</span></div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10'
            }`}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredBusinesses.map((biz) => {
          const upgradeCost = Math.floor(biz.baseCost * Math.pow(1.22, biz.level));
          const condition = Math.round(biz.maintenanceCondition ?? 100);
          const currentRevenue = biz.baseRevenue * biz.level * (0.6 + 0.4 * (condition / 100));
          const canAffordUpgrade = state.cash >= upgradeCost;
          const canAffordManager = state.cash >= biz.managerCost;
          const isUnlocked = biz.level > 0 || state.netWorth >= biz.requiredNetWorth;

          const repairCost = Math.round(biz.baseCost * 0.05);

          return (
            <div
              key={biz.id}
              className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all ${
                biz.level > 0
                  ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                  : 'border-white/10 opacity-90'
              }`}
            >
              {/* Top: Icon + Title + Level badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      biz.level > 0
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {renderIcon(biz.iconName)}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white leading-snug">{biz.name}</h3>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-0.5 rounded-md bg-slate-800">
                      {CATEGORY_LABELS[biz.category] || biz.category}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black px-2 py-1 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
                    {biz.level}-Daraja
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 line-clamp-2">{biz.description}</p>

              {/* Financial Stats */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sof Tushum:</span>
                  <span className="font-bold text-emerald-400">
                    +{formatMoney(currentRevenue, currency)}/s
                  </span>
                </div>

                {biz.level > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Uskuna Holati:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-14 sm:w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${condition > 80 ? 'bg-emerald-400' : condition > 50 ? 'bg-amber-400' : 'bg-rose-500'}`}
                          style={{ width: `${condition}%` }}
                        />
                      </div>
                      <span className={`font-semibold text-[11px] ${condition > 80 ? 'text-emerald-400' : condition > 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {condition}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400">Menejer:</span>
                  <span className="font-semibold text-slate-300">
                    {biz.hasManager ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" /> Avtomat
                      </span>
                    ) : (
                      <span className="text-amber-400">Qo'lda</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {!isUnlocked ? (
                  <div className="p-3 rounded-2xl bg-slate-800/50 text-slate-400 text-xs flex items-center justify-center gap-2 border border-slate-800 text-center">
                    <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Talab: {formatMoney(biz.requiredNetWorth, currency)}</span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onBuyBusiness(biz.id)}
                      disabled={!canAffordUpgrade}
                      className={`w-full py-2.5 px-3 rounded-2xl font-bold text-xs flex flex-wrap items-center justify-between gap-1 transition-all cursor-pointer ${
                        canAffordUpgrade
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Plus className="w-4 h-4" />
                        {biz.level === 0 ? 'Sotib Olish' : 'Darajani Oshirish'}
                      </span>
                      <span className="ml-auto">{formatMoney(upgradeCost, currency)}</span>
                    </button>

                    {biz.level > 0 && condition < 100 && onMaintainBusiness && (
                      <button
                        onClick={() => onMaintainBusiness(biz.id)}
                        disabled={state.cash < repairCost}
                        className="w-full py-1.5 px-3 rounded-xl font-bold text-[11px] bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 flex flex-wrap items-center justify-between gap-1 transition"
                      >
                        <span>🔧 Ta'mirlash (100%)</span>
                        <span className="ml-auto">{formatMoney(repairCost, currency)}</span>
                      </button>
                    )}

                    {biz.level > 0 && !biz.hasManager && (
                      <button
                        onClick={() => onHireManager(biz.id)}
                        disabled={!canAffordManager}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex flex-wrap items-center justify-between gap-1 transition-all cursor-pointer ${
                          canAffordManager
                            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" />
                          Menejer Yollash
                        </span>
                        <span className="ml-auto">{formatMoney(biz.managerCost, currency)}</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

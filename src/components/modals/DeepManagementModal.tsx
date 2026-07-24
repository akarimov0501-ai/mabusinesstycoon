import React, { useState } from 'react';
import { Business, DeepManagementConfig } from '../../types/game';
import { formatMoney } from '../../utils/formatters';
import {
  X,
  SlidersHorizontal,
  DollarSign,
  Cpu,
  Layers,
  TrendingUp,
  Check,
  ShieldCheck,
  Smartphone,
  Laptop,
  Factory,
  Coffee,
  Shirt,
  Sparkles,
  Brain,
  Zap,
} from 'lucide-react';

interface DeepManagementModalProps {
  business: Business;
  currency: 'USD' | 'UZS';
  onClose: () => void;
  onSaveConfig: (businessId: string, config: DeepManagementConfig) => void;
}

export const DeepManagementModal: React.FC<DeepManagementModalProps> = ({
  business,
  currency,
  onClose,
  onSaveConfig,
}) => {
  const isAi = business.id === 'ai_company';
  const isGpu = business.id === 'gpu_factory';
  const isSmartphone = business.id === 'smartphone_factory';
  const isComputer = business.id === 'computer_factory';

  const currentConfig = business.deepConfig || {
    unitPrice: isAi ? 49 : isGpu ? 12500 : isSmartphone ? 799 : isComputer ? 1299 : 500,
    priceMultiplier: 1.0,
    componentQuality: 'standard',
    targetMarket: 'mass',
    modelTier: 'enterprise_70b',
    gpuArchTier: 'datacenter_tensor',
    maxProfitMarginPercent: 28,
  };

  // Base reference prices for products
  const basePrice = isAi ? 49 : isGpu ? 12500 : isSmartphone ? 799 : isComputer ? 1299 : 500;
  const minPrice = Math.round(basePrice * 0.3);
  const maxPrice = Math.round(basePrice * 2.5);

  const [unitPrice, setUnitPrice] = useState<number>(currentConfig.unitPrice || basePrice);
  const [quality, setQuality] = useState<'basic' | 'standard' | 'high_end' | 'ultra'>(
    currentConfig.componentQuality || 'standard'
  );
  const [targetMarket, setTargetMarket] = useState<'mass' | 'middle' | 'niche'>(
    currentConfig.targetMarket || 'mass'
  );
  const [modelTier, setModelTier] = useState<'small_7b' | 'enterprise_70b' | 'frontier_400b' | 'agi_super'>(
    currentConfig.modelTier || 'enterprise_70b'
  );
  const [gpuArchTier, setGpuArchTier] = useState<'mobile_gpu' | 'workstation_gpu' | 'datacenter_tensor' | 'quantum_optics'>(
    currentConfig.gpuArchTier || 'datacenter_tensor'
  );

  // Price multiplier calculation relative to base
  const priceMultiplier = parseFloat((unitPrice / basePrice).toFixed(2));

  // COGS & Demand estimation calculations
  const qualityCogsRate = quality === 'ultra' ? 0.38 : quality === 'high_end' ? 0.30 : quality === 'basic' ? 0.18 : 0.25;
  const targetCogsRate = targetMarket === 'niche' ? 0.05 : 0;
  const totalCogsRate = qualityCogsRate + targetCogsRate;

  // Estimated profit margin (strictly capped at 25-30% max as requested)
  const rawMargin = Math.round((1 - totalCogsRate - 0.42) * 100 * priceMultiplier);
  const calculatedMargin = Math.min(30, Math.max(12, Math.round(Math.min(28, rawMargin))));

  const handleSave = () => {
    onSaveConfig(business.id, {
      unitPrice,
      priceMultiplier,
      componentQuality: quality,
      targetMarket,
      modelTier,
      gpuArchTier,
      maxProfitMarginPercent: calculatedMargin,
    });
    onClose();
  };

  const renderProductIcon = () => {
    if (isAi) return <Brain className="w-7 h-7 text-purple-400" />;
    if (isGpu) return <Zap className="w-7 h-7 text-amber-400" />;
    if (isSmartphone) return <Smartphone className="w-7 h-7 text-emerald-400" />;
    if (isComputer) return <Laptop className="w-7 h-7 text-cyan-400" />;
    if (business.category === 'Food') return <Coffee className="w-7 h-7 text-amber-400" />;
    if (business.category === 'Retail') return <Shirt className="w-7 h-7 text-purple-400" />;
    return <Factory className="w-7 h-7 text-blue-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-emerald-500/10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              {renderProductIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{business.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Chuqurlashish
                </span>
              </div>
              <p className="text-xs text-slate-400">Model darajasi, narxlash va sof foyda marjasi sozlamalari</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* AI Model Tiers (if AI business) */}
          {isAi && (
            <div className="space-y-3 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30">
              <label className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-400" />
                AI Model Darajasi va Neyron Arktitektura:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'small_7b', label: 'Yengil LLM (7B)', desc: 'Ekonom va tezkor API', icon: '🤖' },
                  { id: 'enterprise_70b', label: 'Enterprise (70B)', desc: 'Standart korporativ model', icon: '🧠' },
                  { id: 'frontier_400b', label: 'Frontier (400B+)', desc: 'Multimodal super-model', icon: '🚀' },
                  { id: 'agi_super', label: 'AGI Super-Model', desc: 'Kvant neyron strukturasi', icon: '🌌' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setModelTier(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
                      modelTier === item.id
                        ? 'bg-purple-500/20 border-purple-500 text-white shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-purple-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <span>{item.icon}</span> {item.label}
                      </span>
                      {modelTier === item.id && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GPU Architecture Tiers (if GPU business) */}
          {isGpu && (
            <div className="space-y-3 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
              <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                GPU Chip Arxitekturasi va Sinfi:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'mobile_gpu', label: 'Mobile / Entry GPU', desc: 'Boshlang\'ich grafik chip', icon: '📱' },
                  { id: 'workstation_gpu', label: 'Workstation GPU', desc: 'Grafik va rendering chip', icon: '💻' },
                  { id: 'datacenter_tensor', label: 'Data-Center Tensor', desc: 'H100/B200 AI akselerator', icon: '🖥️' },
                  { id: 'quantum_optics', label: 'Quantum Optics GPU', desc: 'Fotoniya va kvant chiplari', icon: '⚛️' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setGpuArchTier(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
                      gpuArchTier === item.id
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-amber-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <span>{item.icon}</span> {item.label}
                      </span>
                      {gpuArchTier === item.id && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Price Setting */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                {isAi ? 'API Obuna Narxi (oyiga / token):' : isGpu ? '1 ta GPU Plata Narxi:' : 'Mahsulot Narxini Belgilash (1 birlik uchun):'}
              </label>
              <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                {formatMoney(unitPrice, currency)}
              </span>
            </div>

            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={isAi ? 2 : isGpu ? 250 : isSmartphone ? 10 : isComputer ? 20 : 5}
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Arzon: {formatMoney(minPrice, currency)}</span>
              <span>Standart: {formatMoney(basePrice, currency)}</span>
              <span>Lyuks: {formatMoney(maxPrice, currency)}</span>
            </div>
          </div>

          {/* Component & Material Quality */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Sifat Nazorati va Texnologiya Komplektatsiyasi:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'basic', label: 'Ekonom', desc: 'Kam xarajat, 18% COGS', icon: '📦' },
                { id: 'standard', label: 'Standart', desc: 'Oʻrtacha muvozanat, 25% COGS', icon: '⚡' },
                { id: 'high_end', label: 'Premial', desc: 'Yuqori sifat, 30% COGS', icon: '💎' },
                { id: 'ultra', label: 'Ultra Flagman', desc: 'Eng soʻnggi texnologiya, 38% COGS', icon: '🚀' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setQuality(item.id as any)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1 ${
                    quality === item.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold flex items-center gap-1.5">
                      <span>{item.icon}</span> {item.label}
                    </span>
                    {quality === item.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-400 leading-tight">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Market Segment */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              Maqsadli Bozor Segmenti:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mass', label: 'Ommaviy', sub: 'Katta hajm' },
                { id: 'middle', label: 'Oʻrta Sinf', sub: 'Barqaror' },
                { id: 'niche', label: 'Eksklyuziv', sub: 'Nish segm.' },
              ].map((mkt) => (
                <button
                  key={mkt.id}
                  onClick={() => setTargetMarket(mkt.id as any)}
                  className={`py-2 px-3 rounded-xl border text-center transition cursor-pointer ${
                    targetMarket === mkt.id
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs">{mkt.label}</div>
                  <div className="text-[9px] text-slate-400">{mkt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Summary Financial Impact Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/20 space-y-2.5">
            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span className="text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> O'zini Oqlash Muddatining Tizimli Standarti:
              </span>
              <span className="font-bold text-emerald-300">
                {isAi ? '15,000 soniya' : isGpu ? '7,000 soniya' : 'Oʻrtacha'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span className="text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Tannarx (COGS ulushi):
              </span>
              <span className="font-bold text-amber-400">{Math.round(totalCogsRate * 100)}%</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Sof Foyda Marjasi (Capped):
              </span>
              <span className="font-black text-emerald-400 text-sm">
                ~{calculatedMargin}% <span className="text-[10px] text-slate-400 font-normal">(Max 25-30%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Sozlamalarni Saqlash
          </button>
        </div>
      </div>
    </div>
  );
};

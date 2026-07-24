import React, { useState } from 'react';
import { RdProject, GameState } from '../../types/game';
import { formatMoney, formatNumber } from '../../utils/formatters';
import {
  X,
  Brain,
  Bot,
  Sparkles,
  Cpu,
  Zap,
  Atom,
  Tv,
  Server,
  Sun,
  Edit3,
  DollarSign,
  TrendingUp,
  Gauge,
  AlertTriangle,
} from 'lucide-react';

interface RdProjectDetailModalProps {
  project: RdProject;
  state: GameState;
  onClose: () => void;
  onUpdateBudget: (projectId: string, budget: number) => void;
  onRenameProject: (projectId: string, customName: string) => void;
}

export const RdProjectDetailModal: React.FC<RdProjectDetailModalProps> = ({
  project,
  state,
  onClose,
  onUpdateBudget,
  onRenameProject,
}) => {
  const [nameInput, setNameInput] = useState(project.customName || project.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [budgetInput, setBudgetInput] = useState<number>(project.allocatedBudgetPerSec);

  const currency = state.currency || 'USD';
  const progressPercent = Math.min(100, Math.floor((project.accumulatedExp / (project.targetExp || 1)) * 100));

  const handleSaveName = () => {
    onRenameProject(project.id, nameInput);
    setIsEditingName(false);
  };

  const handleApplyBudget = (val: number) => {
    const clamped = Math.max(0, val);
    setBudgetInput(clamped);
    onUpdateBudget(project.id, clamped);
  };

  const renderIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6 sm:w-8 sm:h-8' };
    switch (iconName) {
      case 'Brain': return <Brain {...props} />;
      case 'Bot': return <Bot {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Atom': return <Atom {...props} />;
      case 'Tv': return <Tv {...props} />;
      case 'Server': return <Server {...props} />;
      case 'Sun': return <Sun {...props} />;
      default: return <Brain {...props} />;
    }
  };

  const presetBudgets = [0, 10, 50, 250, 1000, 5000, 25000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-5 my-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Card */}
        <div className="flex items-center gap-3.5 pr-8">
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
              project.category === 'ai'
                ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                : project.category === 'cpu'
                ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {renderIcon(project.iconName)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  project.category === 'ai'
                    ? 'bg-purple-500/20 text-purple-300'
                    : project.category === 'cpu'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {project.category === 'ai' ? 'Sun\'iy Intellekt (AI)' : project.category === 'cpu' ? 'Microprocessor (CPU)' : 'Accelerator (GPU)'}
              </span>
              <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                {project.level}-Daraja
              </span>
            </div>

            {/* Custom Name Editor */}
            {isEditingName ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white text-sm font-bold rounded-xl px-3 py-1 focus:outline-none focus:border-emerald-500 flex-1"
                  placeholder="Model nomini kiriting..."
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-base sm:text-lg font-black text-white truncate">
                  {project.customName || project.name}
                </h3>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Model nomini tahrirlash"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-[11px] text-slate-400 truncate">{project.name}</p>
          </div>
        </div>

        {/* Progress Bar & Level Info */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-purple-400" />
              Tadqiqot Rivoji ($EXP$)
            </span>
            <span className="font-bold text-purple-300">
              {formatNumber(Math.floor(project.accumulatedExp))} / {formatNumber(project.targetExp)} EXP ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Technical Specs & Capabilities Grid */}
        <div className="space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Texnik Spetsifikatsiyalar & Natijalar
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {project.specs.parametersB !== undefined && (
              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold">Parametrlar</div>
                <div className="font-black text-purple-400 text-sm">{project.specs.parametersB} Milliard (7B+)</div>
              </div>
            )}
            {project.specs.accuracyPercent !== undefined && (
              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold">Aniqlik Indeksi</div>
                <div className="font-black text-emerald-400 text-sm">{project.specs.accuracyPercent}%</div>
              </div>
            )}
            {project.specs.tflops !== undefined && (
              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold">Hisoblash Quvvati</div>
                <div className="font-black text-cyan-400 text-sm">{project.specs.tflops} TFLOPS</div>
              </div>
            )}
            {project.specs.nanometers !== undefined && (
              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold">Texprotsess</div>
                <div className="font-black text-amber-400 text-sm">{project.specs.nanometers} nm Node</div>
              </div>
            )}
            {project.specs.clockGHz !== undefined && (
              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold">Takt Chastotasi</div>
                <div className="font-black text-emerald-300 text-sm">{project.specs.clockGHz} GHz</div>
              </div>
            )}
            {project.specs.coresCount !== undefined && (
              <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold">Yadrolar Soni</div>
                <div className="font-black text-indigo-300 text-sm">{project.specs.coresCount} Cores</div>
              </div>
            )}
          </div>
        </div>

        {/* Earnings & Financial Benefits */}
        <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> To'g'ridan-to'g'ri Royalti Tushumi:
            </span>
            <span className="font-bold text-emerald-400">+{formatMoney(project.royaltyRevenuePerSec, currency)}/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Barcha Bizneslar Daromad Bonusi:
            </span>
            <span className="font-bold text-cyan-400">+{project.companyBoostPercent}%</span>
          </div>
        </div>

        {/* Budget Allocation Controls */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Sekundlik R&D Byudjet Ajratish ($/s)
            </label>
            <span className="font-black text-sm text-amber-400">
              {formatMoney(budgetInput, currency)}/s
            </span>
          </div>

          {/* Budget Presets Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {presetBudgets.map((val) => (
              <button
                key={val}
                onClick={() => handleApplyBudget(val)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  budgetInput === val
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {val === 0 ? 'To\'xtatish ($0)' : `+${formatMoney(val, currency)}/s`}
              </button>
            ))}
          </div>

          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max="50000"
            step="50"
            value={budgetInput}
            onChange={(e) => handleApplyBudget(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />

          {budgetInput > 10000 && (
            <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Yuqori byudjet belgilandi. Balansingizni nazorat qilib boring!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

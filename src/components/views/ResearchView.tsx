import React, { useState } from 'react';
import { GameState, RdProject } from '../../types/game';
import { formatMoney, formatNumber } from '../../utils/formatters';
import { RdProjectDetailModal } from '../modals/RdProjectDetailModal';
import {
  FlaskConical,
  Zap,
  Brain,
  Megaphone,
  Bot,
  Truck,
  Leaf,
  Shield,
  Percent,
  Rocket,
  CheckCircle2,
  Lock,
  Cpu,
  Tv,
  Server,
  Sun,
  Sparkles,
  Atom,
  Sliders,
  DollarSign,
  Gauge,
} from 'lucide-react';

interface ResearchViewProps {
  state: GameState;
  onConductResearch: (techId: string) => void;
  onUpdateRdBudget: (projectId: string, budget: number) => void;
  onRenameRdProject: (projectId: string, customName: string) => void;
}

type RdCategoryTab = 'all' | 'ai' | 'cpu' | 'gpu' | 'tech';

export const ResearchView: React.FC<ResearchViewProps> = ({
  state,
  onConductResearch,
  onUpdateRdBudget,
  onRenameRdProject,
}) => {
  const [activeTab, setActiveTab] = useState<RdCategoryTab>('all');
  const [selectedProject, setSelectedProject] = useState<RdProject | null>(null);

  const techEngineersCount = state.employees.find((e) => e.id === 'tech')?.count || 0;
  const rpPerSec = techEngineersCount * 2;
  const currency = state.currency || 'USD';

  // Calculate total R&D budget allocated across all active projects
  const totalAllocatedBudget = (state.rdProjects || []).reduce((acc, p) => acc + (p.allocatedBudgetPerSec || 0), 0);
  const totalRoyaltyRevenue = (state.rdProjects || []).reduce((acc, p) => acc + (p.royaltyRevenuePerSec || 0), 0);

  const renderTechIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 sm:w-6 sm:h-6' };
    switch (iconName) {
      case 'Zap': return <Zap {...props} />;
      case 'Brain': return <Brain {...props} />;
      case 'Megaphone': return <Megaphone {...props} />;
      case 'Bot': return <Bot {...props} />;
      case 'Truck': return <Truck {...props} />;
      case 'Leaf': return <Leaf {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'Percent': return <Percent {...props} />;
      case 'Rocket': return <Rocket {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Tv': return <Tv {...props} />;
      case 'Server': return <Server {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Atom': return <Atom {...props} />;
      default: return <FlaskConical {...props} />;
    }
  };

  const categoryTabs: { id: RdCategoryTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'Barchasi', icon: FlaskConical },
    { id: 'ai', label: 'AI Modellari', icon: Brain },
    { id: 'cpu', label: 'CPU Protsessorlar', icon: Cpu },
    { id: 'gpu', label: 'GPU & Tensor Accelerators', icon: Server },
    { id: 'tech', label: 'Korporativ Tex-Daraxt', icon: Zap },
  ];

  const filteredRdProjects = (state.rdProjects || []).filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  const showTechTree = activeTab === 'all' || activeTab === 'tech';

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header & Science Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-purple-400" />
            R&D Ilmiy-Tadqiqot Laboratoriyasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Sun'iy intellekt modellari, CPU/GPU protsessorlarini o'qiting va byudjet ajratib rivojlantiring.
          </p>
        </div>

        {/* Global R&D Summary Metrics */}
        <div className="flex flex-wrap items-center gap-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-3.5 py-2">
          <div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">RP Ballar</div>
            <div className="text-xs sm:text-sm font-black text-purple-400 flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5" />
              {formatNumber(Math.floor(state.researchPoints))} (+{rpPerSec}/s)
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">R&D Byudjeti</div>
            <div className="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              {formatMoney(totalAllocatedBudget, currency)}/s
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Royalti Tushumi</div>
            <div className="text-xs sm:text-sm font-black text-emerald-400">
              +{formatMoney(totalRoyaltyRevenue, currency)}/s
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs Slider */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categoryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive R&D Projects Grid (AI, CPU, GPU) */}
      {activeTab !== 'tech' && filteredRdProjects.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Interaktiv AI, CPU va GPU Loyihalari (Bosib Boshqaring)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredRdProjects.map((proj) => {
              const isUnlocked = proj.unlocked || state.netWorth >= proj.requiredNetWorth;
              const progressPercent = Math.min(100, Math.floor((proj.accumulatedExp / (proj.targetExp || 1)) * 100));

              return (
                <div
                  key={proj.id}
                  onClick={() => isUnlocked && setSelectedProject(proj)}
                  className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 transition-all relative ${
                    isUnlocked
                      ? 'border-purple-500/30 hover:border-purple-500/60 shadow-lg cursor-pointer hover:scale-[1.01]'
                      : 'border-white/10 opacity-70 cursor-not-allowed'
                  }`}
                >
                  {/* Top: Icon + Names + Level */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                          proj.category === 'ai'
                            ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                            : proj.category === 'cpu'
                            ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {renderTechIcon(proj.iconName)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              proj.category === 'ai'
                                ? 'bg-purple-500/20 text-purple-300'
                                : proj.category === 'cpu'
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {proj.category.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-white truncate leading-tight mt-0.5">
                          {proj.customName || proj.name}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-slate-800 text-amber-400 border border-amber-500/30">
                        {proj.level}-Daraja
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 line-clamp-2">{proj.description}</p>

                  {/* Progress Bar & Budget Status */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-semibold flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-purple-400" /> EXP Progress:
                      </span>
                      <span className="font-bold text-purple-300">
                        {formatNumber(Math.floor(proj.accumulatedExp))} / {formatNumber(proj.targetExp)} ({progressPercent}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-800/60">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Sekundlik Byudjet:</span>
                      <span className={`font-black text-xs ${proj.allocatedBudgetPerSec > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                        {proj.allocatedBudgetPerSec > 0 ? `${formatMoney(proj.allocatedBudgetPerSec, currency)}/s` : 'To\'xtatilgan'}
                      </span>
                    </div>
                  </div>

                  {/* Action / Manage Button */}
                  {!isUnlocked ? (
                    <div className="p-2.5 rounded-2xl bg-slate-800/60 text-slate-400 text-xs flex items-center justify-center gap-2 border border-slate-800 text-center">
                      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Net Worth Talabi: {formatMoney(proj.requiredNetWorth, currency)}</span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(proj);
                      }}
                      className="w-full py-2 px-3 rounded-2xl bg-purple-950/80 hover:bg-purple-900/90 text-purple-200 font-bold text-xs border border-purple-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-purple-400" />
                      <span>Model Nomi va Byudjetni Sozlash</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Standard Corporate Tech Tree */}
      {showTechTree && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Korporativ Avtomatlashtirish & Texnologiyalar Daraxti
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {state.research.map((tech) => {
              const reqTech = tech.requiredTechId
                ? state.research.find((r) => r.id === tech.requiredTechId)
                : null;

              const isPrereqMet = !reqTech || reqTech.isResearched;
              const canAfford =
                state.researchPoints >= tech.costRP && state.cash >= tech.costCash;

              return (
                <div
                  key={tech.id}
                  className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 transition-all ${
                    tech.isResearched
                      ? 'border-purple-500/30 shadow-lg shadow-purple-500/5'
                      : 'border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            tech.isResearched
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {renderTechIcon(tech.iconName)}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-white leading-snug">{tech.name}</h3>
                          <span className="text-[9px] sm:text-[10px] font-bold text-purple-400 px-2 py-0.5 rounded-md bg-purple-500/10">
                            {tech.category}
                          </span>
                        </div>
                      </div>

                      {tech.isResearched && (
                        <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-xl shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Tayyor
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-2">{tech.description}</p>
                  </div>

                  {/* Perk Description */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                    <div className="font-semibold text-emerald-400">✨ Samara: {tech.effectDescription}</div>
                  </div>

                  {/* Action Button / Lock Status */}
                  <div>
                    {!isPrereqMet ? (
                      <div className="p-2.5 rounded-2xl bg-slate-800/60 text-slate-400 text-xs flex items-center justify-center gap-2 border border-slate-800 text-center">
                        <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Talab: {reqTech?.name}</span>
                      </div>
                    ) : !tech.isResearched ? (
                      <button
                        onClick={() => onConductResearch(tech.id)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 px-3 rounded-2xl font-bold text-xs flex flex-wrap items-center justify-between gap-1 transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        }`}
                      >
                        <span>Izlanish Olib Borish</span>
                        <span>
                          {formatNumber(tech.costRP)} RP + {formatMoney(tech.costCash, currency)}
                        </span>
                      </button>
                    ) : (
                      <div className="p-2 rounded-2xl bg-purple-500/10 text-purple-300 font-bold text-xs text-center border border-purple-500/20">
                        Texnologiya Faol
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* R&D Project Detail Modal */}
      {selectedProject && (
        <RdProjectDetailModal
          project={selectedProject}
          state={state}
          onClose={() => setSelectedProject(null)}
          onUpdateBudget={onUpdateRdBudget}
          onRenameProject={onRenameRdProject}
        />
      )}
    </div>
  );
};

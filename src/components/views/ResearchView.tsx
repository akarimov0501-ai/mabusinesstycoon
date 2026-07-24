import React from 'react';
import { GameState } from '../../types/game';
import { formatMoney, formatNumber } from '../../utils/formatters';
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
} from 'lucide-react';

interface ResearchViewProps {
  state: GameState;
  onConductResearch: (techId: string) => void;
}

export const ResearchView: React.FC<ResearchViewProps> = ({
  state,
  onConductResearch,
}) => {
  const techEngineersCount = state.employees.find((e) => e.id === 'tech')?.count || 0;
  const rpPerSec = techEngineersCount * 2;

  const renderTechIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
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
      default: return <FlaskConical {...props} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">R&D va Texnologiyalar Daraxti</h2>
          <p className="text-sm text-slate-400">
            Ilg'or korporativ texnologiyalarni kashf eting, biznes avtomatizatsiyasini oshiring va soliqlarni maqbullashtiring.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-4">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ilmiy Ballar</div>
            <div className="text-base font-black text-purple-400 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-purple-400" />
              {formatNumber(Math.floor(state.researchPoints))} RP
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Yig'ilish Tezligi</div>
            <div className="text-base font-black text-emerald-400">+{rpPerSec} RP/sek</div>
          </div>
        </div>
      </div>

      {/* Tech Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
              className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-5 flex flex-col justify-between space-y-4 transition-all ${
                tech.isResearched
                  ? 'border-purple-500/30 shadow-lg shadow-purple-500/5'
                  : 'border-white/10'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        tech.isResearched
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {renderTechIcon(tech.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white leading-snug">{tech.name}</h3>
                      <span className="text-[10px] font-bold text-purple-400 px-2 py-0.5 rounded-md bg-purple-500/10">
                        {tech.category}
                      </span>
                    </div>
                  </div>

                  {tech.isResearched && (
                    <span className="text-emerald-400 font-bold text-xs flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" /> Kashf qilingan
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-3">{tech.description}</p>
              </div>

              {/* Perk Description */}
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <div className="font-semibold text-emerald-400">✨ Samara: {tech.effectDescription}</div>
              </div>

              {/* Action Button / Lock Status */}
              <div>
                {!isPrereqMet ? (
                  <div className="p-3 rounded-2xl bg-slate-800/60 text-slate-400 text-xs flex items-center justify-center gap-2 border border-slate-800">
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>Dastlab kashf qiling: {reqTech?.name}</span>
                  </div>
                ) : !tech.isResearched ? (
                  <button
                    onClick={() => onConductResearch(tech.id)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span>Izlanish Olib Borish</span>
                    <span>
                      {formatNumber(tech.costRP)} RP + {formatMoney(tech.costCash)}
                    </span>
                  </button>
                ) : (
                  <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-300 font-bold text-xs text-center border border-purple-500/20">
                    Texnologiya Faol
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

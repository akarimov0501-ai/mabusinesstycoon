import React from 'react';
import { GameState, DetailedFinancials } from '../types/game';
import { formatMoney } from '../utils/formatters';
import {
  Coins,
  TrendingUp,
  Volume2,
  VolumeX,
  Play,
  FastForward,
  Zap,
  Save,
  Menu,
  Sparkles,
  DollarSign,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  state: GameState;
  financials: DetailedFinancials;
  onToggleSound: () => void;
  onSetGameSpeed: (speed: number) => void;
  onSave: () => void;
  onOpenMobileMenu: () => void;
  onToggleCurrency?: () => void;
  onOpenFinancialReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  financials,
  onToggleSound,
  onSetGameSpeed,
  onSave,
  onOpenMobileMenu,
  onToggleCurrency,
  onOpenFinancialReport,
}) => {
  const currency = state.currency || 'USD';

  return (
    <header id="game-header" className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile menu button & Brand logo */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-btn"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base md:text-lg leading-tight tracking-tight text-white flex items-center gap-2">
                Imperiya Magnati
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Real Hayot Iqtisodiyoti
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">Xalqaro Biznes va Bank Simulyatori</p>
            </div>
          </div>
        </div>

        {/* Center: Live Financial Metrics & Currency Toggle */}
        <div className="flex items-center gap-2 md:gap-4 bg-slate-950/60 px-3 md:px-4 py-1.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Coins className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Naqd Pul</div>
              <div className="font-extrabold text-sm md:text-base text-amber-400 tracking-tight">
                {formatMoney(state.cash, currency)}
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden xs:block" />

          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg ${
                financials.netProfitPerSec >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sof Foyda</div>
              <div
                className={`font-extrabold text-sm md:text-base tracking-tight ${
                  financials.netProfitPerSec >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {financials.netProfitPerSec >= 0 ? '+' : ''}
                {formatMoney(financials.netProfitPerSec, currency)}
                <span className="text-[10px] font-normal text-slate-400">/sek</span>
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden lg:block" />

          <div className="hidden lg:flex items-center gap-2">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Net Worth</div>
              <div className="font-bold text-sm text-cyan-400">{formatMoney(financials.netWorth, currency)}</div>
            </div>
          </div>
        </div>

        {/* Right: Currency Toggle, P&L Report, Speed, Sound, Save */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Currency Toggle */}
          {onToggleCurrency && (
            <button
              onClick={onToggleCurrency}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs border border-amber-500/30 transition flex items-center gap-1 shadow-sm"
              title="Valyutani O'zgartirish ($ USD vs UZS So'm)"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>{currency}</span>
            </button>
          )}

          {/* Financial P&L Report */}
          {onOpenFinancialReport && (
            <button
              onClick={onOpenFinancialReport}
              className="p-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-300 transition-colors border border-blue-500/30"
              title="Moliyaviy Hisoboti (P&L breakdown)"
            >
              <FileText className="w-4 h-4" />
            </button>
          )}

          {/* Game Speed */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700/60">
            <button
              onClick={() => onSetGameSpeed(1)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                state.gameSpeed === 1
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Normal Speed (1x)"
            >
              <Play className="w-3.5 h-3.5" />
              1x
            </button>

            <button
              onClick={() => onSetGameSpeed(2)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                state.gameSpeed === 2
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Fast Speed (2x)"
            >
              <FastForward className="w-3.5 h-3.5" />
              2x
            </button>

            <button
              onClick={() => onSetGameSpeed(5)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                state.gameSpeed === 5
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Hyper Speed (5x)"
            >
              <Zap className="w-3.5 h-3.5" />
              5x
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
            title={state.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {state.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Quick Save */}
          <button
            onClick={onSave}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 text-xs md:text-sm"
            title="O'yinni saqlash"
          >
            <Save className="w-4 h-4" />
            <span className="hidden lg:inline">Saqlash</span>
          </button>
        </div>
      </div>
    </header>
  );
};


import React, { useState } from 'react';
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
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  state: GameState;
  financials: DetailedFinancials;
  onToggleSound: () => void;
  onSetGameSpeed: (speed: number) => void;
  onSave?: () => void;
  onOpenMobileMenu: () => void;
  onToggleCurrency?: () => void;
  onOpenFinancialReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  financials,
  onToggleSound,
  onSetGameSpeed,
  onOpenMobileMenu,
  onToggleCurrency,
  onOpenFinancialReport,
}) => {
  const currency = state.currency || 'USD';
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);

  return (
    <header id="game-header" className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-2 sm:px-4 py-2 shadow-md w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4 w-full min-w-0">
        {/* Left: Mobile menu button & Brand logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            id="mobile-menu-btn"
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Navigation Menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <div className="hidden min-[420px]:block">
              <h1 className="font-bold text-xs sm:text-base leading-tight tracking-tight text-white flex items-center gap-1">
                Imperiya
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Magnati
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden lg:block">Xalqaro Biznes & Bank Simulyatori</p>
            </div>
          </div>
        </div>

        {/* Center: Live Financial Metrics */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-4 bg-slate-950/80 px-2 sm:px-4 py-1 sm:py-1.5 rounded-2xl border border-slate-800/80 min-w-0 flex-1 max-w-xl mx-1 sm:mx-auto">
          {/* Naqd Pul */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <div className="p-1 sm:p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate hidden min-[360px]:block">Naqd Pul</div>
              <div className="font-black text-xs sm:text-sm md:text-base text-amber-400 tracking-tight truncate">
                {formatMoney(state.cash, currency)}
              </div>
            </div>
          </div>

          <div className="h-5 sm:h-8 w-px bg-slate-800 shrink-0" />

          {/* Sof Foyda */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <div
              className={`p-1 sm:p-1.5 rounded-lg shrink-0 ${
                financials.netProfitPerSec >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate hidden min-[360px]:block">Sof Foyda</div>
              <div
                className={`font-black text-xs sm:text-sm md:text-base tracking-tight truncate ${
                  financials.netProfitPerSec >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {financials.netProfitPerSec >= 0 ? '+' : ''}
                {formatMoney(financials.netProfitPerSec, currency)}
                <span className="text-[8px] sm:text-[10px] font-normal text-slate-400">/s</span>
              </div>
            </div>
          </div>

          {/* Net Worth (Large Screens) */}
          <div className="h-8 w-px bg-slate-800 hidden lg:block shrink-0" />
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Net Worth</div>
              <div className="font-bold text-sm text-cyan-400">{formatMoney(financials.netWorth, currency)}</div>
            </div>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Currency Toggle */}
          {onToggleCurrency && (
            <button
              onClick={onToggleCurrency}
              className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs border border-amber-500/30 transition flex items-center gap-1 shadow-sm"
              title="Valyutani O'zgartirish ($ USD vs UZS So'm)"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span className="text-[10px] sm:text-xs hidden min-[360px]:inline">{currency}</span>
            </button>
          )}

          {/* Financial P&L Report */}
          {onOpenFinancialReport && (
            <button
              onClick={onOpenFinancialReport}
              className="p-1.5 sm:p-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-300 transition-colors border border-blue-500/30"
              title="Moliyaviy Hisoboti"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Game Speed (Desktop & Responsive Dropdown on Mobile) */}
          <div className="relative">
            {/* Desktop Speed Selector */}
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

            {/* Mobile Speed Button Dropdown */}
            <button
              onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
              className="sm:hidden px-1.5 py-1 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 text-[11px] font-bold flex items-center gap-0.5"
            >
              <span>{state.gameSpeed}x</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {speedMenuOpen && (
              <div className="sm:hidden absolute top-full right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl flex flex-col gap-1 z-50 w-24">
                {[1, 2, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onSetGameSpeed(s);
                      setSpeedMenuOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between ${
                      state.gameSpeed === s ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{s}x</span>
                    {s === 1 && <Play className="w-3 h-3" />}
                    {s === 2 && <FastForward className="w-3 h-3" />}
                    {s === 5 && <Zap className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
            title={state.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {state.soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};

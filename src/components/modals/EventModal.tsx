import React from 'react';
import { GameEvent } from '../../types/game';
import { Sparkles, AlertTriangle } from 'lucide-react';

interface EventModalProps {
  event: GameEvent;
  onChoice: (choiceIndex: number) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onChoice }) => {
  const isPositive = event.type === 'positive';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 relative overflow-hidden max-h-[85vh] overflow-y-auto">
        {/* Accent Glow */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isPositive ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-amber-500'
          }`}
        />

        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {isPositive ? <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" /> : <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />}
          </div>

          <div>
            <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Tasodifiy Korporativ Voqea</span>
            <h3 className="font-black text-base sm:text-xl text-white leading-tight">{event.title}</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 sm:p-4 rounded-2xl border border-slate-800">
          {event.description}
        </p>

        <div className="space-y-2 pt-1">
          {event.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => onChoice(idx)}
              className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

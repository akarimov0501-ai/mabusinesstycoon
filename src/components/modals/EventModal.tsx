import React from 'react';
import { GameEvent } from '../../types/game';
import { Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface EventModalProps {
  event: GameEvent;
  onChoice: (choiceIndex: number) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onChoice }) => {
  const isPositive = event.type === 'positive';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Accent Glow */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isPositive ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-amber-500'
          }`}
        />

        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {isPositive ? <Sparkles className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Random Corporate Event</span>
            <h3 className="font-black text-xl text-white leading-tight">{event.title}</h3>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          {event.description}
        </p>

        <div className="space-y-2 pt-2">
          {event.choices.map((choice, idx) => (
            <button
              key={idx}
              onClick={() => onChoice(idx)}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-md shadow-emerald-500/20"
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

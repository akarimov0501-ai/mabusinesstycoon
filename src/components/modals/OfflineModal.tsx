import React from 'react';
import { formatMoney } from '../../utils/formatters';
import { Coins, Sparkles, Check } from 'lucide-react';

interface OfflineModalProps {
  amount: number;
  onClose: () => void;
}

export const OfflineModal: React.FC<OfflineModalProps> = ({ amount, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
          <Coins className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-black text-white tracking-tight">Welcome Back, CEO!</h3>
          <p className="text-xs text-slate-400">Your global business empire continued working while you were away.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="text-xs text-slate-400 font-semibold uppercase">Offline Income Earned</div>
          <div className="text-3xl font-black text-emerald-400 tracking-tight mt-1">
            +{formatMoney(amount)}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" /> Claim Profits & Continue
        </button>
      </div>
    </div>
  );
};

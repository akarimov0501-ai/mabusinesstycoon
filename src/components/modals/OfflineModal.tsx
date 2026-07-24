import React from 'react';
import { formatMoney } from '../../utils/formatters';
import { Coins, Check } from 'lucide-react';

interface OfflineModalProps {
  amount: number;
  onClose: () => void;
}

export const OfflineModal: React.FC<OfflineModalProps> = ({ amount, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-md w-full p-4 sm:p-6 text-center space-y-4 sm:space-y-5 shadow-2xl relative overflow-hidden max-h-[85vh] overflow-y-auto">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/20 shrink-0">
          <Coins className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Xush Kelibsiz, CEO!</h3>
          <p className="text-xs text-slate-400">Siz yo'qligingizda ham imperiyangiz daromad keltirishda davom etdi.</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase">Oflayn Topilgan Foyda</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight mt-1">
            +{formatMoney(amount)}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4 sm:w-5 sm:h-5" /> Foydani Olish & Davom Etish
        </button>
      </div>
    </div>
  );
};

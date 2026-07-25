import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, Share, PlusSquare, X, Sparkles, CheckCircle2 } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, triggerInstall } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  // Render Android / Chrome / Desktop native prompt button or iOS instructions
  return (
    <>
      <div className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-md max-w-md w-full animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-1.5">
                <span>Mobil Ilovani O'rnatish</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold border border-emerald-500/30">
                  PWA
                </span>
              </h4>
              <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                Internetsiz ishlash, to'liq ekran va tezkor kirish uchun ekranga o'rnating!
              </p>
            </div>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            title="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {isInstallable ? (
            <button
              onClick={triggerInstall}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>📱 O'rnatish (1-Tap Install)</span>
            </button>
          ) : isIOS ? (
            <button
              onClick={() => setShowIOSModal(true)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-xs transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Share className="w-4 h-4" />
              <span>iPhone/iPad-ga Qo'shish Qo'llanmasi</span>
            </button>
          ) : (
            <button
              onClick={triggerInstall}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Ilovani Bosh Ekranga Qo'shish</span>
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
          >
            Keyinroq
          </button>
        </div>
      </div>

      {/* iOS Installation Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>iPhone / iPad-ga O'rnatish</span>
              </h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-white mb-0.5">Safari brauzerida pastdagi "Ulashish" tugmasini bosing:</div>
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded-lg w-fit mt-1">
                    <Share className="w-4 h-4" />
                    <span>Ulashish (Share Button)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <div className="font-bold text-white mb-0.5">Menyudan pastga tushib ushbu bandni tanlang:</div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-lg w-fit mt-1">
                    <PlusSquare className="w-4 h-4" />
                    <span>"Bosh ekranga qo'shish" (Add to Home Screen)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-white">Yuqoridagi "Qo'shish" tugmasini bosing va ilovadan rohatlaning!</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20"
            >
              Tushundim
            </button>
          </div>
        </div>
      )}
    </>
  );
};

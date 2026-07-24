import React, { useRef, useState } from 'react';
import { GameState } from '../../types/game';
import { Save, Download, Upload, AlertTriangle } from 'lucide-react';

interface SettingsViewProps {
  state: GameState;
  onManualSave: () => void;
  onResetGame: () => void;
  onExportSave: () => void;
  onImportSave: (jsonStr: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onManualSave,
  onResetGame,
  onExportSave,
  onImportSave,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (text) {
          onImportSave(text);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">O'yin Sozlamalari</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          O'yin ma'lumotlarini saqlang yoki zaxira nusxalarini yuklang.
        </p>
      </div>

      {/* Save & Export Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 space-y-3.5 shadow-lg">
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <Save className="w-5 h-5 text-emerald-400 shrink-0" /> Avtomatik Saqlash (Auto-Save)
          </h3>
          <p className="text-xs text-slate-400">
            Barcha erishgan natijalaringiz va har bir o'zgarishingiz brauzer xotirasiga darhol avtomatik saqlanadi. Sahifa yangilansa ham ma'lumotlaringiz yo'qolmaydi.
          </p>

          <div className="flex flex-col gap-2">
            <div className="py-2.5 px-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Avtomatik Saqlash Faol (100% Xavfsiz)
            </div>

            <button
              onClick={onExportSave}
              className="py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400 shrink-0" /> JSON Fayl Sifatida Zaxiralash
            </button>
          </div>
        </div>

        {/* Restore & Import */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 space-y-3.5 shadow-lg">
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-400 shrink-0" /> Tiklash va Fayl Yuklash
          </h3>
          <p className="text-xs text-slate-400">
            Ilgari saqlangan JSON formatidagi faylni yuklab, o'yin natijalaringizni tiklang.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 shrink-0" /> JSON Faylini Tanlash
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Game */}
      <div className="bg-white/5 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-4 sm:p-6 space-y-3.5 shadow-lg">
        <h3 className="font-bold text-sm sm:text-base text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" /> Xavfli Hudud: Qayta Boshlash
        </h3>
        <p className="text-xs text-slate-400">
          O'yinni nolga tushirish barcha bizneslar, ochilgan davlatlar va yutuqlarni o'chirib tashlaydi.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="py-2.5 px-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 transition-colors cursor-pointer"
          >
            O'yinni Nolga Tushirish
          </button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3">
            <p className="text-xs font-bold text-rose-200">
              Ishonchingiz komilmi? Bu amalni ortga qaytarib bo'lmaydi!
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  onResetGame();
                  setShowResetConfirm(false);
                }}
                className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Ha, Barchasini O'chirish
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Bekor Qilish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

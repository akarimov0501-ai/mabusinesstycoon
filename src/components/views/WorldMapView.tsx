import React from 'react';
import { GameState } from '../../types/game';
import { formatMoney } from '../../utils/formatters';
import {
  Globe,
  MapPin,
  Users,
  CheckCircle2,
} from 'lucide-react';

interface WorldMapViewProps {
  state: GameState;
  onUnlockCountry: (countryId: string) => void;
}

export const WorldMapView: React.FC<WorldMapViewProps> = ({
  state,
  onUnlockCountry,
}) => {
  const unlockedCount = state.countries.filter((c) => c.isUnlocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Dunyo Xaritasi va Geografik Kengayish</h2>
          <p className="text-sm text-slate-400">
            Xalqaro bozorlarda vakolatxonalarni oching, qulay soliq rejimlaridan va ulkan mijozlar auditoriyasidan foydalaning.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-3">
          <Globe className="w-5 h-5 text-purple-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Xalqaro Ishtirok</div>
            <div className="text-base font-black text-purple-400">{unlockedCount} / {state.countries.length} Davlatlar Ochilgan</div>
          </div>
        </div>
      </div>

      {/* Country Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {state.countries.map((country) => {
          const canAfford = state.cash >= country.unlockCost;

          return (
            <div
              key={country.id}
              className={`bg-white/5 backdrop-blur-xl border rounded-3xl p-5 flex flex-col justify-between space-y-4 transition-all ${
                country.isUnlocked
                  ? 'border-purple-500/30 shadow-lg shadow-purple-500/5'
                  : 'border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{country.flag}</span>
                    <div>
                      <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                        {country.name}
                        {country.headquarters && (
                          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Bosh Ofis
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-slate-500" /> Aholi: {country.population}
                      </span>
                    </div>
                  </div>

                  {country.isUnlocked && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <div className="text-slate-400">Korporativ Soliq:</div>
                  <div className="font-bold text-emerald-400 mt-0.5">
                    {(country.taxRate * 100).toFixed(0)}% Soliq
                  </div>
                </div>

                <div>
                  <div className="text-slate-400">Talab O'sishi:</div>
                  <div className="font-bold text-amber-400 mt-0.5">
                    +{(country.demandMultiplier * 100 - 100).toFixed(0)}% Daromad
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {country.isUnlocked ? (
                  <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-300 font-bold text-xs text-center border border-purple-500/20 flex items-center justify-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400" /> Filiallar Faol
                  </div>
                ) : (
                  <button
                    onClick={() => onUnlockCountry(country.id)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> Bozorni Ochish
                    </span>
                    <span>{formatMoney(country.unlockCost)}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

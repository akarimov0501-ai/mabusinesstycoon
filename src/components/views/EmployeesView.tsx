import React from 'react';
import { GameState } from '../../types/game';
import { formatMoney } from '../../utils/formatters';
import {
  UserPlus,
  UserMinus,
  GraduationCap,
  Smile,
  CheckCircle2,
} from 'lucide-react';

interface EmployeesViewProps {
  state: GameState;
  onUpdateEmployees: (deptId: string, delta: number) => void;
  onUpdateSalaryMultiplier: (deptId: string, multiplier: number) => void;
  onCompleteTraining: (trainingId: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  state,
  onUpdateEmployees,
  onUpdateSalaryMultiplier,
  onCompleteTraining,
}) => {
  const totalEmployees = state.employees.reduce((acc, e) => acc + e.count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Kadrlar va HR Boshqaruvi</h2>
          <p className="text-sm text-slate-400">
            Bo'limlarga xodimlarni yollang, maosh darajasini moslang va malaka oshirish kurslarini moliyalashtiring.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-4">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Xodimlar Kayfiyati</div>
            <div className="text-base font-black text-emerald-400 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-emerald-400" />
              {Math.round(state.employeeHappiness)}%
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Jami Xodimlar</div>
            <div className="text-base font-black text-amber-400">{totalEmployees} kishi</div>
          </div>
        </div>
      </div>

      {/* Employee Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {state.employees.map((dept) => {
          const deptSalaryExpense = dept.count * dept.baseSalary * dept.salaryMultiplier;

          return (
            <div
              key={dept.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base text-white">{dept.name}</h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-800 text-amber-400">
                    {dept.count} kishi
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{dept.description}</p>
              </div>

              {/* Department Benefit Perk */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-medium">
                ✨ Afzalligi: {dept.effect}
              </div>

              {/* Salary Multiplier & Cost */}
              <div className="space-y-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Maosh Paketi:</span>
                  <span className="font-bold text-slate-200">
                    Bozor stavkasining {dept.salaryMultiplier.toFixed(1)}x baravari
                  </span>
                </div>

                <input
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.1"
                  value={dept.salaryMultiplier}
                  onChange={(e) => onUpdateSalaryMultiplier(dept.id, parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                  <span>Soniya xarajati:</span>
                  <span className="font-bold text-rose-400">-{formatMoney(deptSalaryExpense)}/sek</span>
                </div>
              </div>

              {/* Hire / Fire Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateEmployees(dept.id, -1)}
                  disabled={dept.count <= 0}
                  className="py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <UserMinus className="w-3.5 h-3.5" /> Bo'shatish (-1)
                </button>

                <button
                  onClick={() => onUpdateEmployees(dept.id, 1)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Yollash (+1)
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Employee Training Programs */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-400" />
          Malaka Oshirish va Seminarlar
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {state.trainings.map((tr) => {
            const canAfford = state.cash >= tr.cost;

            return (
              <div
                key={tr.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-base text-white">{tr.name}</h4>
                    {tr.isCompleted && (
                      <span className="text-emerald-400 flex items-center gap-1 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Bajarildi
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-2">{tr.description}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="text-amber-400 font-bold">Bonus: {tr.statBoost}</div>
                </div>

                {!tr.isCompleted ? (
                  <button
                    onClick={() => onCompleteTraining(tr.id)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    <span>Seminarni Moliyalashtirish</span>
                    <span>{formatMoney(tr.cost)}</span>
                  </button>
                ) : (
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 text-center font-bold text-xs border border-emerald-500/20">
                    O'quv kursi tugatilgan
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

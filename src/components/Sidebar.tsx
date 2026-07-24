import React from 'react';
import { GameState } from '../types/game';
import {
  LayoutDashboard,
  Building2,
  Users,
  FlaskConical,
  Megaphone,
  TrendingUp,
  Swords,
  Globe,
  Trophy,
  BarChart3,
  Settings,
  X,
  Sparkles,
  Landmark,
} from 'lucide-react';

export type NavigationTab =
  | 'dashboard'
  | 'businesses'
  | 'bank'
  | 'employees'
  | 'research'
  | 'marketing'
  | 'investments'
  | 'competitors'
  | 'world'
  | 'achievements'
  | 'statistics'
  | 'settings';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  state: GameState;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  state,
  mobileOpen,
  onCloseMobile,
}) => {
  const claimableAchievementsCount = state.achievements.filter(
    (a) => a.unlocked
  ).length;

  const activeLoansCount = (state.loans || []).length;

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Boshqaruv Paneli', icon: LayoutDashboard },
    { id: 'businesses', label: 'Bizneslar', icon: Building2, badge: state.businesses.filter((b) => b.level > 0).length },
    { id: 'bank', label: 'Bank va Kreditlar', icon: Landmark, badge: activeLoansCount > 0 ? activeLoansCount : undefined },
    { id: 'employees', label: 'Xodimlar va HR', icon: Users },
    { id: 'research', label: 'R&D va Texnologiyalar', icon: FlaskConical, badge: Math.floor(state.researchPoints) > 0 ? `${Math.floor(state.researchPoints)} RP` : undefined },
    { id: 'marketing', label: 'Marketing va Reklama', icon: Megaphone },
    { id: 'investments', label: 'Investitsiya va Birja', icon: TrendingUp },
    { id: 'competitors', label: 'Raqobatchilar', icon: Swords },
    { id: 'world', label: 'Dunyo Xaritasi', icon: Globe, badge: `${state.countries.filter((c) => c.isUnlocked).length}/7` },
    { id: 'achievements', label: 'Yutuqlar', icon: Trophy, badge: claimableAchievementsCount },
    { id: 'statistics', label: 'Statistika', icon: BarChart3 },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
  ];

  const handleTabClick = (id: NavigationTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header in Mobile */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2 font-bold text-white">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Navigation Menu</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Item List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge !== 0 && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Empire Status Card at bottom of sidebar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 text-xs space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Nufuz & Obro':</span>
              <span className="font-bold text-amber-400">{Math.round(state.reputation)}%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Mijozlar Mamnunligi:</span>
              <span className="font-bold text-emerald-400">{Math.round(state.customerSatisfaction)}%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Xodimlar Kayfiyati:</span>
              <span className="font-bold text-cyan-400">{Math.round(state.employeeHappiness)}%</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

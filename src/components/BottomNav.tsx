import React from 'react';
import { NavigationTab } from './Sidebar';
import {
  LayoutDashboard,
  Building2,
  Landmark,
  TrendingUp,
  Menu,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenMoreMenu: () => void;
  businessBadge?: number;
  bankBadge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMoreMenu,
  businessBadge,
  bankBadge,
}) => {
  const primaryTabs: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Boshqaruv', icon: LayoutDashboard },
    { id: 'businesses', label: 'Bizneslar', icon: Building2, badge: businessBadge },
    { id: 'bank', label: 'Bank', icon: Landmark, badge: bankBadge },
    { id: 'investments', label: 'Invest', icon: TrendingUp },
  ];

  const isMoreActive = ![
    'dashboard',
    'businesses',
    'bank',
    'investments',
  ].includes(activeTab);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 shadow-2xl flex items-center justify-around w-full max-w-full overflow-hidden">
      {primaryTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
              isActive
                ? 'text-emerald-400 bg-emerald-500/10 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}

      {/* More / All Menu Button */}
      <button
        onClick={onOpenMoreMenu}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          isMoreActive
            ? 'text-emerald-400 bg-emerald-500/10 font-bold scale-105'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Ko'proq</span>
      </button>
    </nav>
  );
};

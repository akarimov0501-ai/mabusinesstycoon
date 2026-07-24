import React, { useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { Header } from './components/Header';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { BusinessesView } from './components/views/BusinessesView';
import { BankView } from './components/views/BankView';
import { EmployeesView } from './components/views/EmployeesView';
import { ResearchView } from './components/views/ResearchView';
import { MarketingView } from './components/views/MarketingView';
import { InvestmentsView } from './components/views/InvestmentsView';
import { CompetitorsView } from './components/views/CompetitorsView';
import { WorldMapView } from './components/views/WorldMapView';
import { AchievementsView } from './components/views/AchievementsView';
import { StatisticsView } from './components/views/StatisticsView';
import { SettingsView } from './components/views/SettingsView';
import { EventModal } from './components/modals/EventModal';
import { OfflineModal } from './components/modals/OfflineModal';
import { FinancialReportModal } from './components/modals/FinancialReportModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFinancialReport, setShowFinancialReport] = useState(false);

  const {
    state,
    financials,
    activeEvent,
    offlineEarnings,
    notification,
    closeOfflineModal,
    handleTap,
    upgradeClicker,
    buyBusiness,
    hireManager,
    unlockCountry,
    updateEmployees,
    updateSalaryMultiplier,
    completeTraining,
    conductResearch,
    toggleMarketing,
    buyStock,
    sellStock,
    buyCrypto,
    sellCrypto,
    buyRealEstate,
    acquireCompetitor,
    handleEventChoice,
    setGameSpeed,
    toggleSound,
    takeLoan,
    repayLoan,
    maintainBusiness,
    buyRealEstateWithMortgage,
    toggleCurrency,
    manualSave,
    resetGame,
    exportSave,
    importSave,
  } = useGameEngine();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1 relative">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          state={state}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar Header */}
          <Header
            state={state}
            financials={financials}
            onToggleSound={toggleSound}
            onSetGameSpeed={setGameSpeed}
            onSave={manualSave}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onToggleCurrency={toggleCurrency}
            onOpenFinancialReport={() => setShowFinancialReport(true)}
          />

          {/* Active View Container */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <DashboardView
                state={state}
                financials={financials}
                onTap={handleTap}
                onUpgradeClicker={upgradeClicker}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'businesses' && (
              <BusinessesView
                state={state}
                onBuyBusiness={buyBusiness}
                onHireManager={hireManager}
                onMaintainBusiness={maintainBusiness}
              />
            )}

            {activeTab === 'bank' && (
              <BankView
                state={state}
                financials={financials}
                onTakeLoan={takeLoan}
                onRepayLoan={repayLoan}
              />
            )}

            {activeTab === 'employees' && (
              <EmployeesView
                state={state}
                onUpdateEmployees={updateEmployees}
                onUpdateSalaryMultiplier={updateSalaryMultiplier}
                onCompleteTraining={completeTraining}
              />
            )}

            {activeTab === 'research' && (
              <ResearchView
                state={state}
                onConductResearch={conductResearch}
              />
            )}

            {activeTab === 'marketing' && (
              <MarketingView
                state={state}
                onToggleMarketing={toggleMarketing}
              />
            )}

            {activeTab === 'investments' && (
              <InvestmentsView
                state={state}
                onBuyStock={buyStock}
                onSellStock={sellStock}
                onBuyCrypto={buyCrypto}
                onSellCrypto={sellCrypto}
                onBuyRealEstate={buyRealEstate}
                onBuyRealEstateWithMortgage={buyRealEstateWithMortgage}
              />
            )}

            {activeTab === 'competitors' && (
              <CompetitorsView
                state={state}
                onAcquireCompetitor={acquireCompetitor}
              />
            )}

            {activeTab === 'world' && (
              <WorldMapView
                state={state}
                onUnlockCountry={unlockCountry}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsView state={state} />
            )}

            {activeTab === 'statistics' && (
              <StatisticsView
                state={state}
                financials={financials}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                state={state}
                onManualSave={manualSave}
                onResetGame={resetGame}
                onExportSave={exportSave}
                onImportSave={importSave}
              />
            )}
          </main>
        </div>
      </div>

      {/* Random Event Popup Modal */}
      {activeEvent && (
        <EventModal
          event={activeEvent}
          onChoice={handleEventChoice}
        />
      )}

      {/* Offline Earnings Welcome Modal */}
      {offlineEarnings !== null && (
        <OfflineModal
          amount={offlineEarnings}
          onClose={closeOfflineModal}
        />
      )}

      {/* Financial P&L Report Modal */}
      {showFinancialReport && (
        <FinancialReportModal
          state={state}
          financials={financials}
          onClose={() => setShowFinancialReport(false)}
        />
      )}
    </div>
  );
}


import React, { useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { Header } from './components/Header';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
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
import { LuxuryView } from './components/views/LuxuryView';
import { EventModal } from './components/modals/EventModal';
import { OfflineModal } from './components/modals/OfflineModal';
import { FinancialReportModal } from './components/modals/FinancialReportModal';
import { DeepManagementModal } from './components/modals/DeepManagementModal';
import { Business } from './types/game';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFinancialReport, setShowFinancialReport] = useState(false);
  const [deepBizModal, setDeepBizModal] = useState<Business | null>(null);

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
    updateRdBudget,
    renameRdProject,
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
    updateBusinessDeepConfig,
    buyRealEstateWithMortgage,
    toggleCurrency,
    manualSave,
    resetGame,
    exportSave,
    importSave,
    setCeoSalary,
    payDividend,
    buyLuxuryAsset,
    sellLuxuryAsset,
  } = useGameEngine();

  const activeBusinessesCount = state.businesses.filter((b) => b.level > 0).length;
  const activeLoansCount = (state.loans || []).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden w-full max-w-full">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-bounce max-w-[90vw]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="truncate">{notification}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1 relative min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          state={state}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onToggleSound={toggleSound}
          onSetGameSpeed={setGameSpeed}
          onToggleCurrency={toggleCurrency}
          onOpenFinancialReport={() => setShowFinancialReport(true)}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden w-full max-w-full">
          {/* Top Bar Header */}
          <Header
            state={state}
            financials={financials}
            onToggleSound={toggleSound}
            onSetGameSpeed={setGameSpeed}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onToggleCurrency={toggleCurrency}
            onOpenFinancialReport={() => setShowFinancialReport(true)}
          />

          {/* Active View Container */}
          <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-7xl w-full mx-auto space-y-6 pb-20 md:pb-8 overflow-x-hidden">
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
                onOpenDeepManagement={(biz) => setDeepBizModal(biz)}
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

            {activeTab === 'luxury' && (
              <LuxuryView
                state={state}
                financials={financials}
                onBuyAsset={buyLuxuryAsset}
                onSellAsset={sellLuxuryAsset}
                onPayDividend={payDividend}
                onSetCeoSalary={setCeoSalary}
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
                onUpdateRdBudget={updateRdBudget}
                onRenameRdProject={renameRdProject}
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

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMoreMenu={() => setMobileMenuOpen(true)}
        businessBadge={activeBusinessesCount}
        bankBadge={activeLoansCount}
      />

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

      {/* Deep Management & Pricing Modal */}
      {deepBizModal && (
        <DeepManagementModal
          business={deepBizModal}
          currency={state.currency}
          onClose={() => setDeepBizModal(null)}
          onSaveConfig={(bizId, config) => {
            updateBusinessDeepConfig(bizId, config);
            setDeepBizModal(null);
          }}
        />
      )}
    </div>
  );
}

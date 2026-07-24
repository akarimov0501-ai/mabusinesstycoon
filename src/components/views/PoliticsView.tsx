import React, { useState } from 'react';
import { GameState, DetailedFinancials, PoliticalOfficeType } from '../../types/game';
import { formatMoney } from '../../utils/formatters';
import {
  Vote,
  Landmark,
  ShieldCheck,
  Building,
  Crown,
  Sparkles,
  TrendingUp,
  Scale,
  FileCheck,
  Award,
  Megaphone,
  CheckCircle2,
  Lock,
  Zap,
  Users,
  DollarSign,
  Briefcase,
  Edit2,
  Clock,
} from 'lucide-react';

interface PoliticsViewProps {
  state: GameState;
  financials: DetailedFinancials;
  onRunForOffice: (officeId: PoliticalOfficeType) => void;
  onStartLobbying: (policyId: string) => void;
  onBidGovtContract: (contractId: string) => void;
  onFundPRCampaign: (amount: number) => void;
  onSetPoliticalParty: (name: string) => void;
}

export const PoliticsView: React.FC<PoliticsViewProps> = ({
  state,
  financials,
  onRunForOffice,
  onStartLobbying,
  onBidGovtContract,
  onFundPRCampaign,
  onSetPoliticalParty,
}) => {
  const currency = state.currency || 'USD';
  const [activeTab, setActiveTab] = useState<'offices' | 'lobbying' | 'contracts'>('offices');
  const [partyInput, setPartyInput] = useState<string>(state.politicalParty || 'Mustaqil Biznes Alyansi');
  const [isEditingParty, setIsEditingParty] = useState<boolean>(false);
  const [prAmountInput, setPrAmountInput] = useState<string>('250000');
  const [showPRModal, setShowPRModal] = useState<boolean>(false);

  const approval = state.publicApproval || 50;
  const currentOfficeId = state.currentOffice || 'Citizen';
  const offices = state.politicalOffices || [];
  const lobbyingPolicies = state.lobbyingPolicies || [];
  const govtContracts = state.govtContracts || [];

  const currentOfficeObj = offices.find((o) => o.id === currentOfficeId);

  const handleSaveParty = (e: React.FormEvent) => {
    e.preventDefault();
    onSetPoliticalParty(partyInput);
    setIsEditingParty(false);
  };

  const handlePRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(prAmountInput);
    if (!isNaN(amount) && amount > 0) {
      onFundPRCampaign(amount);
      setShowPRModal(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold uppercase tracking-wider">
              <Vote className="w-3.5 h-3.5" />
              <span>Siyosiy Maydon & Qonunchilik</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                Hukumat & Lobbiylik Imperiyasi
              </h1>
            </div>

            {/* Party Name Edit */}
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-slate-400">Siyosiy Partiya:</span>
              {isEditingParty ? (
                <form onSubmit={handleSaveParty} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={partyInput}
                    onChange={(e) => setPartyInput(e.target.value)}
                    className="bg-slate-950 border border-blue-500 rounded-lg px-2 py-0.5 text-xs text-white font-bold"
                  />
                  <button type="submit" className="px-2 py-0.5 rounded bg-blue-500 text-slate-950 font-bold text-[10px]">
                    Saqlash
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-amber-300 bg-slate-900/80 px-2 py-0.5 rounded-md border border-amber-500/30">
                    "{state.politicalParty || 'Mustaqil Biznes Alyansi'}"
                  </span>
                  <button
                    onClick={() => setIsEditingParty(true)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Political Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            {/* Current Office */}
            <div className="bg-slate-900/80 backdrop-blur border border-amber-500/30 rounded-2xl p-3.5 space-y-1">
              <div className="text-[10px] text-amber-300 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                <span>Mansab</span>
              </div>
              <div className="text-sm font-black text-amber-400 truncate">
                {currentOfficeObj ? currentOfficeObj.title.split('(')[0] : 'Oddiy Fuqaro'}
              </div>
              <div className="text-[10px] text-emerald-400 font-bold">
                {currentOfficeObj ? `+${formatMoney(currentOfficeObj.salaryPerSec, currency)}/s maosh` : 'Mansab yo\'q'}
              </div>
            </div>

            {/* Public Approval % */}
            <div className="bg-slate-900/80 backdrop-blur border border-blue-500/30 rounded-2xl p-3.5 space-y-1">
              <div className="text-[10px] text-blue-300 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Xalq Xayrixohligi</span>
              </div>
              <div className="text-lg md:text-xl font-black text-blue-300">
                {approval}%
              </div>
              <button
                onClick={() => setShowPRModal(true)}
                className="text-[10px] text-amber-400 font-bold hover:underline block"
              >
                +PR Kampaniya o'tkazish
              </button>
            </div>

            {/* Prestige Requirement */}
            <div className="bg-slate-900/80 backdrop-blur border border-purple-500/30 rounded-2xl p-3.5 space-y-1 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-purple-300 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Prestige Nufuz</span>
              </div>
              <div className="text-lg md:text-xl font-black text-purple-300">
                {(state.prestigePoints || 0).toLocaleString()} PTS
              </div>
              <div className="text-[10px] text-slate-400">Saylovda ustunlik beradi</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('offices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
            activeTab === 'offices'
              ? 'bg-blue-500 text-slate-950 border-blue-400 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Vote className="w-4 h-4" />
          <span>Saylovlar & Davlat Mansablari ({offices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('lobbying')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
            activeTab === 'lobbying'
              ? 'bg-blue-500 text-slate-950 border-blue-400 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Landmark className="w-4 h-4 text-amber-400" />
          <span>Parlament & Lobbiylik ({lobbyingPolicies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
            activeTab === 'contracts'
              ? 'bg-blue-500 text-slate-950 border-blue-400 shadow-md'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>Davlat Tenderlari & Buyurtmalar ({govtContracts.length})</span>
        </button>
      </div>

      {/* 1. Political Offices & Elections Tab */}
      {activeTab === 'offices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {offices.map((office) => {
            const isCurrent = state.currentOffice === office.id;
            const hasPrestige = (state.prestigePoints || 0) >= office.requiredPrestige;
            const hasApproval = approval >= office.requiredApproval;
            const hasCash = (state.personalCash || 0) >= office.campaignCost;

            const canRun = hasPrestige && hasApproval && hasCash;

            return (
              <div
                key={office.id}
                className={`group relative rounded-3xl border transition-all duration-200 p-6 flex flex-col justify-between space-y-4 ${
                  isCurrent
                    ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/60 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-900/70 border-slate-800 hover:border-blue-500/40'
                }`}
              >
                {/* Office Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                      Davlat Lavozimi
                    </div>
                    <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                      <span>{office.title}</span>
                    </h3>
                  </div>

                  {isCurrent ? (
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase flex items-center gap-1 shadow-md">
                      <Crown className="w-3.5 h-3.5" />
                      <span>Egallangan</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold border border-slate-700">
                      Bo'sh Lavozim
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {office.powerDescription}
                </p>

                {/* Salary & Perks */}
                <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-2">
                    <span className="text-slate-400 font-medium">Davlat Maoshi:</span>
                    <span className="font-extrabold text-emerald-400">
                      +{formatMoney(office.salaryPerSec, currency)}/s
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Lavozim Imtiyozlari:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {office.perks.map((perk) => (
                        <span
                          key={perk}
                          className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-bold"
                        >
                          ✓ {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Campaign Requirements Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className={`p-2 rounded-xl border text-center ${hasPrestige ? 'bg-slate-950/60 border-slate-800 text-purple-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-400'}`}>
                    <div className="text-[9px] text-slate-400">Prestige</div>
                    <div className="font-extrabold text-[11px]">{office.requiredPrestige} PTS</div>
                  </div>

                  <div className={`p-2 rounded-xl border text-center ${hasApproval ? 'bg-slate-950/60 border-slate-800 text-blue-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-400'}`}>
                    <div className="text-[9px] text-slate-400">Xalq Xayrixohligi</div>
                    <div className="font-extrabold text-[11px]">{office.requiredApproval}%</div>
                  </div>

                  <div className={`p-2 rounded-xl border text-center ${hasCash ? 'bg-slate-950/60 border-slate-800 text-amber-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-400'}`}>
                    <div className="text-[9px] text-slate-400">Kampaniya Narxi</div>
                    <div className="font-extrabold text-[11px]">{formatMoney(office.campaignCost, currency)}</div>
                  </div>
                </div>

                {/* Campaign Action Button */}
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold text-center">
                    Siz amaldagi {office.title.split('(')[0]}siz!
                  </div>
                ) : (
                  <button
                    onClick={() => onRunForOffice(office.id)}
                    disabled={!canRun}
                    className={`w-full py-3 rounded-xl font-extrabold text-xs transition shadow-lg flex items-center justify-center gap-2 ${
                      canRun
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-blue-500/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <Vote className="w-4 h-4" />
                    <span>{canRun ? "Saylov Kampaniyasini Boshlash" : "Talablar Bajarilmagan"}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Lobbying & Legislation Tab */}
      {activeTab === 'lobbying' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <Landmark className="w-6 h-6 text-amber-400 shrink-0" />
            <p>
              Parlament a'zolari o'rtasida o'z korporatsiyangiz manfaati uchun lobbiylik o'tkazing. Qonun loyihasi ovozdan o'tgach, butun imperiyangiz bo'yicha cheksiz soliq va xarajat imtiyozlari beriladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {lobbyingPolicies.map((policy) => {
              const isEnacted = policy.status === 'enacted';
              const isLobbying = policy.status === 'lobbying';
              const progressPercent = Math.min(100, Math.floor((policy.progressSec / policy.targetSec) * 100));

              return (
                <div
                  key={policy.id}
                  className={`rounded-3xl border p-6 space-y-4 flex flex-col justify-between ${
                    isEnacted
                      ? 'bg-emerald-950/20 border-emerald-500/50'
                      : isLobbying
                      ? 'bg-blue-950/20 border-blue-500/50'
                      : 'bg-slate-900/70 border-slate-800 hover:border-amber-500/30'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                        Parlament Bill
                      </span>
                      {isEnacted ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                          ✓ Qonun Qabul Qilindi
                        </span>
                      ) : isLobbying ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500 text-slate-950 text-[10px] font-black uppercase animate-pulse">
                          ⏳ Ovoz Berilmoqda...
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                          Mavjud Loyiha
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-white text-base leading-snug">
                      {policy.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {policy.description}
                    </p>
                  </div>

                  {/* Effect Badge */}
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-xs flex items-center justify-between">
                    <span className="text-slate-400">Qonun Samaradorligi:</span>
                    <span className="font-extrabold text-emerald-400">{policy.effectDescription}</span>
                  </div>

                  {/* Progress Bar for active lobbying */}
                  {isLobbying && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Ovoz Berish Progressi</span>
                        <span className="font-bold text-blue-400">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
                    <div>
                      <div className="text-[10px] text-slate-400">Lobbiylik Narxi</div>
                      <div className="font-black text-sm text-amber-400">
                        {formatMoney(policy.cost, currency)}
                      </div>
                    </div>

                    {isEnacted ? (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                        Amalda (Cheksiz)
                      </div>
                    ) : isLobbying ? (
                      <div className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Kutilmoqda...</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onStartLobbying(policy.id)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20"
                      >
                        Lobbiylik Boshlash
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Government Procurement Contracts Tab */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-emerald-400 shrink-0" />
            <p>
              Davlat departamentlarining milliard dollarlik kosmik, mudofaa va infratuzilma shartnomalari uchun tenderda qatnashib, imperiyangiz daromadlarini karrasiga oshiring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {govtContracts.map((contract) => {
              const canBidNetWorth = financials.netWorth >= contract.requiredNetWorth;
              const canBidOffice = !contract.requiredOffice || state.currentOffice === contract.requiredOffice;
              const canBid = canBidNetWorth && canBidOffice && !contract.active;

              return (
                <div
                  key={contract.id}
                  className={`rounded-3xl border p-6 space-y-4 flex flex-col justify-between ${
                    contract.active
                      ? 'bg-emerald-950/20 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                        {contract.department}
                      </span>
                      {contract.active && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Tender Yutildi</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-white text-base leading-snug">
                      {contract.title}
                    </h3>
                  </div>

                  {/* Revenue Card */}
                  <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                    <div className="text-xs text-slate-400">Kafolatlangan Davlat Daromadi:</div>
                    <div className="font-black text-emerald-400 text-base">
                      +{formatMoney(contract.revenuePerSec, currency)}/s
                    </div>
                  </div>

                  {/* Tender Requirements */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2 rounded-xl border text-center ${canBidNetWorth ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-400'}`}>
                      <div className="text-[9px] text-slate-400">Talab Qilingan Net Worth</div>
                      <div className="font-extrabold text-[11px]">{formatMoney(contract.requiredNetWorth, currency)}</div>
                    </div>

                    <div className={`p-2 rounded-xl border text-center ${canBidOffice ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-400'}`}>
                      <div className="text-[9px] text-slate-400">Zarur Mansab</div>
                      <div className="font-extrabold text-[11px]">{contract.requiredOffice || 'Minimal'}</div>
                    </div>
                  </div>

                  {/* Bid Button */}
                  {contract.active ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold text-center">
                      Faol Davlat Buyurtmasi
                    </div>
                  ) : (
                    <button
                      onClick={() => onBidGovtContract(contract.id)}
                      disabled={!canBid}
                      className={`w-full py-3 rounded-xl font-extrabold text-xs transition shadow-lg flex items-center justify-center gap-2 ${
                        canBid
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>{canBid ? "Tenderda Qatnashish & Yutish" : "Tender Shartlari Bajarilmagan"}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PR Campaign Modal */}
      {showPRModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-400" />
                <span>PR & Saylovoldi Kampaniyasi</span>
              </h3>
              <button
                onClick={() => setShowPRModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              OAV va ijtimoiy tarmoqlarda targ'ibot ishlarini olib borib, aholi xayrixohligini (Public Approval %) oshiring.
            </p>

            <form onSubmit={handlePRSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  PR Ajratma Summasi ($) (Shaxsiy Balansdan)
                </label>
                <input
                  type="number"
                  value={prAmountInput}
                  onChange={(e) => setPrAmountInput(e.target.value)}
                  min="50000"
                  step="50000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPRModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-blue-500/20"
                >
                  O'tkazish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

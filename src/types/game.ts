export type BusinessCategory =
  | 'Starting'
  | 'Retail'
  | 'Food'
  | 'Technology'
  | 'Transportation'
  | 'Manufacturing'
  | 'Finance'
  | 'Energy'
  | 'Healthcare'
  | 'Media'
  | 'Construction'
  | 'Agriculture'
  | 'Luxury'
  | 'Late Game';

export type CurrencyType = 'USD' | 'UZS';

export interface BankLoan {
  id: string;
  name: string;
  loanType: 'micro' | 'commercial' | 'mortgage' | 'line_of_credit';
  amount: number;
  remainingAmount: number;
  monthlyPayment: number; // deducted per tick
  interestRate: number; // annual interest rate e.g. 0.08
  termSec: number;
  elapsedSec: number;
}

export interface CreditScoreInfo {
  score: number; // 300 to 850
  tier: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'D';
  maxLoanLimit: number;
  interestDiscount: number; // discount on loan rates e.g. -0.02
}

export interface BusinessBranch {
  countryId: string;
  count: number;
}

export interface DeepManagementConfig {
  unitPrice?: number;
  priceMultiplier?: number;
  componentQuality?: 'basic' | 'standard' | 'high_end' | 'ultra';
  targetMarket?: 'mass' | 'middle' | 'niche';
  productionSpeed?: number;
  maxProfitMarginPercent?: number; // Capped at max 25-30%
  modelTier?: 'small_7b' | 'enterprise_70b' | 'frontier_400b' | 'agi_super';
  gpuArchTier?: 'mobile_gpu' | 'workstation_gpu' | 'datacenter_tensor' | 'quantum_optics';
}

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  iconName: string; // Lucide icon name string key
  baseCost: number;
  baseRevenue: number; // per sec
  level: number;
  branches: Record<string, number>; // countryId -> branch count
  hasManager: boolean;
  managerCost: number;
  unlocked: boolean;
  unlockCost: number;
  requiredNetWorth: number;
  employeesCount: number;
  marketingLevel: number; // 0 to 5
  // Real-life economy additions
  cogsPercent?: number; // e.g. 0.35 = 35% cost of goods sold
  maintenanceCondition?: number; // 0 to 100%
  rentCost?: number; // per sec base rent
  deepConfig?: DeepManagementConfig;
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  population: string;
  taxRate: number; // e.g. 0.15 = 15%
  laborCostMultiplier: number; // e.g. 0.8 = 20% cheaper labor
  demandMultiplier: number; // e.g. 1.2 = +20% demand
  unlockCost: number;
  isUnlocked: boolean;
  headquarters: boolean;
}

export interface EmployeeDept {
  id: 'management' | 'sales' | 'tech' | 'operations' | 'support';
  name: string;
  description: string;
  count: number;
  baseSalary: number; // per employee per month/sec
  salaryMultiplier: number; // 0.8 to 2.0
  effect: string;
}

export interface TrainingProgram {
  id: string;
  name: string;
  cost: number;
  duration: number; // in seconds
  description: string;
  statBoost: string;
  isCompleted: boolean;
}

export interface ResearchTech {
  id: string;
  name: string;
  category: string;
  costRP: number; // Research points
  costCash: number;
  description: string;
  iconName: string;
  isResearched: boolean;
  requiredTechId?: string;
  effectDescription: string;
}

export type RdProjectCategory = 'ai' | 'cpu' | 'gpu' | 'quantum' | 'tech';

export interface RdProjectSpecs {
  tflops?: number;
  nanometers?: number;
  parametersB?: number;
  accuracyPercent?: number;
  clockGHz?: number;
  coresCount?: number;
}

export interface RdProject {
  id: string;
  name: string;
  customName?: string;
  category: RdProjectCategory;
  description: string;
  iconName: string;
  level: number;
  allocatedBudgetPerSec: number;
  accumulatedExp: number;
  targetExp: number;
  royaltyRevenuePerSec: number;
  companyBoostPercent: number;
  specs: RdProjectSpecs;
  unlocked: boolean;
  requiredNetWorth: number;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'TV' | 'Online' | 'Social' | 'Billboard' | 'Sponsorship';
  costPerSec: number;
  reputationBoost: number;
  revenueMultiplier: number;
  active: boolean;
  durationLeft?: number;
}

export interface StockAsset {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  price: number;
  history: number[];
  ownedShares: number;
  volatility: number;
  trend: 'up' | 'down' | 'stable';
  // Real-world finance additions
  dividendYield?: number; // e.g. 0.035 = 3.5% per year
  peRatio?: number; // e.g. 18.5
  isIndexFund?: boolean;
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  history: number[];
  ownedTokens: number;
  volatility: number;
}

export interface RealEstateAsset {
  id: string;
  name: string;
  location: string;
  cost: number;
  monthlyIncome: number;
  ownedCount: number;
  appreciationRate: number;
  // Real-world real estate additions
  downPaymentRatio?: number; // e.g. 0.25 = 25% down payment
  occupancyRate?: number; // e.g. 0.95 = 95% tenant occupancy
  propertyTaxRate?: number; // e.g. 0.015 = 1.5% annual
  mortgageLoanId?: string;
}

export interface StartupInvestment {
  id: string;
  name: string;
  sector: string;
  valuation: number;
  investmentRequired: number;
  sharePercentage: number;
  risk: 'Low' | 'Medium' | 'High' | 'Extreme';
  status: 'Available' | 'Invested' | 'Acquired' | 'Failed';
  returnMultiplier: number;
}

export interface Competitor {
  id: string;
  name: string;
  ceo: string;
  sector: BusinessCategory;
  cash: number;
  marketShare: number; // 0 - 100%
  aggressiveness: number;
  isAcquired: boolean;
  acquisitionCost: number;
  logoColor: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  choices: {
    label: string;
    action: (state: GameState) => Partial<GameState> & { notification: string };
  }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCash: number;
  unlocked: boolean;
  progress: number;
  target: number;
  category: 'Money' | 'Business' | 'Expansion' | 'Investments' | 'Employees';
}

export interface HistoryDataPoint {
  time: string;
  cash: number;
  netWorth: number;
  revenue: number;
  expenses: number;
}

export interface DetailedFinancials {
  grossRevenue: number;
  cogsExpenses: number;
  employeeExpenses: number;
  rentExpenses: number;
  maintenanceExpenses: number;
  marketingExpenses: number;
  rdExpenses: number;
  loanPayments: number;
  baseOpCost: number;
  totalExpenses: number;
  taxes: number;
  effectiveTax: number;
  netProfitPerSec: number;
  netWorth: number;
  totalDebt: number;
  stockDividendRevenue: number;
  rdRoyaltyRevenue: number;
}

export interface GameState {
  cash: number;
  netWorth: number;
  totalEarned: number;
  researchPoints: number;
  reputation: number; // 0 to 100
  customerSatisfaction: number; // 0 to 100
  employeeHappiness: number; // 0 to 100
  marketTrend: 'Boom' | 'Bull' | 'Neutral' | 'Bear' | 'Recession';
  inflationRate: number; // e.g. 0.035 = 3.5%
  centralBankRate: number; // e.g. 0.085 = 8.5%
  currency: CurrencyType;
  creditScore: number; // 300 to 850
  loans: BankLoan[];
  totalInterestPaid: number;
  stockDividendsEarned: number;
  gameSpeed: number; // 1, 2, 5
  soundEnabled: boolean;
  lastTickTime: number;

  businesses: Business[];
  countries: Country[];
  employees: EmployeeDept[];
  trainings: TrainingProgram[];
  research: ResearchTech[];
  rdProjects: RdProject[];
  marketing: MarketingCampaign[];
  stocks: StockAsset[];
  crypto: CryptoAsset[];
  realEstate: RealEstateAsset[];
  startups: StartupInvestment[];
  goldOz: number;
  goldPrice: number;
  goldHistory: number[];
  competitors: Competitor[];
  achievements: Achievement[];
  history: HistoryDataPoint[];

  // Statistics & Clicker
  clickerLevel: number;
  tapEarnings: number;
  totalTaps: number;
  totalBusinessesOwned: number;
  totalBranchesOwned: number;
}


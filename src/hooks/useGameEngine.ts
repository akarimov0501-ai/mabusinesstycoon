import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, GameEvent, DetailedFinancials, BankLoan, DeepManagementConfig } from '../types/game';
import { initialGameState } from '../data/initialState';
import { randomEvents } from '../data/events';
import { sounds } from '../utils/sound';

const SAVE_KEY = 'business_empire_tycoon_save_v1';

export function useGameEngine() {
  const [state, setState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          // Update employee base salaries & business parameters to match latest configuration
          const updatedEmployees = (parsed.employees || initialGameState.employees).map((emp: any) => {
            const defaultEmp = initialGameState.employees.find((e) => e.id === emp.id);
            return {
              ...emp,
              baseSalary: defaultEmp ? defaultEmp.baseSalary : emp.baseSalary,
            };
          });

          const existingBizMap = new Map<string, any>((parsed.businesses || []).map((b: any) => [b.id, b]));
          const updatedBusinesses = initialGameState.businesses.map((defaultBiz) => {
            const savedBiz: any = existingBizMap.get(defaultBiz.id);
            if (!savedBiz) return defaultBiz;
            return {
              ...defaultBiz,
              ...savedBiz,
              baseRevenue: defaultBiz.baseRevenue,
              baseCost: defaultBiz.baseCost,
              deepConfig: savedBiz.deepConfig || defaultBiz.deepConfig,
            };
          });

          const updatedRealEstate = (parsed.realEstate || initialGameState.realEstate).map((re: any) => {
            const defaultRE = initialGameState.realEstate.find((initR) => initR.id === re.id);
            return {
              ...re,
              monthlyIncome: defaultRE ? defaultRE.monthlyIncome : re.monthlyIncome,
            };
          });

          // Check if parsed state has unsustainable expenses for early game
          let grossRev = 0;
          updatedBusinesses.forEach((b: any) => {
            if (b.level > 0 || b.hasManager) grossRev += (b.baseRevenue || 0) * (b.level || 0);
          });

          let totalSal = 0;
          updatedEmployees.forEach((emp: any) => {
            totalSal += (emp.count || 0) * (emp.baseSalary || 0) * (emp.salaryMultiplier || 1);
          });

          // Calculate asset value from businesses to sanitize legacy inflated saves
          let totalAssetsValue = 0;
          updatedBusinesses.forEach((b: any) => {
            totalAssetsValue += (b.level || 0) * (b.baseCost || 0);
          });

          // If gross revenue is low and expenses exceed revenue, reset employee counts so player is not trapped in negative cash flow
          if (grossRev < 50 && totalSal > grossRev) {
            updatedEmployees.forEach((emp: any) => {
              emp.count = 0;
            });
          }

          // Sanitize legacy inflated cash from previous uncalibrated versions
          let sanitizedCash = parsed.cash ?? initialGameState.cash;
          if (totalAssetsValue < 500000 && sanitizedCash > 1000000) {
            sanitizedCash = Math.max(100, Math.min(sanitizedCash, totalAssetsValue * 2 + 5000));
          } else if (totalAssetsValue < 50000000 && sanitizedCash > 100000000) {
            sanitizedCash = Math.max(1000, Math.min(sanitizedCash, totalAssetsValue * 2 + 50000));
          }

          const updatedRdProjects = (parsed.rdProjects || initialGameState.rdProjects).map((proj: any) => {
            const defaultProj = initialGameState.rdProjects.find((p) => p.id === proj.id);
            return {
              ...defaultProj,
              ...proj,
            };
          });

          return {
            ...initialGameState,
            ...parsed,
            cash: sanitizedCash,
            businesses: updatedBusinesses,
            realEstate: updatedRealEstate,
            employees: updatedEmployees,
            rdProjects: updatedRdProjects,
            lastTickTime: Date.now(),
          };
        } catch {
          // fallback
        }
      }
    }
    return initialGameState;
  });

  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [offlineEarnings, setOfflineEarnings] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync sound setting to sound engine
  useEffect(() => {
    sounds.enabled = state.soundEnabled;
  }, [state.soundEnabled]);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  // Helper to calculate financials
  const calculateFinancials = useCallback((s: GameState): DetailedFinancials => {
    let grossRevenue = 0;
    let cogsExpenses = 0;
    let rentExpenses = 0;
    let maintenanceExpenses = 0;
    let marketingExpenses = 0;
    let rdExpenses = 0;
    let employeeExpenses = 0;
    let stockDividendRevenue = 0;
    let rdRoyaltyRevenue = 0;
    let rdCompanyBoostSum = 0;

    // Calculate R&D Project Expenses & Royalties
    (s.rdProjects || []).forEach((proj) => {
      const isUnlocked = proj.unlocked || s.netWorth >= proj.requiredNetWorth;
      if (isUnlocked && proj.allocatedBudgetPerSec > 0) {
        rdExpenses += proj.allocatedBudgetPerSec;
      }
      if (proj.level > 0) {
        rdRoyaltyRevenue += proj.royaltyRevenuePerSec;
        rdCompanyBoostSum += proj.companyBoostPercent;
      }
    });

    grossRevenue += rdRoyaltyRevenue;

    // Researched Tech perks flags
    const hasAI = s.research.find((r) => r.id === 'ai_optimization')?.isResearched;
    const hasMarketing = s.research.find((r) => r.id === 'better_marketing')?.isResearched;
    const hasRobotics = s.research.find((r) => r.id === 'faster_manufacturing')?.isResearched;
    const hasLogistics = s.research.find((r) => r.id === 'logistics_grid')?.isResearched;
    const hasTaxOpt = s.research.find((r) => r.id === 'tax_optimization')?.isResearched;

    // Employee department multipliers
    const mgrCount = s.employees.find((e) => e.id === 'management')?.count || 0;
    const salesCount = s.employees.find((e) => e.id === 'sales')?.count || 0;
    const opsCount = s.employees.find((e) => e.id === 'operations')?.count || 0;

    // Executive boost (capped at 2.5x max)
    const execBoost = Math.min(2.5, 1 + mgrCount * 0.02 + salesCount * 0.015);
    const rdGlobalBoost = 1 + rdCompanyBoostSum / 100;

    // Active marketing multiplier
    let mktBoost = 0;
    s.marketing.forEach((m) => {
      if (m.active) {
        mktBoost += (m.revenueMultiplier - 1);
        marketingExpenses += m.costPerSec;
      }
    });
    let mktMultiplier = 1 + mktBoost;
    if (hasMarketing) mktMultiplier += 0.25;

    // Businesses revenue, COGS, rent & maintenance degradation
    s.businesses.forEach((b) => {
      if (b.level > 0 || b.hasManager) {
        let rev = b.baseRevenue * b.level;

        if (hasAI && (b.category === 'Technology' || b.category === 'Retail')) rev *= 1.25;
        if (hasRobotics && (b.category === 'Manufacturing' || b.category === 'Construction')) rev *= 1.2;

        // Condition multiplier (0 to 100%)
        const conditionFactor = 0.6 + 0.4 * ((b.maintenanceCondition ?? 100) / 100);
        rev *= conditionFactor;

        // Country branches multiplier (capped at 2.5x max)
        let branchDemand = 1;
        Object.entries(b.branches).forEach(([cId, count]) => {
          const country = s.countries.find((c) => c.id === cId);
          if (country && count > 0) {
            branchDemand += (country.demandMultiplier - 1) * count * 0.15;
          }
        });
        branchDemand = Math.min(2.5, branchDemand);

        // Deep Management Multipliers (pricing & quality)
        let deepPriceMult = 1.0;
        let deepQualityMult = 1.0;
        let deepCogsRate = b.cogsPercent ?? 0.25;

        if (b.deepConfig) {
          deepPriceMult = b.deepConfig.priceMultiplier ?? 1.0;
          if (b.deepConfig.componentQuality === 'ultra') {
            deepQualityMult = 1.3;
            deepCogsRate = 0.38;
          } else if (b.deepConfig.componentQuality === 'high_end') {
            deepQualityMult = 1.15;
            deepCogsRate = 0.30;
          } else if (b.deepConfig.componentQuality === 'basic') {
            deepQualityMult = 0.85;
            deepCogsRate = 0.18;
          } else {
            deepCogsRate = 0.25;
          }

          // AI Model Tier Multipliers
          if (b.deepConfig.modelTier) {
            if (b.deepConfig.modelTier === 'agi_super') {
              deepQualityMult *= 1.6;
              deepCogsRate = 0.40;
            } else if (b.deepConfig.modelTier === 'frontier_400b') {
              deepQualityMult *= 1.35;
              deepCogsRate = 0.32;
            } else if (b.deepConfig.modelTier === 'small_7b') {
              deepQualityMult *= 0.85;
              deepCogsRate = 0.18;
            }
          }

          // GPU Architecture Tier Multipliers
          if (b.deepConfig.gpuArchTier) {
            if (b.deepConfig.gpuArchTier === 'quantum_optics') {
              deepQualityMult *= 1.65;
              deepCogsRate = 0.42;
            } else if (b.deepConfig.gpuArchTier === 'datacenter_tensor') {
              deepQualityMult *= 1.35;
              deepCogsRate = 0.32;
            } else if (b.deepConfig.gpuArchTier === 'mobile_gpu') {
              deepQualityMult *= 0.85;
              deepCogsRate = 0.18;
            }
          }

          if (b.deepConfig.targetMarket === 'niche') {
            deepQualityMult *= 0.85;
            deepPriceMult *= 1.15;
          } else if (b.deepConfig.targetMarket === 'mass') {
            deepQualityMult *= 1.15;
          }
        }

        rev *= branchDemand;
        rev *= execBoost;
        rev *= mktMultiplier;
        rev *= rdGlobalBoost;
        rev *= deepPriceMult * deepQualityMult;

        grossRevenue += rev;

        // COGS (Cost of Goods Sold)
        cogsExpenses += rev * deepCogsRate;

        // Rent / Facility expenses (~7% of gross business revenue)
        const baseRent = b.rentCost ?? (rev * 0.07);
        rentExpenses += baseRent;

        // Equipment wear / maintenance budget (only if condition degraded below 80%)
        if ((b.maintenanceCondition ?? 100) < 80) {
          maintenanceExpenses += rev * 0.03;
        }
      }
    });

    // Real Estate Passive Income (with tenant occupancy rate)
    s.realEstate.forEach((re) => {
      const occupancy = re.occupancyRate ?? 0.95;
      const income = re.monthlyIncome * re.ownedCount * occupancy;
      grossRevenue += income;
      // Property tax & upkeep (proportional to monthly income)
      const taxAndUpkeep = (re.monthlyIncome * 0.15) * re.ownedCount;
      rentExpenses += taxAndUpkeep;
    });

    // Stock Dividends Revenue
    s.stocks.forEach((st) => {
      if (st.ownedShares > 0 && st.dividendYield) {
        // Dividend per sec = (price * ownedShares * yield) / annual_seconds
        const divSec = (st.price * st.ownedShares * st.dividendYield) / 365;
        stockDividendRevenue += divSec;
      }
    });
    grossRevenue += stockDividendRevenue;

    // Employee salaries expenses
    s.employees.forEach((emp) => {
      const sal = emp.count * emp.baseSalary * emp.salaryMultiplier;
      employeeExpenses += sal;
    });

    // Bank Loan servicing payments
    let loanPayments = 0;
    let totalDebt = 0;
    (s.loans || []).forEach((loan) => {
      loanPayments += loan.monthlyPayment;
      totalDebt += loan.remainingAmount;
    });

    // Operations department & Logistics discount on base operational costs
    let opsEfficiencyDiscount = 1 - opsCount * 0.015;
    if (hasLogistics) opsEfficiencyDiscount *= 0.9;
    opsEfficiencyDiscount = Math.max(0.7, opsEfficiencyDiscount);

    // Base overhead operational expenses (10% of Gross Revenue)
    const baseOpCost = grossRevenue * 0.10 * opsEfficiencyDiscount;
    const totalExpenses = cogsExpenses + employeeExpenses + rentExpenses + maintenanceExpenses + marketingExpenses + rdExpenses + loanPayments + baseOpCost;

    // Progressive Corporate Tax (7% micro, 15% medium, 22% enterprise)
    const hqCountry = s.countries.find((c) => c.headquarters) || s.countries[0];
    let baseTaxRate = hqCountry ? hqCountry.taxRate : 0.15;
    if (hasTaxOpt) baseTaxRate = Math.max(0.04, baseTaxRate - 0.05);

    const taxableIncome = Math.max(0, grossRevenue - totalExpenses);
    let taxes = 0;
    if (taxableIncome <= 10000) {
      taxes = taxableIncome * Math.min(baseTaxRate, 0.07);
    } else if (taxableIncome <= 100000) {
      taxes = 10000 * 0.07 + (taxableIncome - 10000) * baseTaxRate;
    } else {
      taxes = 10000 * 0.07 + 90000 * baseTaxRate + (taxableIncome - 100000) * Math.max(baseTaxRate, 0.22);
    }

    const effectiveTax = taxableIncome > 0 ? taxes / taxableIncome : baseTaxRate;
    const rawNetProfit = grossRevenue - totalExpenses - taxes;
    // Cap overall net profit margin to never exceed 30% (max 25-30% range)
    const maxProfitCap = grossRevenue * 0.28;
    const netProfitPerSec = grossRevenue > 0 && rawNetProfit > maxProfitCap ? maxProfitCap : rawNetProfit;

    // Asset Net worth calculation
    let assetValue = s.cash;
    s.businesses.forEach((b) => {
      assetValue += b.level * b.baseCost * 0.8;
    });
    s.stocks.forEach((st) => {
      assetValue += st.ownedShares * st.price;
    });
    s.crypto.forEach((cr) => {
      assetValue += cr.ownedTokens * cr.price;
    });
    s.realEstate.forEach((re) => {
      assetValue += re.ownedCount * re.cost;
    });
    assetValue += s.goldOz * s.goldPrice;
    assetValue -= totalDebt; // Subtract bank debt from net worth

    return {
      grossRevenue,
      cogsExpenses,
      employeeExpenses,
      rentExpenses,
      maintenanceExpenses,
      marketingExpenses,
      rdExpenses,
      loanPayments,
      baseOpCost,
      totalExpenses,
      taxes,
      effectiveTax,
      netProfitPerSec,
      netWorth: Math.max(0, assetValue),
      totalDebt,
      stockDividendRevenue,
      rdRoyaltyRevenue,
    };
  }, []);

  // Main tick function
  const tick = useCallback(() => {
    setState((prev) => {
      const now = Date.now();
      const deltaSec = Math.min(5, (now - prev.lastTickTime) / 1000) * prev.gameSpeed;

      const fin = calculateFinancials(prev);

      const newCash = Math.max(0, prev.cash + fin.netProfitPerSec * deltaSec);
      const newTotalEarned = fin.netProfitPerSec > 0 ? prev.totalEarned + fin.netProfitPerSec * deltaSec : prev.totalEarned;
      const newStockDividends = prev.stockDividendsEarned + fin.stockDividendRevenue * deltaSec;

      // Update Bank Loans (deduct remaining balance)
      const updatedLoans = (prev.loans || []).map((loan) => {
        const paidThisTick = loan.monthlyPayment * deltaSec;
        const newRemaining = Math.max(0, loan.remainingAmount - paidThisTick);
        const newElapsed = loan.elapsedSec + deltaSec;
        return {
          ...loan,
          remainingAmount: newRemaining,
          elapsedSec: newElapsed,
        };
      }).filter((loan) => loan.remainingAmount > 0.01);

      // Business maintenance degradation (slowly wear down by ~0.007% per sec, ~3.5 to 4 hours to degrade)
      const updatedBusinesses = prev.businesses.map((b) => {
        if (b.level > 0) {
          const currentCond = b.maintenanceCondition ?? 100;
          const newCond = Math.max(20, currentCond - 0.007 * deltaSec);
          return { ...b, maintenanceCondition: newCond };
        }
        return b;
      });

      // Credit score calculation (300 to 850)
      let score = 650;
      if (fin.netWorth > 1000) score += Math.min(100, Math.log10(fin.netWorth) * 15);
      if (fin.totalDebt > 0) {
        const debtRatio = fin.totalDebt / (fin.netWorth + 1);
        score -= Math.min(150, debtRatio * 100);
      }
      if (updatedLoans.length === 0 && prev.totalInterestPaid > 0) score += 30; // Paid off debt bonus
      score = Math.round(Math.max(300, Math.min(850, score)));

      // Research points generated by engineers
      const techEngineers = prev.employees.find((e) => e.id === 'tech')?.count || 0;
      const newRP = prev.researchPoints + techEngineers * 2 * deltaSec;

      // Update Stock, Crypto & Gold prices randomly
      const updatedStocks = prev.stocks.map((st) => {
        const delta = (Math.random() - 0.48) * st.volatility * st.price * 0.05;
        const newPrice = Math.max(5, st.price + delta);
        const newHistory = [...st.history.slice(-19), newPrice];
        return {
          ...st,
          price: newPrice,
          history: newHistory,
          trend: delta >= 0 ? ('up' as const) : ('down' as const),
        };
      });

      const updatedCrypto = prev.crypto.map((cr) => {
        const delta = (Math.random() - 0.49) * cr.volatility * cr.price * 0.1;
        const newPrice = Math.max(0.01, cr.price + delta);
        const newHistory = [...cr.history.slice(-19), newPrice];
        return {
          ...cr,
          price: newPrice,
          history: newHistory,
        };
      });

      // Inflation & Central bank rate subtle fluctuations
      let newInflation = prev.inflationRate + (Math.random() - 0.5) * 0.0005;
      newInflation = Math.max(0.01, Math.min(0.14, newInflation));
      let newCBRate = prev.centralBankRate + (Math.random() - 0.5) * 0.0004;
      newCBRate = Math.max(0.05, Math.min(0.18, newCBRate));

      const goldDelta = (Math.random() - 0.48) * 15 * (1 + newInflation);
      const newGoldPrice = Math.max(1000, prev.goldPrice + goldDelta);
      const newGoldHistory = [...prev.goldHistory.slice(-19), newGoldPrice];

      // Update competitors growth slowly
      const updatedCompetitors = prev.competitors.map((comp) => {
        if (comp.isAcquired) return comp;
        const growth = comp.cash * (0.01 + Math.random() * 0.02) * deltaSec;
        return {
          ...comp,
          cash: comp.cash + growth,
        };
      });

      // Update achievements
      const updatedAchievements = prev.achievements.map((ach) => {
        if (ach.unlocked) return ach;
        let progress = ach.progress;
        if (ach.id === 'ach_first_10k' || ach.id === 'ach_first_million' || ach.id === 'ach_first_billion') {
          progress = fin.netWorth;
        } else if (ach.id === 'ach_global_brand') {
          progress = prev.countries.filter((c) => c.isUnlocked).length;
        } else if (ach.id === 'ach_monopoly') {
          progress = prev.competitors.filter((c) => c.isAcquired).length;
        } else if (ach.id === 'ach_stock_trader') {
          progress = prev.stocks.filter((st) => st.ownedShares > 0).length;
        } else if (ach.id === 'ach_space_pioneer') {
          const spaceComp = prev.businesses.find((b) => b.id === 'space_company');
          progress = spaceComp && spaceComp.level > 0 ? 1 : 0;
        }

        const unlocked = progress >= ach.target;
        if (unlocked && !ach.unlocked) {
          sounds.playAchievement();
          showNotification(`🏆 Achievement Unlocked: ${ach.title}! Rewards +${ach.rewardCash.toLocaleString()}`);
        }

        return {
          ...ach,
          progress,
          unlocked,
        };
      });

      // Update history graph data points
      let updatedHistory = prev.history;
      if (prev.history.length === 0 || Math.random() < 0.1) {
        const timeLabel = `${Math.floor((now % 3600000) / 1000)}s`;
        const newPoint = {
          time: timeLabel,
          cash: Math.round(newCash),
          netWorth: Math.round(fin.netWorth),
          revenue: Math.round(fin.grossRevenue),
          expenses: Math.round(fin.totalExpenses),
        };
        updatedHistory = [...prev.history.slice(-20), newPoint];
      }

      // Update R&D Projects Experience & Level Ups based on allocated budget
      const updatedRdProjects = (prev.rdProjects || initialGameState.rdProjects).map((proj) => {
        const isUnlocked = proj.unlocked || fin.netWorth >= proj.requiredNetWorth;
        if (!isUnlocked || proj.allocatedBudgetPerSec <= 0) {
          return { ...proj, unlocked: isUnlocked };
        }

        const deltaExp = proj.allocatedBudgetPerSec * deltaSec;
        let newExp = proj.accumulatedExp + deltaExp;
        let newLevel = proj.level;
        let newTargetExp = proj.targetExp;
        let newRoyalty = proj.royaltyRevenuePerSec;
        let newBoost = proj.companyBoostPercent;
        let newSpecs = { ...proj.specs };

        let leveledUp = false;
        while (newExp >= newTargetExp) {
          newLevel += 1;
          newExp -= newTargetExp;
          newTargetExp = Math.floor(newTargetExp * 1.6);
          newRoyalty = Math.floor(newRoyalty * 1.45 + 5);
          newBoost = Math.min(25, newBoost + 1);
          leveledUp = true;

          // Specs boost based on category
          if (proj.category === 'ai') {
            newSpecs.parametersB = Math.floor((newSpecs.parametersB || 7) * 1.4);
            newSpecs.accuracyPercent = Math.min(99.9, Math.round(((newSpecs.accuracyPercent || 80) + 1.2) * 10) / 10);
            newSpecs.tflops = Math.floor((newSpecs.tflops || 100) * 1.5);
          } else if (proj.category === 'cpu') {
            newSpecs.nanometers = Math.max(1, Math.round(((newSpecs.nanometers || 7) - 0.4) * 10) / 10);
            newSpecs.clockGHz = Math.round(((newSpecs.clockGHz || 3.0) + 0.3) * 10) / 10;
            newSpecs.coresCount = Math.floor((newSpecs.coresCount || 8) * 1.5);
          } else if (proj.category === 'gpu') {
            newSpecs.nanometers = Math.max(1, Math.round(((newSpecs.nanometers || 5) - 0.4) * 10) / 10);
            newSpecs.tflops = Math.floor((newSpecs.tflops || 80) * 1.5);
            newSpecs.coresCount = Math.floor((newSpecs.coresCount || 2048) * 1.5);
          }
        }

        if (leveledUp) {
          sounds.playCash();
          showNotification(`🚀 R&D Muvaffaqiyati: ${proj.customName || proj.name} ${newLevel}-Darajaga erishdi!`);
        }

        return {
          ...proj,
          unlocked: true,
          level: newLevel,
          accumulatedExp: newExp,
          targetExp: newTargetExp,
          royaltyRevenuePerSec: newRoyalty,
          companyBoostPercent: newBoost,
          specs: newSpecs,
        };
      });

      const clickerLvl = prev.clickerLevel || 1;
      const baseTap = Math.floor(1 * Math.pow(1.8, clickerLvl - 1));
      const passiveBonus = fin.grossRevenue * 0.02 * clickerLvl;
      const netWorthBonus = (fin.netWorth || 0) * 0.0001 * clickerLvl;
      const currentTapVal = Math.max(1, Math.round(baseTap + passiveBonus + netWorthBonus));

      return {
        ...prev,
        cash: newCash,
        netWorth: fin.netWorth,
        totalEarned: newTotalEarned,
        stockDividendsEarned: newStockDividends,
        researchPoints: newRP,
        creditScore: score,
        loans: updatedLoans,
        businesses: updatedBusinesses,
        rdProjects: updatedRdProjects,
        inflationRate: newInflation,
        centralBankRate: newCBRate,
        lastTickTime: now,
        stocks: updatedStocks,
        crypto: updatedCrypto,
        goldPrice: newGoldPrice,
        goldHistory: newGoldHistory,
        competitors: updatedCompetitors,
        achievements: updatedAchievements,
        history: updatedHistory,
        tapEarnings: currentTapVal,
      };
    });
  }, [calculateFinancials, showNotification]);

  // Loop timer
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  // Random Events timer (Every 25 seconds 40% chance)
  useEffect(() => {
    const eventTimer = setInterval(() => {
      if (!activeEvent && Math.random() < 0.35) {
        const randEv = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        setActiveEvent(randEv);
        sounds.playSuccess();
      }
    }, 25000);
    return () => clearInterval(eventTimer);
  }, [activeEvent]);

  // Keep stateRef in sync for page exit handlers
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Instant Auto-Save on every state change to browser localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to auto-save game state to localStorage:', e);
    }
  }, [state]);

  // Guaranteed Auto-Save on page exit / refresh / unload / visibility change
  useEffect(() => {
    const handleSaveOnExit = () => {
      try {
        const stateToSave = { ...stateRef.current, lastTickTime: Date.now() };
        localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Error saving state on exit:', e);
      }
    };

    window.addEventListener('beforeunload', handleSaveOnExit);
    window.addEventListener('pagehide', handleSaveOnExit);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleSaveOnExit();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleSaveOnExit);
      window.removeEventListener('pagehide', handleSaveOnExit);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Offline earnings calculation on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed: GameState = JSON.parse(saved);
        if (parsed.lastTickTime) {
          const secondsAway = Math.floor((Date.now() - parsed.lastTickTime) / 1000);
          if (secondsAway > 10) {
            const fin = calculateFinancials(parsed);
            if (fin.netProfitPerSec > 0) {
              const earned = fin.netProfitPerSec * Math.min(secondsAway, 86400 * 2); // Max 2 days offline
              setOfflineEarnings(earned);
              setState((prev) => ({
                ...prev,
                cash: prev.cash + earned,
                totalEarned: prev.totalEarned + earned,
              }));
            }
          }
        }
      } catch {
        // Ignore error
      }
    }
  }, [calculateFinancials]);

  // Tap booster with dynamic scaling & clicker upgrades
  const handleTap = useCallback(() => {
    sounds.playClick();
    setState((prev) => {
      const fin = calculateFinancials(prev);
      const level = prev.clickerLevel || 1;
      const baseTap = Math.floor(1 * Math.pow(1.8, level - 1));
      const passiveBonus = fin.grossRevenue * 0.02 * level;
      const netWorthBonus = (prev.netWorth || 0) * 0.0001 * level;
      const tapVal = Math.max(1, Math.round(baseTap + passiveBonus + netWorthBonus));

      return {
        ...prev,
        cash: prev.cash + tapVal,
        totalEarned: prev.totalEarned + tapVal,
        totalTaps: prev.totalTaps + 1,
        tapEarnings: tapVal,
      };
    });
  }, [calculateFinancials]);

  // Upgrade Clicker Power Level
  const upgradeClicker = useCallback(() => {
    setState((prev) => {
      const currentLevel = prev.clickerLevel || 1;
      const cost = Math.floor(25 * Math.pow(2.2, currentLevel - 1));
      if (prev.cash < cost) {
        showNotification('Not enough cash to upgrade clicker!');
        return prev;
      }

      sounds.playCash();
      const nextLevel = currentLevel + 1;
      showNotification(`Upgraded Clicker Power to Level ${nextLevel}!`);

      return {
        ...prev,
        cash: prev.cash - cost,
        clickerLevel: nextLevel,
      };
    });
  }, [showNotification]);

  // Buy or Upgrade Business
  const buyBusiness = useCallback((bizId: string) => {
    setState((prev) => {
      const biz = prev.businesses.find((b) => b.id === bizId);
      if (!biz) return prev;

      const cost = Math.floor(biz.baseCost * Math.pow(1.22, biz.level));
      if (prev.cash < cost) {
        showNotification('Not enough cash to upgrade!');
        return prev;
      }

      sounds.playCash();
      showNotification(`Upgraded ${biz.name} to Level ${biz.level + 1}!`);

      return {
        ...prev,
        cash: prev.cash - cost,
        businesses: prev.businesses.map((b) =>
          b.id === bizId ? { ...b, level: b.level + 1, unlocked: true } : b
        ),
      };
    });
  }, [showNotification]);

  // Buy Manager for business
  const hireManager = useCallback((bizId: string) => {
    setState((prev) => {
      const biz = prev.businesses.find((b) => b.id === bizId);
      if (!biz || biz.hasManager) return prev;

      if (prev.cash < biz.managerCost) {
        showNotification('Not enough cash for manager!');
        return prev;
      }

      sounds.playCash();
      showNotification(`Hired automated Manager for ${biz.name}!`);

      return {
        ...prev,
        cash: prev.cash - biz.managerCost,
        businesses: prev.businesses.map((b) =>
          b.id === bizId ? { ...b, hasManager: true } : b
        ),
      };
    });
  }, [showNotification]);

  // Unlock Country
  const unlockCountry = useCallback((countryId: string) => {
    setState((prev) => {
      const country = prev.countries.find((c) => c.id === countryId);
      if (!country || country.isUnlocked) return prev;

      if (prev.cash < country.unlockCost) {
        showNotification('Not enough cash to expand to this country!');
        return prev;
      }

      sounds.playSuccess();
      showNotification(`Successfully expanded operations to ${country.name}!`);

      return {
        ...prev,
        cash: prev.cash - country.unlockCost,
        countries: prev.countries.map((c) =>
          c.id === countryId ? { ...c, isUnlocked: true } : c
        ),
      };
    });
  }, [showNotification]);

  // Hire/Fire Employees
  const updateEmployees = useCallback((deptId: string, delta: number) => {
    setState((prev) => {
      const dept = prev.employees.find((e) => e.id === deptId);
      if (!dept) return prev;

      const newCount = Math.max(0, dept.count + delta);
      sounds.playClick();

      return {
        ...prev,
        employees: prev.employees.map((e) =>
          e.id === deptId ? { ...e, count: newCount } : e
        ),
      };
    });
  }, []);

  // Update Salary Multiplier
  const updateSalaryMultiplier = useCallback((deptId: string, multiplier: number) => {
    setState((prev) => ({
      ...prev,
      employees: prev.employees.map((e) =>
        e.id === deptId ? { ...e, salaryMultiplier: multiplier } : e
      ),
    }));
  }, []);

  // Complete Training
  const completeTraining = useCallback((trainingId: string) => {
    setState((prev) => {
      const tr = prev.trainings.find((t) => t.id === trainingId);
      if (!tr || tr.isCompleted) return prev;

      if (prev.cash < tr.cost) {
        showNotification('Not enough cash for this training program!');
        return prev;
      }

      sounds.playSuccess();
      showNotification(`Completed training: ${tr.name}! (${tr.statBoost})`);

      return {
        ...prev,
        cash: prev.cash - tr.cost,
        trainings: prev.trainings.map((t) =>
          t.id === trainingId ? { ...t, isCompleted: true } : t
        ),
      };
    });
  }, [showNotification]);

  // Conduct Research
  const conductResearch = useCallback((techId: string) => {
    setState((prev) => {
      const tech = prev.research.find((r) => r.id === techId);
      if (!tech || tech.isResearched) return prev;

      if (prev.researchPoints < tech.costRP || prev.cash < tech.costCash) {
        showNotification('Insufficient Research Points or Cash!');
        return prev;
      }

      sounds.playSuccess();
      showNotification(`Researched Tech: ${tech.name}!`);

      return {
        ...prev,
        cash: prev.cash - tech.costCash,
        researchPoints: prev.researchPoints - tech.costRP,
        research: prev.research.map((r) =>
          r.id === techId ? { ...r, isResearched: true } : r
        ),
      };
    });
  }, [showNotification]);

  // Toggle Marketing Campaign
  const toggleMarketing = useCallback((mktId: string) => {
    setState((prev) => {
      const mkt = prev.marketing.find((m) => m.id === mktId);
      if (!mkt) return prev;

      const nextActive = !mkt.active;
      sounds.playClick();
      showNotification(`${mkt.name} campaign ${nextActive ? 'activated' : 'paused'}!`);

      return {
        ...prev,
        marketing: prev.marketing.map((m) =>
          m.id === mktId ? { ...m, active: nextActive } : m
        ),
      };
    });
  }, [showNotification]);

  // Stock trading
  const buyStock = useCallback((stockId: string, shares: number) => {
    setState((prev) => {
      const stock = prev.stocks.find((s) => s.id === stockId);
      if (!stock) return prev;

      const totalCost = stock.price * shares;
      if (prev.cash < totalCost) {
        showNotification('Not enough cash to buy shares!');
        return prev;
      }

      sounds.playCash();
      showNotification(`Purchased ${shares} shares of ${stock.symbol}!`);

      return {
        ...prev,
        cash: prev.cash - totalCost,
        stocks: prev.stocks.map((s) =>
          s.id === stockId ? { ...s, ownedShares: s.ownedShares + shares } : s
        ),
      };
    });
  }, [showNotification]);

  const sellStock = useCallback((stockId: string, shares: number) => {
    setState((prev) => {
      const stock = prev.stocks.find((s) => s.id === stockId);
      if (!stock || stock.ownedShares < shares) {
        showNotification('Not enough shares owned!');
        return prev;
      }

      const returnAmount = stock.price * shares;
      sounds.playCash();
      showNotification(`Sold ${shares} shares of ${stock.symbol} for $${returnAmount.toLocaleString()}!`);

      return {
        ...prev,
        cash: prev.cash + returnAmount,
        stocks: prev.stocks.map((s) =>
          s.id === stockId ? { ...s, ownedShares: s.ownedShares - shares } : s
        ),
      };
    });
  }, [showNotification]);

  // Crypto trading
  const buyCrypto = useCallback((cryptoId: string, amount: number) => {
    setState((prev) => {
      const cr = prev.crypto.find((c) => c.id === cryptoId);
      if (!cr) return prev;

      const totalCost = cr.price * amount;
      if (prev.cash < totalCost) {
        showNotification('Not enough cash to buy Crypto!');
        return prev;
      }

      sounds.playCash();
      showNotification(`Bought ${amount} ${cr.symbol}!`);

      return {
        ...prev,
        cash: prev.cash - totalCost,
        crypto: prev.crypto.map((c) =>
          c.id === cryptoId ? { ...c, ownedTokens: c.ownedTokens + amount } : c
        ),
      };
    });
  }, [showNotification]);

  const sellCrypto = useCallback((cryptoId: string, amount: number) => {
    setState((prev) => {
      const cr = prev.crypto.find((c) => c.id === cryptoId);
      if (!cr || cr.ownedTokens < amount) {
        showNotification('Not enough tokens owned!');
        return prev;
      }

      const totalGain = cr.price * amount;
      sounds.playCash();
      showNotification(`Sold ${amount} ${cr.symbol}!`);

      return {
        ...prev,
        cash: prev.cash + totalGain,
        crypto: prev.crypto.map((c) =>
          c.id === cryptoId ? { ...c, ownedTokens: c.ownedTokens - amount } : c
        ),
      };
    });
  }, [showNotification]);

  // Real Estate Purchase
  const buyRealEstate = useCallback((reId: string) => {
    setState((prev) => {
      const re = prev.realEstate.find((r) => r.id === reId);
      if (!re) return prev;

      if (prev.cash < re.cost) {
        showNotification('Not enough cash for real estate purchase!');
        return prev;
      }

      sounds.playCash();
      showNotification(`Purchased ${re.name}!`);

      return {
        ...prev,
        cash: prev.cash - re.cost,
        realEstate: prev.realEstate.map((r) =>
          r.id === reId ? { ...r, ownedCount: r.ownedCount + 1 } : r
        ),
      };
    });
  }, [showNotification]);

  // Acquire Competitor
  const acquireCompetitor = useCallback((compId: string) => {
    setState((prev) => {
      const comp = prev.competitors.find((c) => c.id === compId);
      if (!comp || comp.isAcquired) return prev;

      if (prev.cash < comp.acquisitionCost) {
        showNotification('Not enough cash for hostile takeover!');
        return prev;
      }

      sounds.playAchievement();
      showNotification(`🎉 Acquired ${comp.name}! Market monopoly established!`);

      return {
        ...prev,
        cash: prev.cash - comp.acquisitionCost,
        reputation: Math.min(100, prev.reputation + 20),
        competitors: prev.competitors.map((c) =>
          c.id === compId ? { ...c, isAcquired: true } : c
        ),
      };
    });
  }, [showNotification]);

  // Handle Event choice
  const handleEventChoice = useCallback((choiceIdx: number) => {
    if (!activeEvent) return;

    const choice = activeEvent.choices[choiceIdx];
    if (choice) {
      setState((prev) => {
        const result = choice.action(prev);
        if (result.notification) {
          showNotification(result.notification);
        }
        return {
          ...prev,
          ...result,
        };
      });
    }
    setActiveEvent(null);
  }, [activeEvent, showNotification]);

  // Game Speed Toggle
  const setGameSpeed = useCallback((speed: number) => {
    sounds.playClick();
    setState((prev) => ({ ...prev, gameSpeed: speed }));
  }, []);

  // Audio Toggle
  const toggleSound = useCallback(() => {
    setState((prev) => {
      const next = !prev.soundEnabled;
      sounds.enabled = next;
      return { ...prev, soundEnabled: next };
    });
  }, []);

  // Bank Loan & Mortgage System
  const takeLoan = useCallback((amount: number, termSec: number, loanType: BankLoan['loanType']) => {
    setState((prev) => {
      const score = prev.creditScore || 650;
      if (score < 400 && loanType !== 'micro') {
        showNotification('Credit rating too low for this loan type!');
        return prev;
      }

      // Interest rate based on central bank rate + risk margin - credit score discount
      const creditDiscount = (score - 600) * 0.0002;
      const baseRate = prev.centralBankRate || 0.085;
      let margin = 0.04;
      if (loanType === 'micro') margin = 0.08;
      if (loanType === 'commercial') margin = 0.05;
      if (loanType === 'mortgage') margin = 0.03;
      if (loanType === 'line_of_credit') margin = 0.06;

      const annualRate = Math.max(0.04, baseRate + margin - creditDiscount);
      // Monthly/per-sec debt servicing payment = (amount * (1 + annualRate)) / termSec
      const monthlyPayment = (amount * (1 + annualRate * (termSec / 300))) / termSec;

      const newLoan: BankLoan = {
        id: `loan_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: loanType === 'mortgage' ? 'Ipoteka Krediti' : loanType === 'commercial' ? 'Tijorat Biznes Krediti' : loanType === 'micro' ? 'Kichik Biznes Krediti' : 'Kredit Liniyasi',
        loanType,
        amount,
        remainingAmount: amount * (1 + annualRate * (termSec / 300)),
        monthlyPayment,
        interestRate: annualRate,
        termSec,
        elapsedSec: 0,
      };

      sounds.playCash();
      showNotification(`Bank loan approved! +$${amount.toLocaleString()} received.`);

      return {
        ...prev,
        cash: prev.cash + amount,
        loans: [...(prev.loans || []), newLoan],
      };
    });
  }, [showNotification]);

  const repayLoan = useCallback((loanId: string) => {
    setState((prev) => {
      const loan = (prev.loans || []).find((l) => l.id === loanId);
      if (!loan) return prev;

      if (prev.cash < loan.remainingAmount) {
        showNotification('Not enough cash to pay off loan!');
        return prev;
      }

      sounds.playCash();
      showNotification(`Paid off loan: ${loan.name}! Credit score boosted!`);

      return {
        ...prev,
        cash: prev.cash - loan.remainingAmount,
        totalInterestPaid: (prev.totalInterestPaid || 0) + (loan.remainingAmount - loan.amount),
        creditScore: Math.min(850, (prev.creditScore || 650) + 15),
        loans: (prev.loans || []).filter((l) => l.id !== loanId),
      };
    });
  }, [showNotification]);

  // Maintain Business Equipment / Condition
  const maintainBusiness = useCallback((bizId: string) => {
    setState((prev) => {
      const biz = prev.businesses.find((b) => b.id === bizId);
      if (!biz) return prev;

      const cost = Math.round(biz.baseCost * 0.05);
      if (prev.cash < cost) {
        showNotification('Not enough cash for equipment maintenance!');
        return prev;
      }

      sounds.playSuccess();
      showNotification(`Restored equipment for ${biz.name}! 100% operational condition.`);

      return {
        ...prev,
        cash: prev.cash - cost,
        businesses: prev.businesses.map((b) =>
          b.id === bizId ? { ...b, maintenanceCondition: 100 } : b
        ),
      };
    });
  }, [showNotification]);

  // Buy Real Estate with Mortgage
  const buyRealEstateWithMortgage = useCallback((reId: string) => {
    setState((prev) => {
      const re = prev.realEstate.find((r) => r.id === reId);
      if (!re) return prev;

      const downRatio = re.downPaymentRatio ?? 0.25;
      const downPayment = re.cost * downRatio;
      const loanAmount = re.cost * (1 - downRatio);

      if (prev.cash < downPayment) {
        showNotification(`Not enough cash for ${downRatio * 100}% down payment!`);
        return prev;
      }

      const score = prev.creditScore || 650;
      if (score < 500) {
        showNotification('Credit score too low for bank mortgage!');
        return prev;
      }

      // Create mortgage loan automatically
      const annualRate = Math.max(0.04, (prev.centralBankRate || 0.085) + 0.035 - (score - 600) * 0.0002);
      const termSec = 600; // 10 min mortgage
      const monthlyPayment = (loanAmount * (1 + annualRate * 2)) / termSec;

      const mortgageLoan: BankLoan = {
        id: `mortgage_${Date.now()}`,
        name: `Ipoteka: ${re.name}`,
        loanType: 'mortgage',
        amount: loanAmount,
        remainingAmount: loanAmount * (1 + annualRate * 2),
        monthlyPayment,
        interestRate: annualRate,
        termSec,
        elapsedSec: 0,
      };

      sounds.playCash();
      showNotification(`Purchased ${re.name} with ${downRatio * 100}% down payment + Mortgage!`);

      return {
        ...prev,
        cash: prev.cash - downPayment,
        loans: [...(prev.loans || []), mortgageLoan],
        realEstate: prev.realEstate.map((r) =>
          r.id === reId ? { ...r, ownedCount: r.ownedCount + 1 } : r
        ),
      };
    });
  }, [showNotification]);

  // Currency toggle ($ USD / UZS)
  const toggleCurrency = useCallback(() => {
    setState((prev) => {
      const nextCurr = prev.currency === 'UZS' ? 'USD' : 'UZS';
      sounds.playClick();
      showNotification(`Switched currency display to ${nextCurr}!`);
      return { ...prev, currency: nextCurr };
    });
  }, [showNotification]);

  // Save / Load / Reset
  const manualSave = useCallback(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    sounds.playSuccess();
    showNotification('Game progress saved locally!');
  }, [state, showNotification]);

  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState(initialGameState);
    sounds.playClick();
    showNotification('Game reset to default state.');
  }, [showNotification]);

  // Update R&D Project Budget Allocation
  const updateRdBudget = useCallback((projectId: string, budget: number) => {
    setState((prev) => ({
      ...prev,
      rdProjects: (prev.rdProjects || []).map((p) =>
        p.id === projectId ? { ...p, allocatedBudgetPerSec: Math.max(0, budget) } : p
      ),
    }));
  }, []);

  // Rename R&D Model / Chip Project Name
  const renameRdProject = useCallback((projectId: string, customName: string) => {
    setState((prev) => ({
      ...prev,
      rdProjects: (prev.rdProjects || []).map((p) =>
        p.id === projectId ? { ...p, customName: customName.trim() || p.name } : p
      ),
    }));
  }, []);

  const updateBusinessDeepConfig = useCallback((businessId: string, deepConfig: DeepManagementConfig) => {
    setState((prev) => ({
      ...prev,
      businesses: prev.businesses.map((b) => {
        if (b.id === businessId) {
          return {
            ...b,
            deepConfig: {
              ...b.deepConfig,
              ...deepConfig,
            },
          };
        }
        return b;
      }),
    }));
    sounds.playClick();
  }, []);

  const exportSave = useCallback(() => {
    const jsonStr = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business_empire_tycoon_save_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Save file exported successfully!');
  }, [state, showNotification]);

  const importSave = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      setState({
        ...initialGameState,
        ...parsed,
        lastTickTime: Date.now(),
      });
      sounds.playSuccess();
      showNotification('Save file imported successfully!');
    } catch {
      showNotification('Invalid save file format!');
    }
  }, [showNotification]);

  const financials = calculateFinancials(state);

  return {
    state,
    financials,
    activeEvent,
    offlineEarnings,
    notification,
    closeOfflineModal: () => setOfflineEarnings(null),
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
  };
}


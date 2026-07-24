import { GameEvent, GameState } from '../types/game';

export const randomEvents: GameEvent[] = [
  {
    id: 'ev_viral_trend',
    title: '🔥 Viral Social Media Trend',
    description: 'A famous influencer posted a video featuring your products! Customer demand is surging through the roof.',
    type: 'positive',
    choices: [
      {
        label: 'Capitalize! (+20% Revenue Boost)',
        action: (s: GameState) => ({
          reputation: Math.min(100, s.reputation + 10),
          customerSatisfaction: Math.min(100, s.customerSatisfaction + 15),
          notification: 'Viral trend boosted reputation and customer satisfaction!',
        }),
      },
    ],
  },
  {
    id: 'ev_celeb_endorse',
    title: '⭐ Celebrity Endorsement',
    description: 'An A-list celebrity wants to become the official global ambassador of your brand.',
    type: 'positive',
    choices: [
      {
        label: 'Sign Deal ($10k Cost, +25 Reputation)',
        action: (s: GameState) => {
          if (s.cash >= 10000) {
            return {
              cash: s.cash - 10000,
              reputation: Math.min(100, s.reputation + 25),
              notification: 'Celebrity endorsement deal signed!',
            };
          }
          return { notification: 'Insufficient cash for endorsement.' };
        },
      },
      {
        label: 'Decline respectfully',
        action: () => ({ notification: 'You passed on the endorsement.' }),
      },
    ],
  },
  {
    id: 'ev_tech_boom',
    title: '🚀 Breakthrough AI & Tech Boom',
    description: 'Global venture capital is pouring into tech companies and automation software.',
    type: 'positive',
    choices: [
      {
        label: 'Harvest +100 Research Points!',
        action: (s: GameState) => ({
          researchPoints: s.researchPoints + 100,
          notification: 'Gained +100 Research Points from the Tech Boom!',
        }),
      },
    ],
  },
  {
    id: 'ev_strike',
    title: '📢 Employee Strike Risk',
    description: 'Staff members are demanding better perks, safety measures, and competitive salary adjustments.',
    type: 'negative',
    choices: [
      {
        label: 'Grant Bonus Pool (+10% Employee Happiness, $5k cost)',
        action: (s: GameState) => {
          const cost = Math.min(s.cash * 0.05, 50000);
          return {
            cash: Math.max(0, s.cash - cost),
            employeeHappiness: Math.min(100, s.employeeHappiness + 15),
            notification: 'Granted staff bonuses. Morale skyrocketed!',
          };
        },
      },
      {
        label: 'Negotiate sternly (-10% Employee Happiness)',
        action: (s: GameState) => ({
          employeeHappiness: Math.max(10, s.employeeHappiness - 10),
          notification: 'Negotiations were tough. Morale dropped slightly.',
        }),
      },
    ],
  },
  {
    id: 'ev_economic_boom',
    title: '📈 Economic Boom Cycle',
    description: 'Consumer confidence is high and global stock markets are reaching all-time highs.',
    type: 'positive',
    choices: [
      {
        label: 'Ride the Bull Market!',
        action: () => ({
          marketTrend: 'Boom',
          notification: 'Entered an Economic Boom cycle!',
        }),
      },
    ],
  },
  {
    id: 'ev_recession',
    title: '📉 Supply Chain & Inflation Shock',
    description: 'Rising logistics costs and global economic inflation are pressing corporate margins.',
    type: 'negative',
    choices: [
      {
        label: 'Absorb costs (-5% cash)',
        action: (s: GameState) => ({
          cash: Math.max(0, s.cash * 0.95),
          marketTrend: 'Bear',
          notification: 'Absorbed supply chain inflation costs.',
        }),
      },
    ],
  },
];

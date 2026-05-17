import type { Route } from '@src/mock/types';

export type Priorities = {
  budget: number;
  speed: number;
  eco: number;
};

export const DEFAULT_PRIORITIES: Priorities = { budget: 0.5, speed: 0.5, eco: 0.5 };

const normalize = (values: number[]): number[] => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 0.5);
  return values.map((v) => (v - min) / (max - min));
};

export const scoreRoutes = (routes: Route[], p: Priorities): Route[] => {
  if (routes.length === 0) return routes;
  const sumW = Math.max(0.01, p.budget + p.speed + p.eco);
  const w = {
    budget: p.budget / sumW,
    speed: p.speed / sumW,
    eco: p.eco / sumW,
  };

  const prices = normalize(routes.map((r) => r.totalPriceEur));
  const durations = normalize(routes.map((r) => r.totalDurationMin));
  const co2s = normalize(routes.map((r) => r.totalCo2Kg));

  const scored = routes.map((route, i) => {
    const cost = w.budget * prices[i] + w.speed * durations[i] + w.eco * co2s[i];
    return { route, score: 1 - cost };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.route);
};

export const annotateBadges = (routes: Route[], p: Priorities): Route[] => {
  if (routes.length === 0) return routes;
  const ordered = [...routes];

  const fastest = [...ordered].sort((a, b) => a.totalDurationMin - b.totalDurationMin)[0];
  const cheapest = [...ordered].sort((a, b) => a.totalPriceEur - b.totalPriceEur)[0];
  const eco = [...ordered].sort((a, b) => a.totalCo2Kg - b.totalCo2Kg)[0];
  const best = scoreRoutes(ordered, p)[0];

  return ordered.map((r) => {
    const badges: Route['badges'] = [];
    if (r.id === best.id) badges.push('best');
    if (r.id === fastest.id) badges.push('fastest');
    if (r.id === cheapest.id) badges.push('cheapest');
    if (r.id === eco.id) badges.push('eco');
    return { ...r, badges };
  });
};

export const sortRoutes = (
  routes: Route[],
  mode: 'best' | 'fastest' | 'cheapest' | 'eco',
  p: Priorities,
): Route[] => {
  switch (mode) {
    case 'fastest':
      return [...routes].sort((a, b) => a.totalDurationMin - b.totalDurationMin);
    case 'cheapest':
      return [...routes].sort((a, b) => a.totalPriceEur - b.totalPriceEur);
    case 'eco':
      return [...routes].sort((a, b) => a.totalCo2Kg - b.totalCo2Kg);
    case 'best':
    default:
      return scoreRoutes(routes, p);
  }
};

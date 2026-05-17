export const formatDuration = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const formatPrice = (eur: number): string => {
  if (eur === Math.floor(eur)) return `€${eur}`;
  return `€${eur.toFixed(2)}`;
};

export const formatCo2 = (kg: number): string => `${kg.toFixed(1)} kg`;

const pad = (n: number) => n.toString().padStart(2, '0');

export const formatClock = (iso: string): string => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const formatShortDate = (iso: string, locale: string = 'en-GB'): string => {
  const d = new Date(iso);
  return d.toLocaleDateString(locale, { day: '2-digit', month: 'short' });
};

export const formatLongDate = (iso: string, locale: string = 'en-GB'): string => {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString(locale, { weekday: 'long' });
  const day = d.getDate();
  const month = d.toLocaleDateString(locale, { month: 'long' });
  return `${weekday}, ${day} ${month}`;
};

export const diffMinutes = (aIso: string, bIso: string): number => {
  return Math.round((new Date(bIso).getTime() - new Date(aIso).getTime()) / 60000);
};

export const relativeFromNow = (iso: string): { sign: 'past' | 'future'; text: string } => {
  const diffMs = new Date(iso).getTime() - Date.now();
  const sign: 'past' | 'future' = diffMs >= 0 ? 'future' : 'past';
  const abs = Math.abs(diffMs);
  const d = Math.floor(abs / 86400000);
  const h = Math.floor((abs % 86400000) / 3600000);
  const m = Math.floor((abs % 3600000) / 60000);
  if (d > 0) return { sign, text: `${d}d ${h}h` };
  if (h > 0) return { sign, text: `${h}h ${m}m` };
  return { sign, text: `${m}m` };
};

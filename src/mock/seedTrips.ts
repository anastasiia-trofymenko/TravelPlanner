import { getCityById } from './cities';
import { generateRoutes } from './generateRoutes';
import type { SavedItem, Trip } from './types';

const pad = (n: number) => n.toString().padStart(2, '0');
const dateString = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const ALL_MODES: any = ['train', 'bus', 'flight', 'subway', 'taxi', 'walk', 'tram', 'ferry'];

export const SEED_INSPIRATIONS: SavedItem[] = [
  {
    id: 'insp-par-mil',
    origin: getCityById('par'),
    destination: getCityById('mil'),
    fromPrice: 89,
    note: 'Fashion weekend',
  },
  {
    id: 'insp-vie-prg',
    origin: getCityById('vie'),
    destination: getCityById('prg'),
    fromPrice: 34,
    note: 'Eco weekend',
  },
  {
    id: 'insp-mun-ber',
    origin: getCityById('muc'),
    destination: getCityById('ber'),
    fromPrice: 49,
    note: 'Quick getaway',
  },
  {
    id: 'insp-vie-mun',
    origin: getCityById('vie'),
    destination: getCityById('muc'),
    fromPrice: 41,
    note: 'Business sprint',
  },
];

export const buildSeedTrip = (): Trip | null => {
  const routes = generateRoutes({
    originId: 'vie',
    destinationId: 'muc',
    date: dateString(3),
    passengers: 1,
    modes: ALL_MODES,
  });
  if (!routes.length) return null;
  const route = routes[0];
  return {
    id: `seed-${Date.now()}`,
    route,
    passengers: 1,
    bookedAt: new Date().toISOString(),
    status: 'upcoming',
  };
};

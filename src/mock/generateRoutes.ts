import type {
  City,
  Route,
  Segment,
  TransportMode,
  SearchQuery,
} from './types';
import { co2PerKm, OPERATORS, pricePerKm, speedKmh } from './operators';
import { getCityById, CITIES } from './cities';

export const haversineKm = (a: City, b: City): number => {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.coords.lat - a.coords.lat);
  const dLng = toRad(b.coords.lng - a.coords.lng);
  const aa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.coords.lat)) * Math.cos(toRad(b.coords.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
};

const seededRand = (seed: string) => {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
};

const pad = (n: number) => n.toString().padStart(2, '0');
const isoFromDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;

const addMinutes = (iso: string, mins: number) => {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + mins);
  return isoFromDate(d);
};

const makeSegment = (
  rand: () => number,
  mode: TransportMode,
  from: City,
  to: City,
  departure: string,
  passengers: number,
  options: {
    operatorOverride?: string;
    line?: string;
    distanceOverrideKm?: number;
    durationOverrideMin?: number;
    priceMultiplier?: number;
  } = {},
): Segment => {
  const dist = options.distanceOverrideKm ?? haversineKm(from, to) * 1.15;
  const baseSpeed = speedKmh[mode];
  const durationMin =
    options.durationOverrideMin ?? Math.round((dist / baseSpeed) * 60) + (mode === 'flight' ? 60 : 0);
  const operator =
    options.operatorOverride ?? OPERATORS[mode][Math.floor(rand() * OPERATORS[mode].length)];
  const lineSuffix = Math.floor(100 + rand() * 900);
  const line =
    options.line ??
    (mode === 'train'
      ? `${['ICE', 'RJX', 'EC', 'IC', 'TGV'][Math.floor(rand() * 5)]} ${lineSuffix}`
      : mode === 'flight'
      ? `${operator.slice(0, 2).toUpperCase()} ${lineSuffix}`
      : mode === 'bus'
      ? `Coach ${lineSuffix}`
      : mode === 'taxi'
      ? `${operator} pickup`
      : mode === 'subway'
      ? `${['U1', 'U2', 'U3', 'U4', 'M1', 'M2'][Math.floor(rand() * 6)]}`
      : mode === 'tram'
      ? `Tram ${1 + Math.floor(rand() * 30)}`
      : 'Walking');
  const arrival = addMinutes(departure, durationMin);
  const priceBase = pricePerKm[mode] * dist * passengers;
  const priceEur = Math.max(
    mode === 'walk' ? 0 : 3,
    Math.round(priceBase * (options.priceMultiplier ?? 0.9 + rand() * 0.5)),
  );
  const co2Kg = +(co2PerKm[mode] * dist * passengers).toFixed(1);
  const comfort: Segment['comfort'] =
    mode === 'flight' || mode === 'train'
      ? rand() > 0.4
        ? 'high'
        : 'medium'
      : mode === 'bus'
      ? rand() > 0.6
        ? 'medium'
        : 'low'
      : mode === 'taxi'
      ? 'high'
      : 'low';
  const platform =
    mode === 'train'
      ? `${1 + Math.floor(rand() * 18)}`
      : mode === 'flight'
      ? `Gate ${String.fromCharCode(65 + Math.floor(rand() * 6))}${1 + Math.floor(rand() * 30)}`
      : mode === 'bus'
      ? `Bay ${1 + Math.floor(rand() * 14)}`
      : undefined;
  const seat =
    mode === 'train' || mode === 'flight'
      ? `${1 + Math.floor(rand() * 28)}${'ABCDF'[Math.floor(rand() * 5)]}`
      : undefined;

  return {
    id: `${from.id}-${to.id}-${mode}-${Math.floor(rand() * 1e6)}`,
    mode,
    from,
    to,
    departure,
    arrival,
    durationMin,
    priceEur,
    co2Kg,
    operator,
    line,
    platform,
    seat,
    comfort,
    hasWifi: mode === 'train' || mode === 'flight' ? rand() > 0.25 : false,
    hasTable: mode === 'train' ? rand() > 0.45 : false,
  };
};

const finalizeRoute = (
  segments: Segment[],
  origin: City,
  destination: City,
  rand: () => number,
): Route => {
  const totalDurationMin = segments.reduce((sum, s, i) => {
    if (i === 0) return s.durationMin;
    const prev = segments[i - 1];
    const transfer = Math.max(
      0,
      Math.round((new Date(s.departure).getTime() - new Date(prev.arrival).getTime()) / 60000),
    );
    return sum + transfer + s.durationMin;
  }, 0);

  const totalPriceEur = segments.reduce((s, x) => s + x.priceEur, 0);
  const totalCo2Kg = +segments.reduce((s, x) => s + x.co2Kg, 0).toFixed(1);
  const transferCount = Math.max(0, segments.length - 1);
  const reliabilityPct = 88 + Math.floor(rand() * 11);

  const dist = haversineKm(origin, destination) * 1.1;
  const flightAltCo2Kg = +(co2PerKm.flight * dist * 1.3).toFixed(1);

  return {
    id: `route-${segments[0].id}-${Math.floor(rand() * 1e9)}`,
    segments,
    totalDurationMin,
    totalPriceEur,
    totalCo2Kg,
    transferCount,
    reliabilityPct,
    flightAltCo2Kg,
    badges: [],
    origin,
    destination,
    departureAt: segments[0].departure,
    arrivalAt: segments[segments.length - 1].arrival,
  };
};

const HUBS_BY_REGION: Record<string, string[]> = {
  west: ['fra', 'cgn', 'str', 'lyo', 'bru'],
  east: ['prg', 'bts', 'bud', 'krk'],
  south: ['mil', 'zrh', 'flr', 'inn', 'vce'],
  north: ['ham', 'ber', 'ams', 'cph'],
};

const pickHub = (origin: City, destination: City, rand: () => number): City | null => {
  const midLat = (origin.coords.lat + destination.coords.lat) / 2;
  const midLng = (origin.coords.lng + destination.coords.lng) / 2;
  const exclude = new Set([origin.id, destination.id]);
  const candidates = CITIES.filter((c) => !exclude.has(c.id));
  candidates.sort((a, b) => {
    const da = (a.coords.lat - midLat) ** 2 + (a.coords.lng - midLng) ** 2;
    const db = (b.coords.lat - midLat) ** 2 + (b.coords.lng - midLng) ** 2;
    return da - db;
  });
  return candidates[Math.floor(rand() * 3)] ?? null;
};

export const generateRoutes = (query: SearchQuery): Route[] => {
  const origin = getCityById(query.originId);
  const destination = getCityById(query.destinationId);
  if (origin.id === destination.id) return [];

  const seed = `${query.originId}-${query.destinationId}-${query.date}`;
  const rand = seededRand(seed);
  const baseDate = new Date(`${query.date}T08:00:00`);
  const dist = haversineKm(origin, destination);
  const routes: Route[] = [];
  const enabled = new Set(query.modes);

  // 1. Direct fast train (always present if reasonable distance)
  if (dist < 1400 && enabled.has('train')) {
    const dep = isoFromDate(baseDate);
    const seg = makeSegment(rand, 'train', origin, destination, dep, query.passengers, {
      priceMultiplier: 0.95,
    });
    routes.push(finalizeRoute([seg], origin, destination, rand));
  }

  // 2. Flight direct
  if (dist > 400 && enabled.has('flight')) {
    const dep = isoFromDate(new Date(baseDate.getTime() + 90 * 60000));
    const seg = makeSegment(rand, 'flight', origin, destination, dep, query.passengers, {
      priceMultiplier: 1.1,
    });
    routes.push(finalizeRoute([seg], origin, destination, rand));
  }

  // 3. Train + Subway combo (door-to-door)
  if (dist < 1200 && enabled.has('train')) {
    const subwayFrom = origin;
    const trainStart = origin;
    const dep = isoFromDate(new Date(baseDate.getTime() + 15 * 60000));
    const train = makeSegment(rand, 'train', trainStart, destination, dep, query.passengers, {
      priceMultiplier: 1.0,
    });
    const transferMin = 12 + Math.floor(rand() * 8);
    const subwayDep = addMinutes(train.arrival, transferMin);
    const subway = makeSegment(
      rand,
      'subway',
      destination,
      destination,
      subwayDep,
      query.passengers,
      { distanceOverrideKm: 8, durationOverrideMin: 18, priceMultiplier: 0.7 },
    );
    routes.push(finalizeRoute([train, subway], origin, destination, rand));
  }

  // 4. Taxi + Train + Subway (Elena-style full multimodal)
  if (dist < 1100 && enabled.has('train') && enabled.has('taxi')) {
    const dep = isoFromDate(new Date(baseDate.getTime() - 30 * 60000));
    const taxi = makeSegment(rand, 'taxi', origin, origin, dep, query.passengers, {
      distanceOverrideKm: 6,
      durationOverrideMin: 14,
      priceMultiplier: 1.1,
    });
    const trainDep = addMinutes(taxi.arrival, 18 + Math.floor(rand() * 12));
    const train = makeSegment(rand, 'train', origin, destination, trainDep, query.passengers, {
      priceMultiplier: 1.0,
    });
    const subwayDep = addMinutes(train.arrival, 11 + Math.floor(rand() * 8));
    const subway = makeSegment(
      rand,
      'subway',
      destination,
      destination,
      subwayDep,
      query.passengers,
      { distanceOverrideKm: 7, durationOverrideMin: 16, priceMultiplier: 0.7 },
    );
    routes.push(finalizeRoute([taxi, train, subway], origin, destination, rand));
  }

  // 5. Bus (cheapest, eco-leaning)
  if (dist < 1200 && enabled.has('bus')) {
    const dep = isoFromDate(new Date(baseDate.getTime() + 45 * 60000));
    const bus = makeSegment(rand, 'bus', origin, destination, dep, query.passengers, {
      priceMultiplier: 0.85,
    });
    routes.push(finalizeRoute([bus], origin, destination, rand));
  }

  // 6. Train + Bus combo via hub (budget eco)
  if (dist > 350 && enabled.has('train') && enabled.has('bus')) {
    const hub = pickHub(origin, destination, rand);
    if (hub) {
      const dep = isoFromDate(new Date(baseDate.getTime() + 60 * 60000));
      const train = makeSegment(rand, 'train', origin, hub, dep, query.passengers, {
        priceMultiplier: 0.9,
      });
      const transferMin = 18 + Math.floor(rand() * 20);
      const busDep = addMinutes(train.arrival, transferMin);
      const bus = makeSegment(rand, 'bus', hub, destination, busDep, query.passengers, {
        priceMultiplier: 0.85,
      });
      routes.push(finalizeRoute([train, bus], origin, destination, rand));
    }
  }

  // 7. Train via hub (high-speed connection)
  if (dist > 500 && enabled.has('train')) {
    const hub = pickHub(origin, destination, rand);
    if (hub && hub.id !== origin.id && hub.id !== destination.id) {
      const dep = isoFromDate(new Date(baseDate.getTime() + 30 * 60000));
      const t1 = makeSegment(rand, 'train', origin, hub, dep, query.passengers, {
        priceMultiplier: 0.95,
      });
      const transferMin = 14 + Math.floor(rand() * 10);
      const dep2 = addMinutes(t1.arrival, transferMin);
      const t2 = makeSegment(rand, 'train', hub, destination, dep2, query.passengers, {
        priceMultiplier: 0.95,
      });
      routes.push(finalizeRoute([t1, t2], origin, destination, rand));
    }
  }

  // 8. Walk + Train (very short distance fallback)
  if (dist < 30 && enabled.has('train')) {
    const dep = isoFromDate(baseDate);
    const walk = makeSegment(rand, 'walk', origin, origin, dep, query.passengers, {
      distanceOverrideKm: 1.2,
      durationOverrideMin: 14,
    });
    const trainDep = addMinutes(walk.arrival, 5);
    const train = makeSegment(rand, 'train', origin, destination, trainDep, query.passengers);
    routes.push(finalizeRoute([walk, train], origin, destination, rand));
  }

  // Always include at least one fallback so empty searches don't happen
  if (routes.length === 0 && enabled.has('train')) {
    const dep = isoFromDate(baseDate);
    const seg = makeSegment(rand, 'train', origin, destination, dep, query.passengers);
    routes.push(finalizeRoute([seg], origin, destination, rand));
  }

  return routes;
};

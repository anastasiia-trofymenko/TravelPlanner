import type { City, Route, Segment, SearchQuery, TransportMode } from '@src/mock/types';
import { CITIES } from '@src/mock/cities';
import { co2PerKm, pricePerKm } from '@src/mock/operators';
import { haversineKm } from '@src/mock/generateRoutes';
import type { HafasJourney, HafasLeg, HafasStop } from './dbHafas';

const PRODUCT_TO_MODE: Record<string, TransportMode> = {
  nationalExpress: 'train',
  national: 'train',
  regionalExp: 'train',
  regional: 'train',
  suburban: 'train',
  bus: 'bus',
  tram: 'tram',
  subway: 'subway',
  ferry: 'ferry',
};

function stopToCity(stop: HafasStop, fallback: City): City {
  if (!stop.location) return fallback;
  const { latitude: lat, longitude: lng } = stop.location;
  let best: City | undefined;
  let bestDist = Infinity;
  for (const city of CITIES) {
    const d = Math.abs(city.coords.lat - lat) + Math.abs(city.coords.lng - lng);
    if (d < bestDist) {
      bestDist = d;
      best = city;
    }
  }
  if (best && bestDist < 0.8) return best;
  return {
    id: stop.id,
    name: stop.name,
    country: '',
    cc: '',
    station: stop.name,
    coords: { lat, lng },
  };
}

function legMode(leg: HafasLeg, allowedModes: Set<TransportMode>): TransportMode | null {
  const product = leg.line?.product ?? '';
  const mode = PRODUCT_TO_MODE[product] ?? 'train';
  return allowedModes.has(mode) ? mode : null;
}

function hasDelayRemark(leg: HafasLeg): boolean {
  return (leg.remarks ?? []).some(
    (r) => r.text?.toLowerCase().includes('delay') || r.text?.toLowerCase().includes('cancel'),
  );
}

function calcPrice(leg: HafasLeg, mode: TransportMode, from: City, to: City, passengers: number): number {
  const distKm = haversineKm(from, to) * 1.15;
  return Math.max(3, Math.round(pricePerKm[mode] * distKm * passengers));
}

function normalizeLeg(
  leg: HafasLeg,
  index: number,
  mode: TransportMode,
  from: City,
  to: City,
  priceEur: number,
  passengers: number,
): Segment {
  const distKm = haversineKm(from, to) * 1.15;
  const durationMin = Math.round(
    (new Date(leg.arrival).getTime() - new Date(leg.departure).getTime()) / 60000,
  );
  const co2Kg = +(co2PerKm[mode] * distKm * passengers).toFixed(1);
  const product = leg.line?.product ?? '';
  const comfort: Segment['comfort'] =
    product === 'nationalExpress' ? 'high'
    : product === 'national' ? 'high'
    : product === 'regionalExp' ? 'medium'
    : mode === 'bus' ? 'low'
    : 'medium';

  return {
    id: `hafas-${leg.origin.id}-${leg.destination.id}-${index}`,
    mode,
    from,
    to,
    departure: leg.departure,
    arrival: leg.arrival,
    durationMin: Math.max(1, durationMin),
    priceEur,
    co2Kg,
    operator: leg.line?.operator?.name ?? leg.line?.name ?? 'Rail',
    line: leg.line?.name ?? '',
    platform: leg.departurePlatform,
    comfort,
    hasWifi: product === 'nationalExpress' || product === 'national',
    hasTable: product === 'nationalExpress',
  };
}

export function normalizeJourneys(
  journeys: HafasJourney[],
  query: SearchQuery,
  origin: City,
  destination: City,
): Route[] {
  const allowedModes = new Set<TransportMode>(query.modes);
  const seenDepartures = new Set<string>();
  const routes: Route[] = [];

  for (const journey of journeys) {
    const validLegs = journey.legs.filter(
      (l) => !l.walking && !l.transfer && legMode(l, allowedModes) !== null,
    );
    if (validLegs.length === 0) continue;

    const firstLeg = validLegs[0];
    const lastLeg = validLegs[validLegs.length - 1];
    const departureAt = firstLeg.departure;
    const arrivalAt = lastLeg.arrival;

    // Deduplicate by departure timestamp
    if (seenDepartures.has(departureAt)) continue;
    seenDepartures.add(departureAt);

    // Drop journeys longer than 24 hours
    const totalMs = new Date(arrivalAt).getTime() - new Date(departureAt).getTime();
    if (totalMs > 86400000 || totalMs <= 0) continue;

    // Distribute journey price across legs if available
    const journeyPrice = journey.price?.amount ?? 0;
    const pricePerLeg = journeyPrice > 0 ? journeyPrice / validLegs.length : 0;

    const segments: Segment[] = [];
    let hasDelay = false;

    for (let i = 0; i < validLegs.length; i++) {
      const leg = validLegs[i];
      const mode = legMode(leg, allowedModes)!;
      const from = i === 0 ? origin : stopToCity(leg.origin, origin);
      const to = i === validLegs.length - 1 ? destination : stopToCity(leg.destination, destination);

      // Skip micro-legs where from and to resolve to the same city
      if (from.id === to.id) continue;

      const priceEur = pricePerLeg > 0
        ? Math.max(3, Math.round(pricePerLeg * query.passengers))
        : calcPrice(leg, mode, from, to, query.passengers);

      if (hasDelayRemark(leg)) hasDelay = true;
      segments.push(normalizeLeg(leg, i, mode, from, to, priceEur, query.passengers));
    }

    if (segments.length === 0) continue;

    const totalDurationMin = Math.round(totalMs / 60000);
    const totalPriceEur = segments.reduce((s, x) => s + x.priceEur, 0);
    const totalCo2Kg = +segments.reduce((s, x) => s + x.co2Kg, 0).toFixed(1);
    const distKm = haversineKm(origin, destination) * 1.1;
    const flightAltCo2Kg = +(co2PerKm.flight * distKm * 1.3).toFixed(1);

    routes.push({
      id: `hafas-${query.originId}-${query.destinationId}-${departureAt}`,
      segments,
      origin,
      destination,
      departureAt,
      arrivalAt,
      totalDurationMin,
      totalPriceEur,
      totalCo2Kg,
      transferCount: Math.max(0, segments.length - 1),
      reliabilityPct: hasDelay ? 88 : 95,
      flightAltCo2Kg,
      badges: [],
    });

    if (routes.length >= 8) break;
  }

  return routes;
}

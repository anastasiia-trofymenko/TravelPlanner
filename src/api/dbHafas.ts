import type { SearchQuery } from '@src/mock/types';

// HAFAS EVA station numbers for DB REST API (v6.db.transport.rest)
// Cities without a mapping fall back to mock data automatically
export const STATION_MAP: Record<string, string> = {
  // Germany
  ber: '8011160',  // Berlin Hbf
  muc: '8000261',  // München Hbf
  ham: '8002549',  // Hamburg Hbf
  fra: '8000105',  // Frankfurt(Main)Hbf
  str: '8000096',  // Stuttgart Hbf
  cgn: '8000207',  // Köln Hbf
  // Austria
  vie: '8103000',  // Wien Hbf
  inn: '8100783',  // Innsbruck Hbf
  szg: '8100262',  // Salzburg Hbf
  // Switzerland
  zrh: '8503000',  // Zürich HB
  // Benelux & France
  ams: '8400058',  // Amsterdam Centraal
  bru: '8814001',  // Bruxelles-Midi
  par: '8796049',  // Paris Gare du Nord
  // Scandinavia
  cph: '8600626',  // København H
  // Central-Eastern Europe
  prg: '5400011',  // Praha hl.n.
  bts: '5610004',  // Bratislava hl.st.
  bud: '5510009',  // Budapest-Keleti
  waw: '5100005',  // Warszawa Centralna
  krk: '5100015',  // Kraków Główny
  // Italy
  mil: '8300152',  // Milano Centrale
  rom: '8300058',  // Roma Termini
  flr: '8300013',  // Firenze S.M.N.
  vce: '8300137',  // Venezia S. Lucia
  nap: '8300027',  // Napoli Centrale
};

export type HafasStop = {
  id: string;
  name: string;
  location?: { latitude: number; longitude: number };
};

export type HafasLine = {
  name: string;
  product: string;
  operator?: { name: string };
};

export type HafasRemark = {
  type: string;
  text: string;
};

export type HafasLeg = {
  origin: HafasStop;
  destination: HafasStop;
  departure: string;
  arrival: string;
  line?: HafasLine;
  walking?: boolean;
  transfer?: boolean;
  departurePlatform?: string;
  remarks?: HafasRemark[];
};

export type HafasJourney = {
  legs: HafasLeg[];
  price?: { amount: number; currency: string };
};

export function hasHafasStation(cityId: string): boolean {
  return cityId in STATION_MAP;
}

export async function fetchJourneys(query: SearchQuery): Promise<HafasJourney[]> {
  const fromId = STATION_MAP[query.originId];
  const toId = STATION_MAP[query.destinationId];
  if (!fromId || !toId) return [];

  const params = new URLSearchParams({
    from: fromId,
    to: toId,
    departure: `${query.date}T08:00:00`,
    results: '8',
    nationalExpress: 'true',
    national: 'true',
    regionalExp: 'true',
    regional: 'false',
    suburban: 'false',
    bus: 'true',
    ferry: 'false',
    subway: 'false',
    tram: 'false',
    tickets: 'true',
    remarks: 'true',
    language: 'en',
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    const res = await fetch(`https://v6.db.transport.rest/journeys?${params}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HAFAS ${res.status}`);
    const data = await res.json();
    return Array.isArray(data.journeys) ? data.journeys : [];
  } finally {
    clearTimeout(timer);
  }
}

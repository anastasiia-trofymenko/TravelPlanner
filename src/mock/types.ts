export type TransportMode =
  | 'train'
  | 'bus'
  | 'flight'
  | 'subway'
  | 'taxi'
  | 'walk'
  | 'tram'
  | 'ferry';

export type City = {
  id: string;
  name: string;
  country: string;
  cc: string;
  station: string;
  coords: { lat: number; lng: number };
};

export type Segment = {
  id: string;
  mode: TransportMode;
  from: City;
  to: City;
  departure: string;
  arrival: string;
  durationMin: number;
  priceEur: number;
  co2Kg: number;
  operator: string;
  line: string;
  platform?: string;
  seat?: string;
  comfort: 'low' | 'medium' | 'high';
  hasWifi?: boolean;
  hasTable?: boolean;
};

export type Route = {
  id: string;
  segments: Segment[];
  totalDurationMin: number;
  totalPriceEur: number;
  totalCo2Kg: number;
  transferCount: number;
  reliabilityPct: number;
  flightAltCo2Kg: number;
  badges: Array<'best' | 'fastest' | 'cheapest' | 'eco'>;
  origin: City;
  destination: City;
  departureAt: string;
  arrivalAt: string;
};

export type SearchQuery = {
  originId: string;
  destinationId: string;
  date: string;
  passengers: number;
  modes: TransportMode[];
};

export type RecentSearch = SearchQuery & {
  id: string;
  ranAt: string;
};

export type SavedItem = {
  id: string;
  origin: City;
  destination: City;
  fromPrice: number;
  date?: string;
  note?: string;
  routeId?: string;
};

export type FeedbackTag =
  | 'punctual'
  | 'comfort'
  | 'easyTransfer'
  | 'goodValue'
  | 'eco';

export type TripFeedback = {
  rating: number;
  tags: FeedbackTag[];
  comment?: string;
  submittedAt: string;
};

export type TripStatus = 'upcoming' | 'active' | 'past';

export type Trip = {
  id: string;
  route: Route;
  passengers: number;
  bookedAt: string;
  status: TripStatus;
  feedback?: TripFeedback;
};

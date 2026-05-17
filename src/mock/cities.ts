import type { City } from './types';

export const CITIES: City[] = [
  { id: 'vie', name: 'Vienna',     country: 'Austria',        cc: 'AT', station: 'Wien Hauptbahnhof',  coords: { lat: 48.1858, lng: 16.3754 } },
  { id: 'muc', name: 'Munich',     country: 'Germany',        cc: 'DE', station: 'München Hbf',        coords: { lat: 48.1402, lng: 11.5586 } },
  { id: 'ber', name: 'Berlin',     country: 'Germany',        cc: 'DE', station: 'Berlin Hbf',          coords: { lat: 52.5251, lng: 13.3692 } },
  { id: 'par', name: 'Paris',      country: 'France',         cc: 'FR', station: 'Gare de Lyon',        coords: { lat: 48.8443, lng: 2.3739 } },
  { id: 'mil', name: 'Milan',      country: 'Italy',          cc: 'IT', station: 'Milano Centrale',     coords: { lat: 45.4861, lng: 9.2055 } },
  { id: 'rom', name: 'Rome',       country: 'Italy',          cc: 'IT', station: 'Roma Termini',        coords: { lat: 41.9009, lng: 12.5018 } },
  { id: 'prg', name: 'Prague',     country: 'Czechia',        cc: 'CZ', station: 'Praha hlavní nádraží',coords: { lat: 50.0832, lng: 14.4356 } },
  { id: 'ams', name: 'Amsterdam',  country: 'Netherlands',    cc: 'NL', station: 'Amsterdam Centraal',  coords: { lat: 52.3791, lng: 4.9003 } },
  { id: 'bru', name: 'Brussels',   country: 'Belgium',        cc: 'BE', station: 'Bruxelles-Midi',      coords: { lat: 50.8358, lng: 4.3361 } },
  { id: 'zrh', name: 'Zurich',     country: 'Switzerland',    cc: 'CH', station: 'Zürich HB',           coords: { lat: 47.3779, lng: 8.5403 } },
  { id: 'bcn', name: 'Barcelona',  country: 'Spain',          cc: 'ES', station: 'Barcelona Sants',     coords: { lat: 41.3792, lng: 2.1402 } },
  { id: 'mad', name: 'Madrid',     country: 'Spain',          cc: 'ES', station: 'Atocha',              coords: { lat: 40.4070, lng: -3.6906 } },
  { id: 'lon', name: 'London',     country: 'United Kingdom', cc: 'UK', station: 'St Pancras Intl',     coords: { lat: 51.5320, lng: -0.1264 } },
  { id: 'cph', name: 'Copenhagen', country: 'Denmark',        cc: 'DK', station: 'København H',         coords: { lat: 55.6727, lng: 12.5640 } },
  { id: 'ham', name: 'Hamburg',    country: 'Germany',        cc: 'DE', station: 'Hamburg Hbf',         coords: { lat: 53.5530, lng: 10.0067 } },
  { id: 'lyo', name: 'Lyon',       country: 'France',         cc: 'FR', station: 'Lyon Part-Dieu',      coords: { lat: 45.7607, lng: 4.8597 } },
  { id: 'szg', name: 'Salzburg',   country: 'Austria',        cc: 'AT', station: 'Salzburg Hbf',        coords: { lat: 47.8131, lng: 13.0457 } },
  { id: 'inn', name: 'Innsbruck',  country: 'Austria',        cc: 'AT', station: 'Innsbruck Hbf',       coords: { lat: 47.2638, lng: 11.4007 } },
  { id: 'fra', name: 'Frankfurt',  country: 'Germany',        cc: 'DE', station: 'Frankfurt Hbf',       coords: { lat: 50.1070, lng: 8.6635 } },
  { id: 'str', name: 'Stuttgart',  country: 'Germany',        cc: 'DE', station: 'Stuttgart Hbf',       coords: { lat: 48.7838, lng: 9.1812 } },
  { id: 'cgn', name: 'Cologne',    country: 'Germany',        cc: 'DE', station: 'Köln Hbf',            coords: { lat: 50.9430, lng: 6.9588 } },
  { id: 'bts', name: 'Bratislava', country: 'Slovakia',       cc: 'SK', station: 'Bratislava hl.st.',   coords: { lat: 48.1568, lng: 17.1067 } },
  { id: 'bud', name: 'Budapest',   country: 'Hungary',        cc: 'HU', station: 'Keleti pályaudvar',   coords: { lat: 47.5004, lng: 19.0834 } },
  { id: 'waw', name: 'Warsaw',     country: 'Poland',         cc: 'PL', station: 'Warszawa Centralna',  coords: { lat: 52.2287, lng: 21.0030 } },
  { id: 'krk', name: 'Krakow',     country: 'Poland',         cc: 'PL', station: 'Kraków Główny',       coords: { lat: 50.0680, lng: 19.9477 } },
  { id: 'flr', name: 'Florence',   country: 'Italy',          cc: 'IT', station: 'Firenze S.M.N.',      coords: { lat: 43.7765, lng: 11.2480 } },
  { id: 'vce', name: 'Venice',     country: 'Italy',          cc: 'IT', station: 'Venezia S. Lucia',    coords: { lat: 45.4413, lng: 12.3208 } },
  { id: 'nap', name: 'Naples',     country: 'Italy',          cc: 'IT', station: 'Napoli Centrale',     coords: { lat: 40.8538, lng: 14.2725 } },
];

export const findCity = (id: string): City | undefined => CITIES.find((c) => c.id === id);

export const getCityById = (id: string): City => {
  const c = findCity(id);
  if (!c) throw new Error(`Unknown city ${id}`);
  return c;
};

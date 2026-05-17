import type { TransportMode } from './types';

export const OPERATORS: Record<TransportMode, string[]> = {
  train: ['ÖBB Railjet', 'DB ICE', 'TGV InOui', 'Frecciarossa', 'Eurostar', 'SBB IC'],
  bus: ['FlixBus', 'Eurolines', 'BlaBlaBus', 'RegioJet'],
  flight: ['Austrian', 'Lufthansa', 'Ryanair', 'easyJet', 'Air France', 'Wizz Air'],
  subway: ['U-Bahn', 'Métro', 'Metro', 'Tube'],
  taxi: ['Uber', 'Bolt', 'Local Taxi'],
  walk: ['On foot'],
  tram: ['Tram', 'Straßenbahn'],
  ferry: ['Local Ferry'],
};

export const co2PerKm: Record<TransportMode, number> = {
  flight: 0.255,
  taxi: 0.171,
  bus: 0.027,
  train: 0.033,
  subway: 0.041,
  tram: 0.029,
  walk: 0,
  ferry: 0.115,
};

export const speedKmh: Record<TransportMode, number> = {
  flight: 700,
  train: 165,
  bus: 75,
  taxi: 50,
  subway: 35,
  tram: 25,
  walk: 5,
  ferry: 40,
};

export const pricePerKm: Record<TransportMode, number> = {
  flight: 0.18,
  train: 0.13,
  bus: 0.07,
  taxi: 1.6,
  subway: 0.4,
  tram: 0.35,
  walk: 0,
  ferry: 0.22,
};

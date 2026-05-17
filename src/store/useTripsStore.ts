import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Route, SavedItem, Trip, TripFeedback } from '@src/mock/types';
import { SEED_INSPIRATIONS, buildSeedTrip } from '@src/mock/seedTrips';

type State = {
  saved: SavedItem[];
  trips: Trip[];
  inspirations: SavedItem[];
  initSeed: () => void;
  toggleSavedRoute: (route: Route) => void;
  isRouteSaved: (routeId: string) => boolean;
  removeSaved: (id: string) => void;
  bookRoute: (route: Route, passengers: number) => string;
  getTrip: (id: string) => Trip | undefined;
  setTripStatus: (id: string, status: Trip['status']) => void;
  submitFeedback: (id: string, fb: TripFeedback) => void;
};

export const useTripsStore = create<State>()(
  persist(
    (set, get) => ({
      saved: [],
      trips: [],
      inspirations: SEED_INSPIRATIONS,
      initSeed: () => {
        if (get().trips.length === 0) {
          const seed = buildSeedTrip();
          if (seed) set({ trips: [seed] });
        }
      },
      toggleSavedRoute: (route) => {
        const exists = get().saved.find((s) => s.routeId === route.id);
        if (exists) {
          set({ saved: get().saved.filter((s) => s.routeId !== route.id) });
          return;
        }
        const item: SavedItem = {
          id: `saved-${route.id}`,
          origin: route.origin,
          destination: route.destination,
          fromPrice: route.totalPriceEur,
          date: route.departureAt.slice(0, 10),
          routeId: route.id,
        };
        set({ saved: [item, ...get().saved] });
      },
      isRouteSaved: (routeId) =>
        Boolean(get().saved.find((s) => s.routeId === routeId)),
      removeSaved: (id) => set({ saved: get().saved.filter((s) => s.id !== id) }),
      bookRoute: (route, passengers) => {
        const id = `trip-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
        const trip: Trip = {
          id,
          route,
          passengers,
          bookedAt: new Date().toISOString(),
          status: 'upcoming',
        };
        set({ trips: [trip, ...get().trips] });
        return id;
      },
      getTrip: (id) => get().trips.find((t) => t.id === id),
      setTripStatus: (id, status) => {
        set({
          trips: get().trips.map((t) => (t.id === id ? { ...t, status } : t)),
        });
      },
      submitFeedback: (id, fb) => {
        set({
          trips: get().trips.map((t) =>
            t.id === id ? { ...t, status: 'past', feedback: fb } : t,
          ),
        });
      },
    }),
    {
      name: 'arturio-trips',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ saved: s.saved, trips: s.trips }),
    },
  ),
);

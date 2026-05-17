import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RecentSearch, Route, SearchQuery } from '@src/mock/types';
import { generateRoutes } from '@src/mock/generateRoutes';
import { getCityById } from '@src/mock/cities';
import { annotateBadges } from '@src/utils/weights';
import { fetchJourneys, hasHafasStation } from '@src/api/dbHafas';
import { normalizeJourneys } from '@src/api/normalize';
import { usePreferencesStore } from './usePreferencesStore';

type Cache = Record<string, Route[]>;

export type Draft = {
  originId?: string;
  destinationId?: string;
  date?: string;
  passengers: number;
};

type State = {
  recent: RecentSearch[];
  cache: Cache;
  draft: Draft;
  liveIds: string[];
  loading: boolean;
  setDraft: (partial: Partial<Draft>) => void;
  resetDraft: () => void;
  runSearch: (q: SearchQuery) => Promise<string>;
  getResults: (id: string) => Route[] | undefined;
  getQuery: (id: string) => SearchQuery | undefined;
  clearRecent: () => void;
  isLiveData: (id: string) => boolean;
};

const queryKey = (q: SearchQuery) =>
  `${q.originId}-${q.destinationId}-${q.date}-${q.passengers}-${q.modes.slice().sort().join(',')}`;

export const useSearchStore = create<State>()(
  persist(
    (set, get) => ({
      recent: [],
      cache: {},
      draft: { passengers: 1 },
      liveIds: [],
      loading: false,
      setDraft: (partial) => set({ draft: { ...get().draft, ...partial } }),
      resetDraft: () => set({ draft: { passengers: 1 } }),
      runSearch: async (q) => {
        const id = queryKey(q);

        // Return cached result immediately without re-fetching
        if (get().cache[id]) return id;

        set({ loading: true });

        const prefs = usePreferencesStore.getState();
        let routes: Route[] = [];
        let isLive = false;

        try {
          if (hasHafasStation(q.originId) && hasHafasStation(q.destinationId)) {
            const journeys = await fetchJourneys(q);
            const origin = getCityById(q.originId);
            const destination = getCityById(q.destinationId);
            routes = normalizeJourneys(journeys, q, origin, destination);
            isLive = routes.length > 0;
          }
        } catch {
          // Network error or API down — fall through to mock
        }

        if (routes.length === 0) {
          routes = generateRoutes(q);
        }

        const annotated = annotateBadges(routes, {
          budget: prefs.budget,
          speed: prefs.speed,
          eco: prefs.eco,
        });

        const recent: RecentSearch = { ...q, id, ranAt: new Date().toISOString() };
        const dedupedRecent = [recent, ...get().recent.filter((r) => r.id !== id)].slice(0, 8);

        set({
          cache: { ...get().cache, [id]: annotated },
          recent: dedupedRecent,
          liveIds: isLive ? [...new Set([...get().liveIds, id])] : get().liveIds,
          loading: false,
        });

        return id;
      },
      getResults: (id) => get().cache[id],
      getQuery: (id) => get().recent.find((r) => r.id === id),
      clearRecent: () => set({ recent: [] }),
      isLiveData: (id) => get().liveIds.includes(id),
    }),
    {
      name: 'arturio-search',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ recent: s.recent }),
    },
  ),
);

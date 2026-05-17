import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { TransportMode } from '@src/mock/types';
import type { Language } from '@src/i18n';

type State = {
  budget: number;
  speed: number;
  eco: number;
  enabledModes: TransportMode[];
  language: Language;
  largeText: boolean;
  simpleMode: boolean;
  hasOnboarded: boolean;
  setPriorities: (p: Partial<Pick<State, 'budget' | 'speed' | 'eco'>>) => void;
  toggleMode: (m: TransportMode) => void;
  setLanguage: (l: Language) => void;
  setLargeText: (v: boolean) => void;
  setSimpleMode: (v: boolean) => void;
  finishOnboarding: () => void;
  applyStyle: (style: 'eco' | 'fast' | 'casual' | 'simple') => void;
};

export const ALL_MODES: TransportMode[] = [
  'train',
  'bus',
  'flight',
  'subway',
  'taxi',
  'walk',
  'tram',
  'ferry',
];

export const usePreferencesStore = create<State>()(
  persist(
    (set, get) => ({
      budget: 0.5,
      speed: 0.5,
      eco: 0.5,
      enabledModes: ALL_MODES,
      language: 'en',
      largeText: false,
      simpleMode: false,
      hasOnboarded: false,
      setPriorities: (p) => set(p),
      toggleMode: (m) => {
        const next = new Set(get().enabledModes);
        if (next.has(m)) next.delete(m);
        else next.add(m);
        set({ enabledModes: Array.from(next) });
      },
      setLanguage: (l) => set({ language: l }),
      setLargeText: (v) => set({ largeText: v }),
      setSimpleMode: (v) => set({ simpleMode: v }),
      finishOnboarding: () => set({ hasOnboarded: true }),
      applyStyle: (style) => {
        switch (style) {
          case 'eco':
            set({ budget: 0.65, speed: 0.3, eco: 0.9 });
            break;
          case 'fast':
            set({ budget: 0.3, speed: 0.95, eco: 0.4 });
            break;
          case 'casual':
            set({ budget: 0.55, speed: 0.55, eco: 0.55 });
            break;
          case 'simple':
            set({
              budget: 0.5,
              speed: 0.5,
              eco: 0.5,
              simpleMode: true,
              largeText: true,
            });
            break;
        }
      },
    }),
    {
      name: 'arturio-prefs',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

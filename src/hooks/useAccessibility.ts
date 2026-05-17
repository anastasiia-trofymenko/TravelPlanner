import { usePreferencesStore } from '@src/store/usePreferencesStore';

export const useAccessibility = () => {
  const largeText = usePreferencesStore((s) => s.largeText);
  const simpleMode = usePreferencesStore((s) => s.simpleMode);

  const scale = largeText ? 1.18 : 1;
  return { largeText, simpleMode, scale };
};

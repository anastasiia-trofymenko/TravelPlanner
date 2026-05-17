import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import i18n from '@src/i18n';
import { usePreferencesStore } from '@src/store/usePreferencesStore';
import { useTripsStore } from '@src/store/useTripsStore';

const useStoreHydrated = () => {
  const [ready, setReady] = useState(() => usePreferencesStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = usePreferencesStore.persist.onFinishHydration(() => setReady(true));
    if (usePreferencesStore.persist.hasHydrated()) setReady(true);
    return unsub;
  }, []);
  return ready;
};

export default function RootLayout() {
  const hydrated = useStoreHydrated();
  const hasOnboarded = usePreferencesStore((s) => s.hasOnboarded);
  const language = usePreferencesStore((s) => s.language);
  const initSeed = useTripsStore((s) => s.initSeed);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    initSeed();
  }, [initSeed]);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  useEffect(() => {
    if (!hydrated) return;
    const first = segments[0];
    if (!hasOnboarded && first !== '(onboarding)') {
      router.replace('/(onboarding)/welcome');
    } else if (hasOnboarded && first === '(onboarding)') {
      router.replace('/(tabs)');
    }
  }, [hydrated, hasOnboarded, segments, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="search" />
          <Stack.Screen name="results" />
          <Stack.Screen name="route" />
          <Stack.Screen name="booking" />
          <Stack.Screen name="trip" />
          <Stack.Screen name="feedback" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Wifi, WifiOff } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Compass, SlidersHorizontal } from 'lucide-react-native';
import { Screen } from '@src/components/Screen';
import { HeaderBar } from '@src/components/HeaderBar';
import { RouteCard } from '@src/components/RouteCard';
import { EmptyState } from '@src/components/EmptyState';
import { Button } from '@src/components/Button';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { useSearchStore } from '@src/store/useSearchStore';
import { usePreferencesStore } from '@src/store/usePreferencesStore';
import { findCity } from '@src/mock/cities';
import { sortRoutes } from '@src/utils/weights';
import { spacing, radius, typography } from '@src/theme';

type Sort = 'best' | 'fastest' | 'cheapest' | 'eco';

export default function Results() {
  const { searchId } = useLocalSearchParams<{ searchId: string }>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();
  const getResults = useSearchStore((s) => s.getResults);
  const getQuery = useSearchStore((s) => s.getQuery);
  const prefs = usePreferencesStore();
  const [sortMode, setSortMode] = useState<Sort>('best');
  const [compare, setCompare] = useState<string[]>([]);

  const routes = getResults(searchId!) ?? [];
  const query = getQuery(searchId!);
  const origin = query ? findCity(query.originId) : undefined;
  const destination = query ? findCity(query.destinationId) : undefined;
  const isLive = useSearchStore((s) => s.isLiveData(searchId!));

  const sorted = useMemo(
    () => sortRoutes(routes, sortMode, { budget: prefs.budget, speed: prefs.speed, eco: prefs.eco }),
    [routes, sortMode, prefs.budget, prefs.speed, prefs.eco],
  );

  const toggleCompare = (id: string) => {
    setCompare((current) => {
      if (current.includes(id)) return current.filter((c) => c !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  };

  const goCompare = () => {
    haptic.medium();
    router.push({ pathname: '/results/compare', params: { ids: compare.join(','), searchId } } as any);
  };

  const sortTabs: { key: Sort; labelKey: string }[] = [
    { key: 'best', labelKey: 'results.sort.best' },
    { key: 'fastest', labelKey: 'results.sort.fastest' },
    { key: 'cheapest', labelKey: 'results.sort.cheapest' },
    { key: 'eco', labelKey: 'results.sort.eco' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Screen padded={false}>
        <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.sm }}>
          <HeaderBar
            title={origin && destination ? `${origin.name} → ${destination.name}` : t('results.title')}
            subtitle={query ? t('results.found', { count: routes.length }) : undefined}
            right={
              <Pressable onPress={() => router.push('/search')} hitSlop={10}>
                <SlidersHorizontal size={20} color={theme.text} />
              </Pressable>
            }
          />
        </View>

        {routes.length > 0 ? (
          <View style={[styles.dataBanner, { backgroundColor: isLive ? theme.ecoSoft : theme.warnSoft }]}>
            {isLive
              ? <Wifi size={13} color={theme.eco} />
              : <WifiOff size={13} color={theme.warn} />
            }
            <Text style={[typography.caption, { color: isLive ? theme.eco : theme.warn, marginLeft: 5 }]}>
              {isLive ? t('results.liveData') : t('results.estimatedData')}
            </Text>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: spacing.xl }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sortTabs.map(({ key, labelKey }) => {
              const active = sortMode === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => {
                    haptic.light();
                    setSortMode(key);
                  }}
                  style={[
                    styles.sortTab,
                    {
                      backgroundColor: active ? theme.primary : theme.card,
                      borderColor: active ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[typography.bodyStrong, { color: active ? '#FFFFFF' : theme.text }]}
                  >
                    {t(labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {sorted.length === 0 ? (
            <EmptyState
              icon={<Compass size={36} color={theme.primary} />}
              title={t('results.emptyTitle')}
              body={t('results.emptyBody')}
            />
          ) : (
            sorted.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onPress={() => router.push(`/route/${route.id}?searchId=${searchId}` as any)}
                onToggleCompare={() => toggleCompare(route.id)}
                selectedForCompare={compare.includes(route.id)}
              />
            ))
          )}
        </ScrollView>

        {compare.length >= 2 ? (
          <View style={[styles.fab, { backgroundColor: theme.primary }]}>
            <Pressable
              onPress={goCompare}
              style={styles.fabPressable}
            >
              <Text style={[typography.bodyStrong, { color: '#FFFFFF' }]}>
                {t('results.compareCount', { count: compare.length })}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  dataBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  sortTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: 140,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    shadowColor: '#FF3D7F',
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  fabPressable: { paddingHorizontal: spacing.sm, paddingVertical: 2 },
});

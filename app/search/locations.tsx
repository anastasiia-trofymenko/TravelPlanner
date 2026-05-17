import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Search as SearchIcon, MapPin } from 'lucide-react-native';
import { Screen } from '@src/components/Screen';
import { HeaderBar } from '@src/components/HeaderBar';
import { Card } from '@src/components/Card';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { CITIES } from '@src/mock/cities';
import { useSearchStore } from '@src/store/useSearchStore';
import { radius, spacing, typography } from '@src/theme';

export default function Locations() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const haptic = useHaptic();
  const params = useLocalSearchParams<{ field?: 'origin' | 'destination' }>();
  const field = params.field ?? 'origin';
  const setDraft = useSearchStore((s) => s.setDraft);
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    if (!query) return CITIES;
    const q = query.toLowerCase();
    return CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.station.toLowerCase().includes(q),
    );
  }, [query]);

  const choose = (id: string) => {
    haptic.medium();
    if (field === 'origin') setDraft({ originId: id });
    else setDraft({ destinationId: id });
    router.back();
  };

  return (
    <Screen>
      <HeaderBar title={t('search.locationsTitle')} />
      <Card style={styles.searchBox}>
        <SearchIcon size={18} color={theme.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('search.locationsPlaceholder')}
          placeholderTextColor={theme.textMuted}
          style={[typography.body, { color: theme.text, marginLeft: spacing.sm, flex: 1 }]}
          autoFocus
        />
      </Card>

      <Text style={[typography.overline, { color: theme.textMuted, marginTop: spacing.lg, marginBottom: spacing.sm }]}>
        {t('search.popular')}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.huge }}>
        {list.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => choose(c.id)}
            style={({ pressed }) => [
              styles.cityRow,
              { backgroundColor: pressed ? theme.cardAlt : theme.card, borderColor: theme.border },
            ]}
          >
            <View style={[styles.flag, { backgroundColor: theme.primary + '22' }]}>
              <Text style={[typography.caption, { color: theme.primary }]}>{c.cc}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodyStrong, { color: theme.text }]}>{c.name}</Text>
              <Text style={[typography.caption, { color: theme.textMuted }]}>
                {c.station} · {c.country}
              </Text>
            </View>
            <MapPin size={16} color={theme.textMuted} />
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  flag: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
});

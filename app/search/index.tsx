import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import {
  Calendar,
  CalendarDays,
  Users,
  Search as SearchIcon,
  ArrowDownUp,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Screen } from '@src/components/Screen';
import { HeaderBar } from '@src/components/HeaderBar';
import { Card } from '@src/components/Card';
import { Button } from '@src/components/Button';
import { Slider } from '@src/components/Slider';
import { Chip } from '@src/components/Chip';
import { CalendarPicker } from '@src/components/CalendarPicker';
import { ModeIcon } from '@src/components/ModeIcon';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { findCity } from '@src/mock/cities';
import { ALL_MODES, usePreferencesStore } from '@src/store/usePreferencesStore';
import { useSearchStore } from '@src/store/useSearchStore';
import { palette, radius, spacing, typography } from '@src/theme';
import { formatLongDate } from '@src/utils/format';

const todayPlus = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const haptic = useHaptic();
  const prefs = usePreferencesStore();
  const draft = useSearchStore((s) => s.draft);
  const setDraft = useSearchStore((s) => s.setDraft);
  const runSearch = useSearchStore((s) => s.runSearch);
  const [advancedOpen, setAdvancedOpen] = useState(!prefs.simpleMode);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const origin = draft.originId ? findCity(draft.originId) : undefined;
  const destination = draft.destinationId ? findCity(draft.destinationId) : undefined;
  const date = draft.date ?? todayPlus(2);

  const canSearch = origin && destination && origin.id !== destination.id;
  const [searching, setSearching] = useState(false);

  const swap = () => {
    if (origin && destination) {
      haptic.medium();
      setDraft({ originId: destination.id, destinationId: origin.id });
    }
  };

  const launch = async () => {
    if (!canSearch || searching) return;
    haptic.medium();
    setSearching(true);
    try {
      const id = await runSearch({
        originId: origin!.id,
        destinationId: destination!.id,
        date,
        passengers: draft.passengers,
        modes: prefs.enabledModes.length ? prefs.enabledModes : ALL_MODES,
      });
      router.push(`/results/${id}` as any);
    } finally {
      setSearching(false);
    }
  };

  const setDate = (offset: number) => {
    haptic.light();
    setDraft({ date: todayPlus(offset) });
  };

  const setExactDate = (iso: string) => {
    setDraft({ date: iso });
  };

  const openCalendar = () => {
    haptic.light();
    setCalendarOpen(true);
  };

  return (
    <Screen scrollable>
      <HeaderBar title={t('search.title')} />

      <Animated.View entering={FadeIn.duration(350)}>
        <Card style={styles.routeCard}>
          <Pressable onPress={() => router.push('/search/locations?field=origin' as any)} style={styles.field}>
            <View style={[styles.fieldIcon, { backgroundColor: theme.primary + '22' }]}>
              <MapPin size={16} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.caption, { color: theme.textMuted }]}>{t('common.from')}</Text>
              <Text style={[typography.bodyStrong, { color: theme.text }]}>
                {origin ? `${origin.name} · ${origin.station}` : t('search.originPlaceholder')}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={swap}
            style={[styles.swapBtn, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
          >
            <ArrowDownUp size={16} color={theme.textMuted} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <Pressable
            onPress={() => router.push('/search/locations?field=destination' as any)}
            style={styles.field}
          >
            <View style={[styles.fieldIcon, { backgroundColor: theme.accent + '22' }]}>
              <MapPin size={16} color={theme.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.caption, { color: theme.textMuted }]}>{t('common.to')}</Text>
              <Text style={[typography.bodyStrong, { color: theme.text }]}>
                {destination
                  ? `${destination.name} · ${destination.station}`
                  : t('search.destinationPlaceholder')}
              </Text>
            </View>
          </Pressable>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(80).duration(350)}>
        <Card style={{ marginTop: spacing.md }}>
          <Pressable onPress={openCalendar} style={styles.field}>
            <View style={[styles.fieldIcon, { backgroundColor: theme.primary + '22' }]}>
              <Calendar size={16} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.caption, { color: theme.textMuted }]}>
                {t('common.departure')}
              </Text>
              <Text style={[typography.bodyStrong, { color: theme.text }]}>
                {formatLongDate(`${date}T08:00:00`)}
              </Text>
            </View>
            <View style={[styles.calendarBtn, { borderColor: theme.border }]}>
              <CalendarDays size={16} color={theme.primary} />
            </View>
          </Pressable>
          <View style={styles.datePillRow}>
            {[0, 1, 2, 3, 7, 14].map((o) => {
              const d = todayPlus(o);
              const label = o === 0 ? 'Today' : o === 1 ? 'Tomorrow' : formatLongDate(`${d}T08:00:00`).split(',')[0];
              const active = d === date;
              return (
                <View key={o} style={{ marginRight: spacing.sm, marginBottom: spacing.sm }}>
                  <Chip
                    label={label}
                    selected={active}
                    onPress={() => setDate(o)}
                    size="sm"
                  />
                </View>
              );
            })}
            <View style={{ marginRight: spacing.sm, marginBottom: spacing.sm }}>
              <Chip
                label={t('search.pickDate')}
                onPress={openCalendar}
                size="sm"
                icon={<CalendarDays size={12} color={theme.text} />}
              />
            </View>
          </View>
        </Card>
      </Animated.View>

      <CalendarPicker
        visible={calendarOpen}
        selectedDate={date}
        minDate={todayPlus(0)}
        onClose={() => setCalendarOpen(false)}
        onSelect={setExactDate}
      />

      <Animated.View entering={FadeInUp.delay(150).duration(350)}>
        <Card style={{ marginTop: spacing.md }}>
          <View style={styles.passengerRow}>
            <View style={[styles.fieldIcon, { backgroundColor: theme.accent + '22' }]}>
              <Users size={16} color={theme.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: 0 }}>
              <Text style={[typography.caption, { color: theme.textMuted }]}>
                {t('search.passengersTitle')}
              </Text>
              <Text style={[typography.bodyStrong, { color: theme.text }]}>
                {draft.passengers}{' '}
                {draft.passengers === 1 ? t('common.passenger') : t('common.passengers')}
              </Text>
            </View>
            <View style={styles.stepperRow}>
              <Pressable
                onPress={() =>
                  setDraft({ passengers: Math.max(1, draft.passengers - 1) })
                }
                style={[styles.stepperBtn, { borderColor: theme.border }]}
              >
                <Text style={[typography.h3, { color: theme.text }]}>−</Text>
              </Pressable>
              <Pressable
                onPress={() => setDraft({ passengers: Math.min(8, draft.passengers + 1) })}
                style={[styles.stepperBtn, { borderColor: theme.border, marginLeft: spacing.sm }]}
              >
                <Text style={[typography.h3, { color: theme.text }]}>+</Text>
              </Pressable>
            </View>
          </View>
        </Card>
      </Animated.View>

      {!prefs.simpleMode ? (
        <Animated.View entering={FadeInUp.delay(220).duration(350)}>
          <Pressable onPress={() => setAdvancedOpen((v) => !v)}>
            <Card style={{ marginTop: spacing.md }}>
              <View style={styles.advancedHeader}>
                <Text style={[typography.bodyStrong, { color: theme.text }]}>
                  {t('search.advanced')}
                </Text>
                {advancedOpen ? (
                  <ChevronUp size={18} color={theme.textMuted} />
                ) : (
                  <ChevronDown size={18} color={theme.textMuted} />
                )}
              </View>
              {advancedOpen ? (
                <View style={{ marginTop: spacing.lg, gap: spacing.lg }}>
                  <Slider
                    label={t('search.budget')}
                    value={prefs.budget}
                    onChange={(v) => prefs.setPriorities({ budget: v })}
                    accentColor={palette.warn500}
                  />
                  <Slider
                    label={t('search.speed')}
                    value={prefs.speed}
                    onChange={(v) => prefs.setPriorities({ speed: v })}
                    accentColor={palette.indigo500}
                  />
                  <Slider
                    label={t('search.eco')}
                    value={prefs.eco}
                    onChange={(v) => prefs.setPriorities({ eco: v })}
                    accentColor={palette.eco500}
                  />
                  <View>
                    <Text style={[typography.caption, { color: theme.textMuted, marginBottom: spacing.sm }]}>
                      {t('search.modes')}
                    </Text>
                    <View style={styles.modeGrid}>
                      {ALL_MODES.map((m) => (
                        <View key={m} style={{ marginRight: 6, marginBottom: 6 }}>
                          <Chip
                            label={t(`modes.${m}`)}
                            size="sm"
                            selected={prefs.enabledModes.includes(m)}
                            icon={
                              <ModeIcon
                                mode={m}
                                size={12}
                                color={prefs.enabledModes.includes(m) ? '#FFFFFF' : theme.text}
                              />
                            }
                            onPress={() => prefs.toggleMode(m)}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ) : null}
            </Card>
          </Pressable>
        </Animated.View>
      ) : null}

      <View style={{ marginTop: spacing.xxxl }}>
        <Button
          label={searching ? t('search.searching') : t('search.searchButton')}
          onPress={launch}
          disabled={!canSearch || searching}
          icon={
            searching
              ? <ActivityIndicator size="small" color="#FFFFFF" />
              : <SearchIcon size={18} color="#FFFFFF" />
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  routeCard: {
    paddingVertical: spacing.md,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  fieldIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  divider: { height: 1, marginVertical: spacing.xs },
  swapBtn: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  calendarBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerRow: { flexDirection: 'row', alignItems: 'center' },
  stepperRow: { flexDirection: 'row' },
  stepperBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advancedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap' },
});

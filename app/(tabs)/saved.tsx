import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Heart, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTripsStore } from '@src/store/useTripsStore';
import { useSearchStore } from '@src/store/useSearchStore';
import { usePreferencesStore } from '@src/store/usePreferencesStore';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { Card } from '@src/components/Card';
import { EmptyState } from '@src/components/EmptyState';
import { radius, spacing, typography } from '@src/theme';

export default function Saved() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const haptic = useHaptic();
  const saved = useTripsStore((s) => s.saved);
  const removeSaved = useTripsStore((s) => s.removeSaved);
  const runSearch = useSearchStore((s) => s.runSearch);
  const modes = usePreferencesStore((s) => s.enabledModes);

  const launchSaved = (originId: string, destinationId: string) => {
    haptic.medium();
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const id = runSearch({ originId, destinationId, date, passengers: 1, modes });
    router.push(`/results/${id}` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={[typography.h1, { color: theme.text }]}>{t('saved.title')}</Text>
            <Text style={[typography.body, { color: theme.textMuted, marginTop: 4 }]}>
              {t('saved.subtitle')}
            </Text>
          </Animated.View>

          {saved.length === 0 ? (
            <EmptyState
              icon={<Heart size={40} color={theme.primary} />}
              title={t('saved.emptyTitle')}
              body={t('saved.emptyBody')}
            />
          ) : (
            <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
              {saved.map((item) => (
                <Card
                  key={item.id}
                  onPress={() => launchSaved(item.origin.id, item.destination.id)}
                >
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={[typography.h3, { color: theme.text }]}>
                        {item.origin.name} → {item.destination.name}
                      </Text>
                      {item.note ? (
                        <Text style={[typography.caption, { color: theme.textMuted, marginTop: 4 }]}>
                          {item.note}
                        </Text>
                      ) : null}
                      <Text style={[typography.bodyStrong, { color: theme.primary, marginTop: 6 }]}>
                        {t('common.from_caption')} €{item.fromPrice}
                      </Text>
                    </View>
                    <Pressable
                      hitSlop={10}
                      onPress={() => {
                        haptic.warning();
                        removeSaved(item.id);
                      }}
                      style={[
                        styles.deleteBtn,
                        { backgroundColor: theme.dangerSoft },
                      ]}
                    >
                      <Trash2 size={16} color={theme.danger} />
                    </Pressable>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

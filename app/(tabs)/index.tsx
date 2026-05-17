import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight, Heart } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useUserStore } from '@src/store/useUserStore';
import { useSearchStore } from '@src/store/useSearchStore';
import { useTripsStore } from '@src/store/useTripsStore';
import { usePreferencesStore } from '@src/store/usePreferencesStore';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { Card } from '@src/components/Card';
import { SectionHeader } from '@src/components/SectionHeader';
import { findCity } from '@src/mock/cities';
import { radius, shadows, spacing, typography } from '@src/theme';

export default function Explore() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const haptic = useHaptic();
  const name = useUserStore((s) => s.name);
  const recent = useSearchStore((s) => s.recent);
  const runSearch = useSearchStore((s) => s.runSearch);
  const inspirations = useTripsStore((s) => s.inspirations);
  const enabledModes = usePreferencesStore((s) => s.enabledModes);

  const goSearch = () => {
    haptic.light();
    router.push('/search');
  };

  const launchInspiration = (originId: string, destinationId: string) => {
    haptic.medium();
    const today = new Date();
    today.setDate(today.getDate() + 5);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const date = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const id = runSearch({
      originId,
      destinationId,
      date,
      passengers: 1,
      modes: enabledModes,
    });
    router.push(`/results/${id}` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Animated.View entering={FadeInDown.duration(500)}>
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <SafeAreaView edges={["top"]}>
              <View style={styles.heroBrand}>
                <Sparkles size={18} color="#FFFFFF" />
                <Text
                  style={[
                    typography.bodyStrong,
                    { color: "#FFFFFF", marginLeft: 6 },
                  ]}
                >
                  {t("app.name")}
                </Text>
              </View>
              <Text
                style={[
                  typography.h1,
                  { color: "#FFFFFF", marginTop: spacing.lg },
                ]}
              >
                {t("explore.greeting", { name })}
              </Text>
              <Text
                style={[
                  typography.body,
                  { color: "rgba(255,255,255,0.9)", marginTop: 4 },
                ]}
              >
                {t("explore.subgreeting")}
              </Text>

              <Pressable
                onPress={goSearch}
                style={[styles.cta, shadows.lg, { backgroundColor: "#FFFFFF" }]}
              >
                <Text style={[typography.h3, { color: "#0F172A" }]}>
                  {t("explore.planJourney")}
                </Text>
                <View
                  style={[styles.ctaIcon, { backgroundColor: theme.primary }]}
                >
                  <ArrowRight size={20} color="#FFFFFF" />
                </View>
              </Pressable>
            </SafeAreaView>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(150).duration(500)}
          style={{ paddingHorizontal: spacing.xl }}
        >
          <SectionHeader title={t("explore.recent")} />
          {recent.length === 0 ? (
            <Card variant="outlined" style={{ paddingVertical: spacing.lg }}>
              <Text
                style={[
                  typography.body,
                  { color: theme.textMuted, textAlign: "center" },
                ]}
              >
                {t("explore.noRecent")}
              </Text>
            </Card>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recent.slice(0, 6).map((r) => {
                const origin = findCity(r.originId);
                const dest = findCity(r.destinationId);
                if (!origin || !dest) return null;
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => router.push(`/results/${r.id}` as any)}
                    style={[
                      styles.recentChip,
                      shadows.sm,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[typography.bodyStrong, { color: theme.text }]}
                    >
                      {origin.name} → {dest.name}
                    </Text>
                    <Text
                      style={[typography.caption, { color: theme.textMuted }]}
                    >
                      {new Date(r.ranAt).toLocaleDateString()}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(250).duration(500)}
          style={{ paddingHorizontal: spacing.xl }}
        >
          <SectionHeader title={t("explore.inspiration")} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: spacing.xl }}
          >
            {inspirations.map((it) => (
              <Pressable
                key={it.id}
                onPress={() =>
                  launchInspiration(it.origin.id, it.destination.id)
                }
                style={[
                  styles.inspirationCard,
                  shadows.md,
                  { backgroundColor: theme.card },
                ]}
              >
                <LinearGradient
                  colors={[theme.gradientStart, theme.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.inspirationCover}
                >
                  <Heart size={28} color="rgba(255,255,255,0.85)" />
                </LinearGradient>
                <View style={{ padding: spacing.md }}>
                  <Text style={[typography.h3, { color: theme.text }]}>
                    {it.origin.name} → {it.destination.name}
                  </Text>
                  <Text
                    style={[
                      typography.caption,
                      { color: theme.textMuted, marginTop: 2 },
                    ]}
                  >
                    {it.note}
                  </Text>
                  <Text
                    style={[
                      typography.bodyStrong,
                      { color: theme.primary, marginTop: 6 },
                    ]}
                  >
                    {t("common.from_caption")} €{it.fromPrice}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl + spacing.md,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroBrand: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  cta: {
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingRight: spacing.sm,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentChip: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  inspirationCard: {
    width: 220,
    borderRadius: radius.lg,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  inspirationCover: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

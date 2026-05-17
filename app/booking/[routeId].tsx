import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Apple, CreditCard, ShieldCheck, Smartphone, User as UserIcon } from 'lucide-react-native';
import { Screen } from '@src/components/Screen';
import { HeaderBar } from '@src/components/HeaderBar';
import { Card } from '@src/components/Card';
import { Button } from '@src/components/Button';
import { ModeIcon } from '@src/components/ModeIcon';
import { useSearchStore } from '@src/store/useSearchStore';
import { useTripsStore } from '@src/store/useTripsStore';
import { useUserStore, PaymentMethod } from '@src/store/useUserStore';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { radius, spacing, typography } from '@src/theme';
import { formatDuration, formatPrice } from '@src/utils/format';

const METHODS: { key: PaymentMethod; labelKey: string; Icon: any }[] = [
  { key: 'applePay', labelKey: 'booking.applePay', Icon: Apple },
  { key: 'googlePay', labelKey: 'booking.googlePay', Icon: Smartphone },
  { key: 'card', labelKey: 'booking.card', Icon: CreditCard },
];

export default function Booking() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const haptic = useHaptic();
  const { routeId, searchId } = useLocalSearchParams<{ routeId: string; searchId?: string }>();
  const getResults = useSearchStore((s) => s.getResults);
  const route = (getResults(searchId ?? '') ?? []).find((r) => r.id === routeId);
  const user = useUserStore();
  const bookRoute = useTripsStore((s) => s.bookRoute);
  const draft = useSearchStore((s) => s.draft);
  const [method, setMethod] = useState<PaymentMethod>(user.preferredPayment);

  if (!route) {
    return (
      <Screen>
        <HeaderBar title={t('booking.title')} />
        <Text style={{ color: theme.text }}>Route not found.</Text>
      </Screen>
    );
  }

  const confirm = () => {
    haptic.success();
    user.setPaymentMethod(method);
    const id = bookRoute(route, Math.max(1, draft.passengers));
    router.replace(`/booking/success?tripId=${id}` as any);
  };

  return (
    <Screen scrollable>
      <HeaderBar title={t('booking.title')} subtitle={`${route.origin.name} → ${route.destination.name}`} />

      <Card>
        <View style={styles.row}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primary }]}>
            <UserIcon size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.caption, { color: theme.textMuted }]}>
              {t('booking.passengerInfo')}
            </Text>
            <Text style={[typography.bodyStrong, { color: theme.text }]}>
              {user.name} · {user.email}
            </Text>
          </View>
        </View>
      </Card>

      <Text style={[typography.overline, styles.sectionTitle, { color: theme.textMuted }]}>
        {t('booking.payment')}
      </Text>
      <Card>
        <View style={{ gap: spacing.sm }}>
          {METHODS.map(({ key, labelKey, Icon }) => {
            const active = method === key;
            return (
              <Pressable
                key={key}
                onPress={() => {
                  haptic.light();
                  setMethod(key);
                }}
                style={[
                  styles.payRow,
                  {
                    borderColor: active ? theme.primary : theme.border,
                    backgroundColor: active ? theme.primary + '10' : 'transparent',
                  },
                ]}
              >
                <Icon size={20} color={theme.text} />
                <Text style={[typography.bodyStrong, { color: theme.text, marginLeft: spacing.md, flex: 1 }]}>
                  {t(labelKey)}
                </Text>
                <View
                  style={[
                    styles.radio,
                    { borderColor: active ? theme.primary : theme.border },
                  ]}
                >
                  {active ? <View style={[styles.radioDot, { backgroundColor: theme.primary }]} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Text style={[typography.overline, styles.sectionTitle, { color: theme.textMuted }]}>
        {t('booking.breakdown')}
      </Text>
      <Card>
        {route.segments.map((seg) => (
          <View key={seg.id} style={styles.breakdownRow}>
            <ModeIcon mode={seg.mode} size={16} />
            <Text style={[typography.body, { color: theme.text, marginLeft: spacing.sm, flex: 1 }]}>
              {seg.operator} · {seg.line}{' '}
              <Text style={[typography.caption, { color: theme.textMuted }]}>
                ({formatDuration(seg.durationMin)})
              </Text>
            </Text>
            <Text style={[typography.bodyStrong, { color: theme.text }]}>
              {formatPrice(seg.priceEur)}
            </Text>
          </View>
        ))}
        <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
          <Text style={[typography.h3, { color: theme.text }]}>{t('common.total')}</Text>
          <Text style={[typography.h2, { color: theme.primary }]}>
            {formatPrice(route.totalPriceEur)}
          </Text>
        </View>
        <View style={styles.noteRow}>
          <ShieldCheck size={14} color={theme.eco} />
          <Text style={[typography.caption, { color: theme.textMuted, marginLeft: spacing.xs, flex: 1 }]}>
            {t('booking.secureNote')}
          </Text>
        </View>
      </Card>

      <View style={{ marginTop: spacing.xxxl }}>
        <Button label={t('booking.confirm')} onPress={confirm} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  sectionTitle: { marginTop: spacing.xl, marginBottom: spacing.sm },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
});

import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { radius, shadows, spacing, typography } from '@src/theme';

type Props = {
  visible: boolean;
  selectedDate?: string;
  minDate?: string;
  onClose: () => void;
  onSelect: (date: string) => void;
};

const pad = (n: number) => n.toString().padStart(2, '0');
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const buildMonthGrid = (anchor: Date): Date[] => {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const offsetMonStart = (first.getDay() + 6) % 7;
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - offsetMonStart);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return days;
};

export const CalendarPicker = ({ visible, selectedDate, minDate, onClose, onSelect }: Props) => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const haptic = useHaptic();
  const locale = i18n.language === 'de' ? 'de-DE' : 'en-GB';

  const initialAnchor = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
  const [anchor, setAnchor] = useState(initialAnchor);

  useEffect(() => {
    if (visible) {
      setAnchor(selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date());
    }
  }, [visible, selectedDate]);

  const min = minDate ? new Date(`${minDate}T00:00:00`) : startOfDay(new Date());
  const grid = buildMonthGrid(anchor);
  const monthLabel = anchor.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const weekdays = (() => {
    const refMonday = new Date(2024, 0, 1);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(refMonday);
      d.setDate(refMonday.getDate() + i);
      return d.toLocaleDateString(locale, { weekday: 'short' });
    });
  })();

  const stepMonth = (delta: number) => {
    haptic.light();
    const next = new Date(anchor.getFullYear(), anchor.getMonth() + delta, 1);
    setAnchor(next);
  };

  const pick = (d: Date) => {
    haptic.medium();
    onSelect(toIso(d));
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: theme.scrim }]}
        onPress={onClose}
      >
        <Pressable
          style={[styles.sheet, shadows.lg, { backgroundColor: theme.card }]}
          onPress={() => {}}
        >
          <View style={styles.titleRow}>
            <Text style={[typography.h3, { color: theme.text }]}>
              {t('search.calendarTitle')}
            </Text>
            <Pressable
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.cardAlt }]}
              hitSlop={8}
            >
              <X size={16} color={theme.text} />
            </Pressable>
          </View>

          <View style={styles.header}>
            <Pressable
              onPress={() => stepMonth(-1)}
              style={[styles.navBtn, { borderColor: theme.border }]}
              hitSlop={6}
            >
              <ChevronLeft size={18} color={theme.text} />
            </Pressable>
            <Text style={[typography.bodyStrong, { color: theme.text }]}>{monthLabel}</Text>
            <Pressable
              onPress={() => stepMonth(1)}
              style={[styles.navBtn, { borderColor: theme.border }]}
              hitSlop={6}
            >
              <ChevronRight size={18} color={theme.text} />
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {weekdays.map((w, idx) => (
              <Text
                key={`${w}-${idx}`}
                style={[typography.caption, styles.weekday, { color: theme.textMuted }]}
              >
                {w}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {grid.map((d) => {
              const iso = toIso(d);
              const inMonth = d.getMonth() === anchor.getMonth();
              const isPast = startOfDay(d).getTime() < startOfDay(min).getTime();
              const isSelected = iso === selectedDate;
              const isToday = iso === toIso(new Date());
              const disabled = isPast;
              return (
                <Pressable
                  key={iso}
                  disabled={disabled}
                  onPress={() => pick(d)}
                  style={({ pressed }) => [
                    styles.cell,
                    isSelected && { backgroundColor: theme.primary },
                    !isSelected && isToday && { borderColor: theme.primary, borderWidth: 1 },
                    pressed && !disabled && !isSelected && { backgroundColor: theme.cardAlt },
                  ]}
                >
                  <Text
                    style={[
                      typography.body,
                      {
                        color: isSelected
                          ? '#FFFFFF'
                          : disabled
                            ? theme.textSubtle
                            : inMonth
                              ? theme.text
                              : theme.textMuted,
                      },
                    ]}
                  >
                    {d.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  sheet: {
    width: '100%',
    maxWidth: 380,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
});

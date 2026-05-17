import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Screen } from '@src/components/Screen';
import { HeaderBar } from '@src/components/HeaderBar';
import { Card } from '@src/components/Card';
import { Button } from '@src/components/Button';
import { Chip } from '@src/components/Chip';
import { useTripsStore } from '@src/store/useTripsStore';
import { useTheme } from '@src/hooks/useTheme';
import { useHaptic } from '@src/hooks/useHaptic';
import { spacing, typography, radius } from '@src/theme';
import type { FeedbackTag } from '@src/mock/types';

const TAGS: FeedbackTag[] = ['punctual', 'comfort', 'easyTransfer', 'goodValue', 'eco'];

export default function Feedback() {
  const { t } = useTranslation();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const haptic = useHaptic();
  const submit = useTripsStore((s) => s.submitFeedback);
  const trip = useTripsStore((s) => s.getTrip(tripId!));
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<FeedbackTag[]>([]);
  const [comment, setComment] = useState('');

  const toggleTag = (tag: FeedbackTag) => {
    haptic.light();
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((p) => p !== tag) : [...prev, tag],
    );
  };

  const onSubmit = () => {
    if (rating === 0 || !trip) return;
    haptic.success();
    submit(trip.id, {
      rating,
      tags: selectedTags,
      comment: comment.trim() || undefined,
      submittedAt: new Date().toISOString(),
    });
    router.replace('/(tabs)/trips');
  };

  return (
    <Screen scrollable>
      <HeaderBar title={t('feedback.title')} />

      <Animated.View entering={FadeInUp.duration(400)}>
        <Text style={[typography.body, { color: theme.textMuted, marginBottom: spacing.lg }]}>
          {t('feedback.rateBody')}
        </Text>

        <Card>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => {
              const active = i <= rating;
              return (
                <Pressable
                  key={i}
                  onPress={() => {
                    haptic.light();
                    setRating(i);
                  }}
                  hitSlop={10}
                >
                  <Star
                    size={40}
                    color={active ? theme.warn : theme.textSubtle}
                    fill={active ? theme.warn : 'transparent'}
                  />
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={[typography.bodyStrong, { color: theme.text, marginBottom: spacing.sm }]}>
            What stood out?
          </Text>
          <View style={styles.tagRow}>
            {TAGS.map((tag) => (
              <View key={tag} style={{ marginRight: 6, marginBottom: 6 }}>
                <Chip
                  label={t(`feedback.tags.${tag}`)}
                  selected={selectedTags.includes(tag)}
                  onPress={() => toggleTag(tag)}
                />
              </View>
            ))}
          </View>
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={[typography.bodyStrong, { color: theme.text, marginBottom: spacing.sm }]}>
            {t('feedback.commentLabel')}
          </Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            placeholder="..."
            placeholderTextColor={theme.textSubtle}
            style={[
              typography.body,
              {
                color: theme.text,
                backgroundColor: theme.cardAlt,
                borderRadius: radius.md,
                padding: spacing.md,
                minHeight: 90,
                textAlignVertical: 'top',
              },
            ]}
          />
        </Card>
      </Animated.View>

      <View style={{ marginTop: spacing.xxxl }}>
        <Button label={t('feedback.submit')} onPress={onSubmit} disabled={rating === 0} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap' },
});

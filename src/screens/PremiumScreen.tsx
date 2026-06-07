import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Crown, Check, Sparkles } from 'lucide-react-native';

import { ModalHeader } from '@/components/layout/ModalHeader';
import { AnimatedGradientCard } from '@/components/ui/AnimatedGradientCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { useHaptics } from '@/hooks/useHaptics';
import { radius } from '@/theme';
import { usePremiumStore } from '@/store/premium.store';
import type { PremiumFlags } from '@/types';

const FEATURES: { label: string; flag: keyof PremiumFlags }[] = [
  { label: 'Remove all ads', flag: 'removeAds' },
  { label: 'Unlimited AI coach chats', flag: 'unlimitedAiChats' },
  { label: 'Unlimited history', flag: 'unlimitedHistory' },
  { label: 'Advanced analytics & reports', flag: 'advancedAnalytics' },
  { label: 'Export PDF reports', flag: 'exportPdf' },
  { label: 'Custom premium themes', flag: 'customThemes' },
  { label: 'Weekly AI summaries', flag: 'weeklyReports' },
];

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '$4.99', per: '/mo', badge: '' },
  { id: 'yearly', label: 'Yearly', price: '$39.99', per: '/yr', badge: 'SAVE 33%' },
] as const;

export function PremiumScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();
  const premium = usePremiumStore();
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');

  const subscribe = () => {
    haptic('success');
    // Demo: unlock all premium flags locally (wire to IAP for production).
    FEATURES.forEach((f) => premium.setFlag(f.flag, true));
    premium.setFlag('advancedReports', true);
    Alert.alert('Welcome to Premium 🎉', 'All premium features are now unlocked.');
  };

  const restore = () => {
    haptic('light');
    void premium.restore();
    Alert.alert('Restore purchases', 'Checking for previous purchases…');
  };

  const bg = isDark
    ? (['#0B0F1A', '#0E1626'] as const)
    : (['#F4F6FA', '#EFE8FF'] as const);

  return (
    <LinearGradient colors={bg} style={{ flex: 1 }}>
      <ModalHeader title="Premium" />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 32,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedGradientCard colors={['#7C5CFC', '#00A8FF', '#00C897']}>
          <View style={styles.heroIcon}>
            <Crown size={36} color="#fff" />
          </View>
          <Text variant="h2" style={{ color: '#fff' }}>
            FitBMI Premium
          </Text>
          <Text variant="body" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Unlock unlimited AI coaching, advanced analytics, custom themes and
            an ad-free experience.
          </Text>
        </AnimatedGradientCard>

        {/* Plans */}
        <View style={styles.plans}>
          {PLANS.map((p) => {
            const selected = plan === p.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => {
                  haptic('light');
                  setPlan(p.id);
                }}
                style={{ flex: 1 }}
              >
                <GlassCard
                  style={[
                    styles.plan,
                    selected && { borderColor: colors.primary, borderWidth: 2 },
                  ]}
                >
                  {p.badge ? (
                    <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                      <Text variant="label" style={{ color: '#111' }}>
                        {p.badge}
                      </Text>
                    </View>
                  ) : null}
                  <Text variant="title">{p.label}</Text>
                  <View style={styles.priceRow}>
                    <Text variant="h2">{p.price}</Text>
                    <Text variant="caption" tone="muted">
                      {p.per}
                    </Text>
                  </View>
                </GlassCard>
              </Pressable>
            );
          })}
        </View>

        {/* Feature comparison */}
        <GlassCard>
          <View style={styles.compareHeader}>
            <Text variant="title" style={styles.featureCol}>
              Feature
            </Text>
            <Text variant="label" tone="muted">
              Free
            </Text>
            <View style={styles.premiumColHead}>
              <Sparkles size={14} color={colors.primary} />
              <Text variant="label" tone="primary">
                Premium
              </Text>
            </View>
          </View>
          {FEATURES.map((f) => (
            <View key={f.flag} style={styles.compareRow}>
              <Text variant="body" style={styles.featureCol}>
                {f.label}
              </Text>
              <Text variant="body" tone="muted" style={styles.freeCol}>
                —
              </Text>
              <View style={styles.premiumCol}>
                <Check size={18} color={colors.primary} />
              </View>
            </View>
          ))}
        </GlassCard>

        <Button
          title={
            premium.isActive()
              ? 'Premium active ✓'
              : `Start ${plan === 'yearly' ? 'Yearly' : 'Monthly'} Plan`
          }
          onPress={subscribe}
          disabled={premium.isActive()}
          icon={<Crown size={18} color="#fff" />}
        />
        <Button title="Restore purchases" variant="ghost" onPress={restore} />
        <Text variant="label" tone="muted" style={styles.legal}>
          Subscriptions auto-renew until cancelled. Cancel anytime in your store
          account settings.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  heroIcon: { marginBottom: 8 },
  plans: { flexDirection: 'row', gap: 12 },
  plan: { gap: 6, alignItems: 'flex-start' },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  compareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    gap: 12,
  },
  premiumColHead: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 70, justifyContent: 'center' },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  featureCol: { flex: 1 },
  freeCol: { width: 32, textAlign: 'center' },
  premiumCol: { width: 70, alignItems: 'center' },
  legal: { textAlign: 'center', marginTop: 4 },
});

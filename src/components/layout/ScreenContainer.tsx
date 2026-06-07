import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  /** Extra bottom padding to clear the tab bar / FAB. */
  bottomInset?: number;
  /** Enables pull-to-refresh on the scroll view. */
  refreshing?: boolean;
  onRefresh?: () => void;
}

/**
 * App-wide screen wrapper: themed gradient background, safe-area padding,
 * and optional scrolling. Decorative gradient blobs add depth to the
 * glassmorphism aesthetic.
 */
function ScreenContainerComponent({
  children,
  scroll = true,
  contentStyle,
  bottomInset = 24,
  refreshing,
  onRefresh,
}: ScreenContainerProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const bg = isDark
    ? (['#0B0F1A', '#0E1626'] as const)
    : (['#F4F6FA', '#EAF0FA'] as const);

  const Body = (
    <View style={[{ paddingTop: insets.top + 8 }, styles.body, contentStyle]}>
      {children}
    </View>
  );

  return (
    <LinearGradient colors={bg} style={styles.fill}>
      {/* Decorative accent blobs */}
      <View
        pointerEvents="none"
        style={[styles.blob, { backgroundColor: `${colors.primary}22`, top: -60, right: -40 }]}
      />
      <View
        pointerEvents="none"
        style={[styles.blob, { backgroundColor: `${colors.secondary}1A`, top: 180, left: -70 }]}
      />
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + bottomInset + 60,
          }}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={Boolean(refreshing)}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            ) : undefined
          }
        >
          {Body}
        </ScrollView>
      ) : (
        Body
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  body: { paddingHorizontal: 16, gap: 16 },
  blob: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
});

export const ScreenContainer = memo(ScreenContainerComponent);

import React, { memo, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Triangle } from 'lucide-react-native';

import { palette } from '@/theme';
import { Text } from '@/components/ui/Text';
import { useHaptics } from '@/hooks/useHaptics';
import { REWARD_WHEEL } from '@/store/gamification.store';

interface RewardWheelProps {
  size?: number;
  disabled?: boolean;
  /** Choose the winning segment index. */
  pick: () => number;
  /** Called after the spin animation lands on an index. */
  onResult: (index: number) => void;
}

const SEGMENT_COLORS = [
  palette.primary,
  palette.secondary,
  '#FFB020',
  '#9D7BFF',
  '#FF5C8A',
  palette.primaryDark,
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function segmentPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

/** Spin-to-win reward wheel (SVG + Reanimated rotation). */
function RewardWheelComponent({
  size = 260,
  disabled = false,
  pick,
  onResult,
}: RewardWheelProps) {
  const haptic = useHaptics();
  const rotation = useSharedValue(0);
  const [spinning, setSpinning] = useState(false);

  const n = REWARD_WHEEL.length;
  const seg = 360 / n;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 6;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const finish = (index: number) => {
    setSpinning(false);
    onResult(index);
  };

  const spin = () => {
    if (disabled || spinning) return;
    setSpinning(true);
    haptic('medium');
    const index = pick() % n;
    // Pointer is at the top (12 o'clock). Rotate so the chosen segment centre
    // lands under the pointer, plus several full turns.
    const target = 360 * 5 + (360 - (index * seg + seg / 2));
    rotation.value = withTiming(
      rotation.value + target,
      { duration: 3200, easing: Easing.out(Easing.cubic) },
      (done) => {
        if (done) runOnJS(finish)(index);
      },
    );
  };

  return (
    <View style={{ alignItems: 'center', gap: 16 }}>
      <View style={{ width: size, height: size }}>
        <Animated.View style={animatedStyle}>
          <Svg width={size} height={size}>
            <G>
              {REWARD_WHEEL.map((rw, i) => {
                const start = i * seg;
                const end = start + seg;
                const mid = start + seg / 2;
                const label = polar(cx, cy, r * 0.62, mid);
                return (
                  <G key={i}>
                    <Path
                      d={segmentPath(cx, cy, r, start, end)}
                      fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                      opacity={0.9}
                    />
                    <SvgText
                      x={label.x}
                      y={label.y}
                      fill="#fff"
                      fontSize={13}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {rw.label}
                    </SvgText>
                  </G>
                );
              })}
              <Circle cx={cx} cy={cy} r={18} fill="#fff" />
            </G>
          </Svg>
        </Animated.View>
        {/* Pointer */}
        <View style={styles.pointer}>
          <Triangle size={26} color={palette.dark} fill={palette.dark} />
        </View>
      </View>

      <Pressable
        onPress={spin}
        disabled={disabled || spinning}
        style={[
          styles.spinBtn,
          { backgroundColor: disabled ? '#9CA3AF' : palette.primary },
        ]}
        accessibilityRole="button"
      >
        <Text variant="title" style={{ color: '#fff' }}>
          {disabled ? 'Come back tomorrow' : spinning ? 'Spinning…' : 'SPIN'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pointer: {
    position: 'absolute',
    top: -6,
    alignSelf: 'center',
    transform: [{ rotate: '180deg' }],
  },
  spinBtn: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 999,
  },
});

export const RewardWheel = memo(RewardWheelComponent);

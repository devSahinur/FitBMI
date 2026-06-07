import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Line as SvgLine,
} from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { palette } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import type { ChartPoint } from '@/types';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface TrendChartProps {
  data: ChartPoint[];
  height?: number;
  color?: string;
  title?: string;
}

/** Build a smooth (Catmull-Rom → cubic Bézier) path through points. */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0]!.x} ${pts[0]!.y}`;
  let d = `M ${pts[0]!.x} ${pts[0]!.y}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i === 0 ? 0 : i - 1]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1]!;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

/**
 * Trend line + gradient area chart drawn with react-native-svg (Expo Go
 * compatible — no Skia). The line animates in via stroke-dashoffset.
 */
function TrendChartComponent({
  data,
  height = 220,
  color = palette.primary,
  title,
}: TrendChartProps) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const progress = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  const hasData = data.length >= 2;
  const padX = 8;
  const padY = 18;
  const innerW = Math.max(width - padX * 2, 1);
  const innerH = height - padY * 2;

  const ys = data.map((d) => d.y);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 1);
  const span = maxY - minY || 1;

  const pts = data.map((d, i) => ({
    x: padX + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW),
    y: padY + innerH - ((d.y - minY) / span) * innerH,
  }));

  const linePath = smoothPath(pts);
  const areaPath =
    pts.length >= 2
      ? `${linePath} L ${pts[pts.length - 1]!.x} ${padY + innerH} L ${pts[0]!.x} ${
          padY + innerH
        } Z`
      : '';

  // Approximate path length for the draw-on animation.
  const pathLen = innerW * 1.4;

  useEffect(() => {
    if (!hasData || width === 0) return;
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [hasData, width, linePath, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLen * (1 - progress.value),
  }));

  return (
    <View style={{ gap: 8 }}>
      {title ? <Text variant="title">{title}</Text> : null}
      <View style={{ height }} onLayout={onLayout}>
        {!hasData ? (
          <View style={[styles.empty, { height }]}>
            <Text variant="caption" tone="muted">
              Not enough data yet — keep logging to see your trend.
            </Text>
          </View>
        ) : width > 0 ? (
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={color} stopOpacity={0.35} />
                <Stop offset="1" stopColor={color} stopOpacity={0.02} />
              </LinearGradient>
            </Defs>

            {/* baseline grid */}
            <SvgLine
              x1={padX}
              y1={padY + innerH}
              x2={width - padX}
              y2={padY + innerH}
              stroke={colors.border}
              strokeWidth={1}
            />

            {areaPath ? <Path d={areaPath} fill="url(#trendArea)" /> : null}

            <AnimatedPath
              d={linePath}
              stroke={color}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={pathLen}
              animatedProps={animatedProps}
            />

            {pts.map((p, i) => (
              <Circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={3}
                fill={colors.surface}
                stroke={color}
                strokeWidth={2}
              />
            ))}
          </Svg>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});

export const TrendChart = memo(TrendChartComponent);

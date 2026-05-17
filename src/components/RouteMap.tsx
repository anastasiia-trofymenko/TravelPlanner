import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import type { Route } from '@src/mock/types';
import { useTheme } from '@src/hooks/useTheme';
import { modeColor, radius } from '@src/theme';

type Props = {
  route: Route;
  height?: number;
};

export const RouteMap = ({ route, height = 200 }: Props) => {
  const { theme } = useTheme();

  const stops = useMemo(() => {
    const pts = [route.segments[0].from];
    route.segments.forEach((s) => pts.push(s.to));
    return pts;
  }, [route]);

  const { projected, viewWidth } = useMemo(() => {
    const lats = stops.map((s) => s.coords.lat);
    const lngs = stops.map((s) => s.coords.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const padX = 30;
    const padY = 30;
    const w = 320;
    const h = height;
    const spanLat = Math.max(0.001, maxLat - minLat);
    const spanLng = Math.max(0.001, maxLng - minLng);
    const projected = stops.map((s) => ({
      x: padX + ((s.coords.lng - minLng) / spanLng) * (w - padX * 2),
      y: padY + ((maxLat - s.coords.lat) / spanLat) * (h - padY * 2),
    }));
    return { projected, viewWidth: w };
  }, [stops, height]);

  const buildPath = () => {
    if (projected.length < 2) return '';
    let d = `M ${projected[0].x} ${projected[0].y}`;
    for (let i = 1; i < projected.length; i++) {
      const a = projected[i - 1];
      const b = projected[i];
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2 - 24;
      d += ` Q ${cx} ${cy} ${b.x} ${b.y}`;
    }
    return d;
  };

  const path = buildPath();

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.cardAlt, height }]}>
      <Svg width="100%" height={height} viewBox={`0 0 ${viewWidth} ${height}`} preserveAspectRatio="xMidYMid meet">
        <Defs>
          <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={theme.primary} stopOpacity="0.95" />
            <Stop offset="1" stopColor={theme.accent} stopOpacity="0.95" />
          </LinearGradient>
        </Defs>
        <G>
          <Path
            d={path}
            stroke="url(#routeGrad)"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 8"
          />
          {route.segments.map((seg, i) => {
            const a = projected[i];
            const b = projected[i + 1];
            const cx = (a.x + b.x) / 2;
            const cy = (a.y + b.y) / 2 - 24;
            const d = `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
            return (
              <Path
                key={seg.id}
                d={d}
                stroke={modeColor[seg.mode]}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
          {projected.map((p, i) => {
            const isEnd = i === 0 || i === projected.length - 1;
            return (
              <G key={i}>
                <Circle cx={p.x} cy={p.y} r={isEnd ? 10 : 6} fill="#FFFFFF" />
                <Circle
                  cx={p.x}
                  cy={p.y}
                  r={isEnd ? 7 : 4}
                  fill={isEnd ? theme.primary : theme.accent}
                />
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});

import { Platform, ViewStyle } from 'react-native';

const make = (
  opacity: number,
  radius: number,
  offsetY: number,
  elevation: number,
): ViewStyle =>
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0F172A',
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: offsetY },
    },
    android: { elevation },
    default: {
      shadowColor: '#0F172A',
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: offsetY },
    },
  }) as ViewStyle;

export const shadows = {
  none: {} as ViewStyle,
  sm: make(0.06, 6, 2, 2),
  md: make(0.08, 14, 6, 4),
  lg: make(0.12, 24, 10, 8),
  primary: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#FF3D7F',
      shadowOpacity: 0.35,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
    },
    android: { elevation: 8 },
    default: {
      shadowColor: '#FF3D7F',
      shadowOpacity: 0.35,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
    },
  }) as ViewStyle,
};

import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type Theme } from '@src/theme';

export const useTheme = (): { theme: Theme; isDark: boolean } => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return { theme: isDark ? darkTheme : lightTheme, isDark };
};

import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#121214',
    textSecondary: '#5F616B',
    textMuted: '#8E909B',
    background: '#F8F6F2',
    surface: '#FFFFFF',
    surfaceElevated: '#F0ECE4',
    surfaceHighlight: '#E8E3D8',
    border: '#E6E1D8',
    borderSubtle: '#EFECE6',
    accent: '#A87B2E', // Refined bronze
    accentLight: '#F7F1E6',
    accentHover: '#8F6722',
    verified: '#0D8BF0',
    dealerBadge: '#A87B2E',
    danger: '#E03137',
    success: '#12B886',
    cardOverlay: 'rgba(0, 0, 0, 0.55)',
    tabBarBackground: 'rgba(248, 246, 242, 0.96)',
    tabBarBorder: '#E4DFD5',
    tabActive: '#A87B2E',
    tabInactive: '#88857E',
    backgroundElement: '#F0ECE4',
    backgroundSelected: '#E4DFD5',
  },
  dark: {
    text: '#F5F4F0',
    textSecondary: '#9CA0B0',
    textMuted: '#6B7082',
    background: '#0C0D11', // Deep midnight near-black
    surface: '#151720', // Deep charcoal / navy
    surfaceElevated: '#1F222E',
    surfaceHighlight: '#2A2E3E',
    border: '#252936',
    borderSubtle: '#1C1E28',
    accent: '#DFBE88', // Restrained champagne
    accentLight: '#262217',
    accentHover: '#ECCEA0',
    verified: '#38BDF8',
    dealerBadge: '#DFBE88',
    danger: '#F87171',
    success: '#34D399',
    cardOverlay: 'rgba(0, 0, 0, 0.72)',
    tabBarBackground: 'rgba(12, 13, 17, 0.96)',
    tabBarBorder: '#232633',
    tabActive: '#DFBE88',
    tabInactive: '#6E7284',
    backgroundElement: '#1F222E',
    backgroundSelected: '#2A2E3E',
  },
} as const;

export type ThemeMode = 'light' | 'dark';
export type AppearancePreference = 'light' | 'dark' | 'system';
export type ThemeColor = keyof typeof Colors.light;
export type ThemeColors = Record<ThemeColor, string>;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display, system-ui, -apple-system, sans-serif)',
    serif: 'var(--font-serif, Georgia, serif)',
    rounded: 'var(--font-rounded, system-ui)',
    mono: 'var(--font-mono, monospace)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
  nine: 48,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
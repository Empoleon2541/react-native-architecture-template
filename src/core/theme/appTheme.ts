import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

// ─── Color palette (mirrors Flutter AppTheme) ────────────────────────────────

export const Colors = {
  primary: '#5C6BC0',       // Indigo 400
  primaryDark: '#3949AB',   // Indigo 600
  primaryLight: '#9FA8DA',  // Indigo 200
  secondary: '#26A69A',     // Teal 400
  error: '#EF5350',         // Red 400
  success: '#66BB6A',       // Green 400
  warning: '#FFA726',       // Orange 400

  // Neutrals
  white: '#FFFFFF',
  surface: '#F5F5F5',
  background: '#F5F5F5',
  divider: '#EEEEEE',
  border: '#BDBDBD',

  // Text
  textPrimary: '#212121',
  textSecondary: '#424242',
  textTertiary: '#616161',
  textDisabled: '#9E9E9E',
  textHint: '#757575',

  // Tab bar
  tabActive: '#5C6BC0',
  tabInactive: '#9E9E9E',

  // Event type colours (realtime feature)
  notificationBg: '#E8EAF6',
  notificationAccent: '#5C6BC0',
  priceUpdateBg: '#E8F5E9',
  priceUpdateAccent: '#66BB6A',
  chatMessageBg: '#FFF3E0',
  chatMessageAccent: '#FFA726',
} as const;

// ─── Typography ──────────────────────────────────────────────────────────────

export const Typography = {
  headlineLarge: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 40,
  } as TextStyle,

  headlineMedium: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 32,
  } as TextStyle,

  titleLarge: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 28,
  } as TextStyle,

  titleMedium: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 24,
  } as TextStyle,

  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 24,
  } as TextStyle,

  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textTertiary,
    lineHeight: 20,
  } as TextStyle,

  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textHint,
    lineHeight: 16,
  } as TextStyle,

  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ─── Border radii ────────────────────────────────────────────────────────────

export const Radius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  } as ViewStyle,

  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  } as ViewStyle,
} as const;

// ─── Common component styles ──────────────────────────────────────────────────

export const CommonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.card,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
});

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../core/store/store';
import { loginThunk, clearAuthError } from '../store/authSlice';
import { LoginForm } from '../components/LoginForm';
import { Colors, Spacing, Typography } from '../../../../core/theme/appTheme';

/**
 * Login screen — full auth UI.
 * Dispatches `loginThunk` and reads status/error from Redux.
 * Navigation to Main happens in AppNavigator via `auth.status` watcher.
 */
export const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const isLoading = status === 'loading';

  // Clear any stale error when the component mounts
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleLogin = (email: string, password: string) => {
    dispatch(loginThunk({ email, password }));
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>RN</Text>
          </View>
          <Text style={styles.title}>Architecture Starter</Text>
          <Text style={styles.subtitle}>
            React Native · Clean Architecture · Redux
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSubtitle}>Sign in to your account</Text>

          <View style={styles.formContainer}>
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Clean Architecture · Redux Toolkit · Axios Mock
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 80,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
  },
  title: {
    ...Typography.headlineMedium,
    color: Colors.white,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTitle: {
    ...Typography.titleLarge,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    ...Typography.bodyMedium,
    color: Colors.textTertiary,
    marginBottom: Spacing.lg,
  },
  formContainer: {
    width: '100%',
  },
  footer: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

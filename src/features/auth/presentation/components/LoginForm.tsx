import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../../../../core/theme/appTheme';
import { AppConstants } from '../../../../core/constants/appConstants';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * Extracted form component — handles local input state.
 * Surfaces submission and loading state up to the screen via `onSubmit`.
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, error }) => {
  const [email, setEmail] = useState(AppConstants.mockCredentials.email);
  const [password, setPassword] = useState(AppConstants.mockCredentials.password);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = () => {
    if (!isLoading) {
      onSubmit(email.trim(), password);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        {/* Email field */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, emailFocused && styles.inputFocused, error ? styles.inputError : null]}
            value={email}
            onChangeText={setEmail}
            placeholder="demo@example.com"
            placeholderTextColor={Colors.textDisabled}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            editable={!isLoading}
          />
        </View>

        {/* Password field */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, passwordFocused && styles.inputFocused, error ? styles.inputError : null]}
            value={password}
            onChangeText={setPassword}
            placeholder="password123"
            placeholderTextColor={Colors.textDisabled}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            editable={!isLoading}
          />
        </View>

        {/* Error message */}
        {error !== null && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Submit button */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Hint */}
        <Text style={styles.hint}>
          Demo: {AppConstants.mockCredentials.email} / {AppConstants.mockCredentials.password}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  form: {
    gap: Spacing.md,
  },
  fieldWrapper: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.titleMedium,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 6,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    ...Typography.bodySmall,
    textAlign: 'center',
    color: Colors.textDisabled,
    marginTop: Spacing.xs,
  },
});

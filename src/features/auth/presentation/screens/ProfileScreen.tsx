import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../../../core/store/store';
import { logoutThunk } from '../store/authSlice';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../../../core/theme/appTheme';

/** Displays the authenticated user's info and provides a logout button. */
export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);

  const isLoggingOut = status === 'loading';

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  if (!user) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar & name */}
      <View style={styles.avatarSection}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Info card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Details</Text>

        <View style={styles.divider} />

        <InfoRow icon="id-card-outline" label="User ID" value={user.id} />
        <View style={styles.divider} />
        <InfoRow icon="mail-outline" label="Email" value={user.email} />
        <View style={styles.divider} />
        <InfoRow
          icon="key-outline"
          label="Token"
          value={`${user.token.substring(0, 24)}...`}
        />
      </View>

      {/* Architecture info card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stack</Text>
        <View style={styles.divider} />
        <InfoRow icon="layers-outline" label="Architecture" value="Clean Architecture" />
        <View style={styles.divider} />
        <InfoRow icon="git-branch-outline" label="State" value="Redux Toolkit" />
        <View style={styles.divider} />
        <InfoRow icon="cloud-outline" label="HTTP" value="Axios + Mock Adapter" />
        <View style={styles.divider} />
        <InfoRow icon="save-outline" label="Cache" value="AsyncStorage" />
      </View>

      {/* Logout button */}
      <TouchableOpacity
        style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={isLoggingOut}
        activeOpacity={0.8}
      >
        {isLoggingOut ? (
          <ActivityIndicator color={Colors.error} size="small" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

// ─── Helper component ─────────────────────────────────────────────────────────

interface InfoRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color={Colors.primary} style={styles.infoIcon} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
  },
  name: {
    ...Typography.titleLarge,
    color: Colors.textPrimary,
  },
  email: {
    ...Typography.bodyMedium,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.card,
  },
  cardTitle: {
    ...Typography.titleMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.xs,
  },
  infoIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...Typography.bodySmall,
    color: Colors.textDisabled,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.error,
    marginTop: Spacing.sm,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
});

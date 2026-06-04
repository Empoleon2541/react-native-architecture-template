import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../../../core/store/store';
import { fetchPostDetailThunk, clearSelectedPost } from '../store/postsSlice';
import type { PostsStackParamList } from '../../../../core/navigation/types';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../../../core/theme/appTheme';

type PostDetailRouteProp = RouteProp<PostsStackParamList, 'PostDetail'>;

/**
 * Post detail screen.
 * Receives `id` as a route param, dispatches `fetchPostDetailThunk` on mount,
 * and displays the full post body.
 */
export const PostDetailScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute<PostDetailRouteProp>();
  const { id } = route.params;

  const { selectedPost, status, error } = useAppSelector((state) => state.posts);
  const isLoading = status === 'loading';

  useEffect(() => {
    dispatch(fetchPostDetailThunk(id));

    return () => {
      // Clean up selected post when leaving the screen
      dispatch(clearSelectedPost());
    };
  }, [dispatch, id]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading || !selectedPost) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading post…</Text>
      </View>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (status === 'failed') {
    return (
      <View style={styles.centred}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
        <Text style={styles.errorTitle}>Post not found</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={16} color={Colors.white} />
          <Text style={styles.backButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ID badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Post #{selectedPost.id}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{selectedPost.title}</Text>

      {/* Meta */}
      <View style={styles.metaRow}>
        <Ionicons name="person-circle-outline" size={16} color={Colors.primary} />
        <Text style={styles.metaText}>User {selectedPost.userId}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Body */}
      <View style={styles.bodyCard}>
        <Text style={styles.bodyText}>{selectedPost.body}</Text>
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={styles.backLink}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back-outline" size={18} color={Colors.primary} />
        <Text style={styles.backLinkText}>Back to Posts</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  title: {
    ...Typography.headlineMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: 32,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: Spacing.md,
  },
  bodyCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.card,
    marginBottom: Spacing.lg,
  },
  bodyText: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  loadingText: {
    ...Typography.bodyMedium,
    color: Colors.textDisabled,
  },
  errorTitle: {
    ...Typography.titleMedium,
    color: Colors.textPrimary,
  },
  errorMessage: {
    ...Typography.bodyMedium,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  backLinkText: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
});

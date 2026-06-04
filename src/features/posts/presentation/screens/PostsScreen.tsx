import React, { useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../../../core/store/store';
import { fetchPostsThunk } from '../store/postsSlice';
import { PostCard } from '../components/PostCard';
import { Post } from '../../domain/entities/Post';
import type { PostsStackNavigationProp } from '../../../../core/navigation/types';
import { Colors, Spacing, Typography } from '../../../../core/theme/appTheme';

/**
 * Posts list screen — FlatList with PostCards, pull-to-refresh,
 * and loading / error states.
 */
export const PostsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, status, error } = useAppSelector((state) => state.posts);
  const navigation = useNavigation<PostsStackNavigationProp>();

  const isLoading = status === 'loading';
  const isRefreshing = status === 'loading' && posts.length > 0;

  useEffect(() => {
    dispatch(fetchPostsThunk());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchPostsThunk());
  }, [dispatch]);

  const handlePostPress = useCallback(
    (post: Post) => {
      navigation.navigate('PostDetail', { id: post.id });
    },
    [navigation],
  );

  // ── Loading state (initial) ───────────────────────────────────────────────
  if (isLoading && posts.length === 0) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading posts…</Text>
      </View>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (status === 'failed' && posts.length === 0) {
    return (
      <View style={styles.centred}>
        <Ionicons name="cloud-offline-outline" size={64} color={Colors.textDisabled} />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Ionicons name="refresh-outline" size={16} color={Colors.white} />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PostCard post={item} onPress={handlePostPress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>{posts.length} posts</Text>
          </View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.centred}>
              <Ionicons name="document-text-outline" size={64} color={Colors.textDisabled} />
              <Text style={styles.emptyText}>No posts found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  listContent: {
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  listHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  listHeaderText: {
    ...Typography.bodySmall,
    color: Colors.textDisabled,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingText: {
    ...Typography.bodyMedium,
    color: Colors.textDisabled,
    marginTop: Spacing.sm,
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
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  retryText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: Colors.textDisabled,
  },
});

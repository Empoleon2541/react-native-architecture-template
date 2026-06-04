import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../../domain/entities/Post';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../../../core/theme/appTheme';

interface PostCardProps {
  post: Post;
  onPress: (post: Post) => void;
}

const MAX_BODY_LENGTH = 120;

/** Pressable card displaying a post's title and body excerpt. */
export const PostCard: React.FC<PostCardProps> = ({ post, onPress }) => {
  const excerpt =
    post.body.length > MAX_BODY_LENGTH
      ? `${post.body.substring(0, MAX_BODY_LENGTH)}...`
      : post.body;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(post)}
      activeOpacity={0.75}
    >
      {/* ID badge */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>#{post.id}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.textDisabled} />
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>

      {/* Excerpt */}
      <Text style={styles.body} numberOfLines={3}>
        {excerpt}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="person-outline" size={12} color={Colors.textDisabled} />
        <Text style={styles.footerText}>User {post.userId}</Text>
        <View style={styles.dot} />
        <Text style={styles.footerText}>Tap to read more</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  title: {
    ...Typography.titleMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  body: {
    ...Typography.bodyMedium,
    color: Colors.textTertiary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: 4,
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.textDisabled,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textDisabled,
  },
});

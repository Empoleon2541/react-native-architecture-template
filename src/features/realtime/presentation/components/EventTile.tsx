import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RealtimeEvent } from '../../domain/entities/RealtimeEvent';
import { Colors, Spacing, Radius, Typography } from '../../../../core/theme/appTheme';

interface EventTileProps {
  event: RealtimeEvent;
}

// ─── Per-type visual config ───────────────────────────────────────────────────

type EventConfig = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  bg: string;
  accent: string;
  label: string;
};

const EVENT_CONFIG: Record<RealtimeEvent['type'], EventConfig> = {
  notification: {
    icon: 'notifications',
    bg: Colors.notificationBg,
    accent: Colors.notificationAccent,
    label: 'Notification',
  },
  price_update: {
    icon: 'trending-up',
    bg: Colors.priceUpdateBg,
    accent: Colors.priceUpdateAccent,
    label: 'Price Update',
  },
  chat_message: {
    icon: 'chatbubble',
    bg: Colors.chatMessageBg,
    accent: Colors.chatMessageAccent,
    label: 'Chat Message',
  },
};

/**
 * Color-coded tile displaying a single realtime event.
 * Type determines the background color, accent, and icon.
 */
export const EventTile: React.FC<EventTileProps> = ({ event }) => {
  const config = EVENT_CONFIG[event.type];

  const formattedTime = new Date(event.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <View style={[styles.tile, { backgroundColor: config.bg }]}>
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: config.accent }]} />

      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: config.accent }]}>
        <Ionicons name={config.icon} size={16} color={Colors.white} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.typeLabel, { color: config.accent }]}>
            {config.label}
          </Text>
          <Text style={styles.eventId}>{event.id}</Text>
        </View>
        <Text style={styles.payload}>{event.payload}</Text>
        <Text style={styles.timestamp}>{formattedTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  accentBar: {
    width: 4,
  },
  iconContainer: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    margin: Spacing.sm,
    borderRadius: 8,
    alignSelf: 'flex-start',
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
    padding: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventId: {
    ...Typography.bodySmall,
    color: Colors.textDisabled,
  },
  payload: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  timestamp: {
    ...Typography.bodySmall,
    color: Colors.textHint,
  },
});

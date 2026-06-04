import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../../../core/store/store';
import {
  connectRealtimeThunk,
  disconnectRealtimeThunk,
  clearRealtimeEvents,
} from '../store/realtimeSlice';
import { EventTile } from '../components/EventTile';
import { RealtimeEvent } from '../../domain/entities/RealtimeEvent';
import { Colors, Spacing, Radius, Typography } from '../../../../core/theme/appTheme';

/**
 * Realtime events screen.
 *
 * - Connect/Disconnect button toggles the simulated WebSocket.
 * - A live FlatList shows incoming events (newest at top).
 * - A connection status badge reflects Redux state.
 * - Disconnects automatically on unmount to prevent memory leaks.
 */
export const RealtimeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status, events, error } = useAppSelector((state) => state.realtime);

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  // Disconnect on unmount
  useEffect(() => {
    return () => {
      dispatch(disconnectRealtimeThunk());
    };
  }, [dispatch]);

  const handleToggleConnection = useCallback(() => {
    if (isConnected) {
      dispatch(disconnectRealtimeThunk());
    } else {
      dispatch(connectRealtimeThunk());
    }
  }, [dispatch, isConnected]);

  const handleClearEvents = useCallback(() => {
    dispatch(clearRealtimeEvents());
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: RealtimeEvent }) => <EventTile event={item} />,
    [],
  );

  const keyExtractor = useCallback((item: RealtimeEvent) => item.id, []);

  return (
    <View style={styles.screen}>
      {/* Control bar */}
      <View style={styles.controlBar}>
        {/* Status badge */}
        <View style={[styles.statusBadge, statusBadgeStyle(status)]}>
          <View style={[styles.statusDot, statusDotStyle(status)]} />
          <Text style={[styles.statusText, statusTextStyle(status)]}>
            {statusLabel(status)}
          </Text>
        </View>

        <View style={styles.controlRight}>
          {/* Clear button */}
          {events.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearEvents}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}

          {/* Connect / Disconnect */}
          <TouchableOpacity
            style={[
              styles.connectButton,
              isConnected ? styles.disconnectButton : styles.connectButtonActive,
              isConnecting && styles.connectingButton,
            ]}
            onPress={handleToggleConnection}
            disabled={isConnecting}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isConnected ? 'stop-circle-outline' : 'play-circle-outline'}
              size={18}
              color={Colors.white}
            />
            <Text style={styles.connectButtonText}>
              {isConnecting ? 'Connecting…' : isConnected ? 'Disconnect' : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Error bar */}
      {error !== null && (
        <View style={styles.errorBar}>
          <Ionicons name="warning-outline" size={16} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Event list */}
      <FlatList
        data={events}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name={isConnected ? 'hourglass-outline' : 'wifi-outline'}
              size={64}
              color={Colors.textDisabled}
            />
            <Text style={styles.emptyTitle}>
              {isConnected ? 'Waiting for events…' : 'Not connected'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isConnected
                ? 'Events arrive every 3 seconds'
                : 'Tap Connect to start the simulated WebSocket'}
            </Text>
          </View>
        }
        ListHeaderComponent={
          events.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                {events.length} event{events.length !== 1 ? 's' : ''}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

// ─── Status helpers ───────────────────────────────────────────────────────────

function statusLabel(status: 'disconnected' | 'connecting' | 'connected'): string {
  switch (status) {
    case 'connected':
      return 'Connected';
    case 'connecting':
      return 'Connecting';
    case 'disconnected':
      return 'Disconnected';
  }
}

function statusBadgeStyle(status: 'disconnected' | 'connecting' | 'connected') {
  switch (status) {
    case 'connected':
      return { backgroundColor: Colors.priceUpdateBg };
    case 'connecting':
      return { backgroundColor: Colors.chatMessageBg };
    case 'disconnected':
      return { backgroundColor: Colors.surface };
  }
}

function statusDotStyle(status: 'disconnected' | 'connecting' | 'connected') {
  switch (status) {
    case 'connected':
      return { backgroundColor: Colors.success };
    case 'connecting':
      return { backgroundColor: Colors.warning };
    case 'disconnected':
      return { backgroundColor: Colors.textDisabled };
  }
}

function statusTextStyle(status: 'disconnected' | 'connecting' | 'connected') {
  switch (status) {
    case 'connected':
      return { color: Colors.priceUpdateAccent };
    case 'connecting':
      return { color: Colors.chatMessageAccent };
    case 'disconnected':
      return { color: Colors.textDisabled };
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  controlRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  clearButton: {
    padding: Spacing.xs,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    gap: Spacing.xs,
  },
  connectButtonActive: {
    backgroundColor: Colors.success,
  },
  disconnectButton: {
    backgroundColor: Colors.error,
  },
  connectingButton: {
    backgroundColor: Colors.warning,
  },
  connectButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  errorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    flex: 1,
  },
  listContent: {
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  listHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  listHeaderText: {
    ...Typography.bodySmall,
    color: Colors.textDisabled,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: Spacing.md,
  },
  emptyTitle: {
    ...Typography.titleMedium,
    color: Colors.textSecondary,
  },
  emptySubtitle: {
    ...Typography.bodyMedium,
    color: Colors.textDisabled,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});

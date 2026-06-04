/**
 * Centralised app constants.
 * Mirrors `AppConstants` from the Flutter kit.
 */
export const AppConstants = {
  /** Enable the axios-mock-adapter (true in dev / Expo Go). */
  enableMockAdapter: __DEV__,

  /** Show the react-native-network-logger overlay. */
  enableNetworkInspector: __DEV__,

  /** Maximum realtime events kept in Redux state (oldest are dropped). */
  maxRealtimeEvents: 50,

  /** Interval between simulated WebSocket events (ms). */
  realtimeEventIntervalMs: 3000,

  /** AsyncStorage keys used by the cache manager. */
  cacheKeys: {
    user: 'cached_user',
    posts: 'cached_posts',
  },

  /** Demo credentials for the login screen. */
  mockCredentials: {
    email: 'demo@example.com',
    password: 'password123',
  },
} as const;

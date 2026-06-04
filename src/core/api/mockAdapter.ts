import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './apiClient';

// ─── Shared mock data ────────────────────────────────────────────────────────

const mockUser = {
  id: 'usr_001',
  name: 'Alex Johnson',
  email: 'demo@example.com',
  token: 'mock_jwt_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  avatar: 'https://i.pravatar.cc/150?img=12',
};

const mockPostsData = [
  {
    id: 1,
    userId: 1,
    title: 'Getting Started with Flutter Clean Architecture',
    body: 'Clean Architecture separates your app into layers: data, domain, and presentation. Each layer has a specific responsibility. The domain layer contains business logic and is framework-agnostic. The data layer handles all data operations. The presentation layer manages UI state.',
  },
  {
    id: 2,
    userId: 1,
    title: 'BLoC Pattern: State Management Done Right',
    body: 'BLoC (Business Logic Component) separates business logic from UI. Events flow in, states flow out. This makes your code testable and predictable. BLoC uses streams under the hood, making it reactive by nature.',
  },
  {
    id: 3,
    userId: 2,
    title: 'Dependency Injection with GetIt in Flutter',
    body: 'GetIt is a simple service locator that acts as a dependency injection container. Register your dependencies once, then access them anywhere. It supports factories, singletons, and lazy singletons.',
  },
  {
    id: 4,
    userId: 2,
    title: 'Caching Strategies with Hive',
    body: 'Hive is a lightweight, blazing-fast key-value database for Flutter. It is pure Dart, so it works on all platforms without native dependencies. Use it to cache API responses and reduce network calls.',
  },
  {
    id: 5,
    userId: 3,
    title: 'Error Handling with dartz Either',
    body: 'The Either type from dartz represents a value of one of two possible types. Left typically represents failure, Right represents success. This eliminates null checks and makes error handling explicit.',
  },
  {
    id: 6,
    userId: 3,
    title: 'Real-Time Features with WebSockets in Flutter',
    body: 'WebSockets provide full-duplex communication over a single TCP connection. In Flutter, you can use the web_socket_channel package or simulate real-time events with StreamControllers for testing.',
  },
  {
    id: 7,
    userId: 4,
    title: 'Navigation with GoRouter',
    body: 'GoRouter is the official routing package for Flutter. It supports deep linking, redirects, and nested navigation. It uses a declarative API that integrates well with the widget tree.',
  },
  {
    id: 8,
    userId: 4,
    title: 'Feature Modularization Best Practices',
    body: 'Organizing your Flutter app by features (auth, posts, settings) rather than by layer (models, views, controllers) improves maintainability. Each feature folder contains its own data, domain, and presentation layers.',
  },
  {
    id: 9,
    userId: 5,
    title: 'Testing BLoC with flutter_test',
    body: 'Testing BLoC components is straightforward. Use bloc_test package to verify state transitions. Mock your repositories and inject them into the BLoC under test. Write tests for each event and its expected states.',
  },
  {
    id: 10,
    userId: 5,
    title: 'Offline-First Architecture Patterns',
    body: 'An offline-first app works without internet connectivity. Cache data locally on first load. Show cached data when offline. Sync when connection is restored. This pattern significantly improves user experience.',
  },
];

function getMockPost(id: number) {
  const index = ((id - 1) % mockPostsData.length + mockPostsData.length) % mockPostsData.length;
  return { ...mockPostsData[index], id };
}

// ─── Adapter singleton reference (allows teardown in tests) ──────────────────

let _adapter: MockAdapter | null = null;

/**
 * Installs axios-mock-adapter on the shared `apiClient`.
 * Safe to call multiple times — subsequent calls are no-ops.
 *
 * Simulated latencies mirror the Flutter kit:
 *   POST /auth/login  → 800 ms
 *   POST /auth/logout → 300 ms
 *   GET  /auth/me     →   0 ms (fast)
 *   GET  /posts       → 600 ms
 *   GET  /posts/:id   → 300 ms
 */
export function setupMockAdapter(): void {
  if (_adapter) return; // already installed

  _adapter = new MockAdapter(apiClient, { delayResponse: 0 });

  // POST /auth/login ──────────────────────────────────────────────────────────
  _adapter.onPost('/auth/login').reply(async () => {
    await delay(800);
    return [200, mockUser];
  });

  // POST /auth/logout ─────────────────────────────────────────────────────────
  _adapter.onPost('/auth/logout').reply(async () => {
    await delay(300);
    return [200, { success: true, message: 'Logged out' }];
  });

  // GET /auth/me ──────────────────────────────────────────────────────────────
  _adapter.onGet('/auth/me').reply(200, mockUser);

  // GET /posts/:id ────────────────────────────────────────────────────────────
  _adapter.onGet(/\/posts\/\d+$/).reply(async (config) => {
    await delay(300);
    const segments = config.url?.split('/') ?? [];
    const id = parseInt(segments[segments.length - 1] ?? '1', 10);
    return [200, getMockPost(id)];
  });

  // GET /posts ────────────────────────────────────────────────────────────────
  _adapter.onGet('/posts').reply(async () => {
    await delay(600);
    return [200, mockPostsData];
  });

  // Fallback — return 404 for anything else
  _adapter.onAny().reply(404, { message: 'Not found' });
}

/** Tear down the mock adapter (useful in test suites). */
export function teardownMockAdapter(): void {
  _adapter?.restore();
  _adapter = null;
}

/** Whether to use the mock adapter (mirrors Flutter's `kDebugMode`). */
export const enableMockAdapter: boolean = __DEV__;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

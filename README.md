# React Native Architecture Starter Kit

A production-ready React Native (Expo) starter kit demonstrating **Clean Architecture**, **Redux Toolkit state management**, **modular feature structure**, **mock APIs**, and a **real-time WebSocket simulation**.

This project is a faithful TypeScript translation of the [Flutter Architecture Starter Kit](../architecture-starter-kit-flutter), mapping each Flutter/Dart pattern to its idiomatic React Native equivalent.

---

## Flutter → React Native Equivalence

| Flutter | React Native |
|---|---|
| BLoC (events/states) | Redux Toolkit slices (actions + reducers) |
| GetIt | Custom `ServiceLocator` singleton (`src/core/di/serviceLocator.ts`) |
| GoRouter + guards | React Navigation v6 (Stack + Bottom Tabs) + `AuthGuard` HOC |
| Dio + MockInterceptor | Axios + axios-mock-adapter |
| Hive | AsyncStorage (`@react-native-async-storage/async-storage`) |
| dartz Either | `Result<T, E>` discriminated union (`src/core/error/Result.ts`) |
| Equatable | Not needed — TypeScript structural typing |
| flutter_bloc widgets | react-redux hooks (`useSelector`, `useDispatch`) |
| StatefulShellRoute | Bottom Tab Navigator with persistent state |
| requests_inspector | react-native-network-logger |

---

## Tech Stack

| Concern | Package |
|---|---|
| State management | `@reduxjs/toolkit` + `react-redux` |
| Dependency injection | Custom `ServiceLocator` (singleton map) |
| Navigation | `@react-navigation/native` v6 (Stack + Bottom Tabs) |
| HTTP | `axios` (mock adapter — no real network calls) |
| Local cache | `@react-native-async-storage/async-storage` |
| Network inspector | `react-native-network-logger` |
| Icons | `@expo/vector-icons` (Ionicons) |

---

## Project Structure

```
src/
├── core/
│   ├── api/
│   │   ├── apiClient.ts              # Axios instance + token helpers
│   │   ├── mockAdapter.ts            # axios-mock-adapter setup
│   │   └── inspector/
│   │       └── NetworkInspectorProvider.tsx  # Dev network logger overlay
│   ├── cache/
│   │   └── cacheManager.ts           # AsyncStorage JSON wrapper
│   ├── constants/
│   │   └── appConstants.ts           # Centralised app constants
│   ├── di/
│   │   └── serviceLocator.ts         # ServiceLocator + setupDependencies()
│   ├── error/
│   │   ├── AppError.ts               # Typed error class with code
│   │   └── Result.ts                 # Result<T,E> discriminated union
│   ├── navigation/
│   │   ├── AppNavigator.tsx          # Root navigator + auth redirect
│   │   ├── RootNavigator.tsx         # Stack: Login ↔ Main
│   │   ├── types.ts                  # TypeScript param list types
│   │   └── guards/
│   │       └── AuthGuard.tsx         # Auth-check HOC
│   ├── store/
│   │   ├── store.ts                  # Redux store + typed hooks
│   │   └── rootReducer.ts            # Combined reducer
│   └── theme/
│       └── appTheme.ts               # Colors, Typography, Spacing, Shadows
│
└── features/
    ├── auth/                         # Login, logout, session persistence
    ├── posts/                        # Post list + detail, offline cache
    └── realtime/                     # Simulated WebSocket event stream
```

Each feature follows the same three-layer structure:

```
feature/
├── data/
│   ├── datasources/     # Remote (Axios) + local (AsyncStorage) implementations
│   ├── models/          # Extend domain entities; add fromJson/toJson
│   └── repositories/    # Implements domain repository; handles cache fallback
├── domain/
│   ├── entities/        # Pure TypeScript interfaces (no framework deps)
│   ├── repositories/    # Abstract contracts (interfaces)
│   └── usecases/        # Single-responsibility business operations
└── presentation/
    ├── store/           # Redux Toolkit slice (replaces BLoC event/state/bloc)
    ├── screens/         # React Native screens
    └── components/      # Extracted UI components
```

---

## Error Handling — `Result<T, E>`

Replaces `dartz Either<Failure, T>` from the Flutter kit. A discriminated union with no external dependencies:

```typescript
// src/core/error/Result.ts
export type Result<T, E = AppError> =
  | { success: true;  data: T }
  | { success: false; error: E };

export const ok  = <T>(data: T): Result<T, never>  => ({ success: true,  data });
export const err = <E extends AppError>(e: E): Result<never, E> => ({ success: false, error: e });
```

Usage in a repository:

```typescript
async login(email: string, password: string): Promise<Result<User>> {
  try {
    const user = await this.remote.login(email, password);
    return ok(user);
  } catch (error) {
    return err(new AppError('AUTH_ERROR', String(error)));
  }
}
```

Usage in a Redux thunk:

```typescript
const result = await useCase.execute(email, password);
if (result.success) return result.data;        // fulfills the thunk
return rejectWithValue(result.error.message);  // rejects the thunk
```

---

## State Management — Redux Toolkit Slices

Each feature has one slice that replaces BLoC's event/state/bloc trio.

### Auth slice

```
loginThunk     → pending  → status: 'loading'
               → fulfilled → status: 'authenticated', user: User
               → rejected  → status: 'error', error: string

logoutThunk    → fulfilled → status: 'unauthenticated', user: null

checkAuthThunk → pending   → status: 'loading'
               → fulfilled → status: 'authenticated', user: User
               → rejected  → status: 'unauthenticated'
```

### Posts slice

```
fetchPostsThunk      → idle | loading | succeeded | failed
fetchPostDetailThunk → loading | succeeded (selectedPost: Post) | failed
```

### Realtime slice

```
connectRealtimeThunk    → connecting → connected
disconnectRealtimeThunk → disconnected

eventReceived (internal) → prepend to events[], cap at 50
```

---

## Routing

Navigation lives in `src/core/navigation/`.

### Structure

```
NavigationContainer
└── RootStack (NativeStackNavigator)
    ├── Login  → LoginScreen
    └── Main   → MainNavigator (Bottom Tabs)
                 ├── PostsTab → PostsNavigator (NativeStackNavigator)
                 │              ├── PostsList  → PostsScreen
                 │              └── PostDetail → PostDetailScreen  { id: number }
                 ├── Realtime → RealtimeScreen
                 └── Profile  → ProfileScreen
```

### Auth redirect flow

`AppNavigator` boots with `checkAuthThunk()` then watches `auth.status` in a `useEffect`:

```
checkAuthThunk resolves (no cached session)
  → auth.status = 'unauthenticated'
    → useEffect fires → navigationRef.navigate('Login')

loginThunk resolves
  → auth.status = 'authenticated'
    → useEffect fires → navigationRef.navigate('Main')

logoutThunk resolves
  → auth.status = 'unauthenticated'
    → useEffect fires → navigationRef.navigate('Login')
```

This mirrors `_AuthChangeNotifier` + `refreshListenable` from GoRouter in the Flutter kit.

### TypeScript param lists

```typescript
export type RootStackParamList = {
  Login: undefined;
  Main:  undefined;
};

export type PostsStackParamList = {
  PostsList:  undefined;
  PostDetail: { id: number };
};
```

---

## Mock APIs

`setupMockAdapter()` installs `axios-mock-adapter` on the shared `apiClient`. All outgoing requests are resolved in-process — no real network calls:

| Method | Path | Delay | Returns |
|---|---|---|---|
| POST | `/auth/login` | 800 ms | User object |
| POST | `/auth/logout` | 300 ms | `{ success: true }` |
| GET | `/auth/me` | 0 ms | User object |
| GET | `/posts` | 600 ms | Array of 10 posts |
| GET | `/posts/:id` | 300 ms | Single post |

Mock user:

```json
{
  "id": "usr_001",
  "name": "Alex Johnson",
  "email": "demo@example.com",
  "token": "mock_jwt_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}
```

---

## Real-Time Module

`mockWebSocketDatasource` uses `setInterval` (3 s) + an `EventEmitter`-style `Set<callback>` to simulate WebSocket events — no actual WebSocket server required.

```typescript
class MockWebSocketDatasource {
  connect()  { /* start 3-second interval */ }
  disconnect() { /* clear interval */ }
  onEvent(cb)  { this._listeners.add(cb); }
  offEvent(cb) { this._listeners.delete(cb); }
}
```

Event types rotate: `notification` → `price_update` → `chat_message`.

Each event is also forwarded to `react-native-network-logger` via `addNetworkRequest()` so it appears in the dev inspector overlay.

`realtimeSlice` connects the datasource to Redux:
- `connectRealtimeThunk` calls `subscribeToEventsUseCase.execute(cb)` where `cb` dispatches `eventReceived(event)`.
- `eventReceived` prepends the event and slices the array to `maxRealtimeEvents` (50).
- `disconnectRealtimeThunk` calls the unsubscribe handle and cleans up the interval.

---

## Caching

Repository implementations follow **remote-first, cache-fallback**:

```
1. Call remote datasource
   ✓ Success  → write to AsyncStorage → return Result.ok(data)
   ✗ Failure  → read from AsyncStorage
                 ✓ cache hit  → return Result.ok(cachedData)
                 ✗ cache miss → return Result.err(AppError)
```

Cache keys are centralised in `AppConstants.cacheKeys`.

---

## Dependency Injection

`serviceLocator.ts` provides a simple string-keyed singleton registry — a TypeScript replacement for GetIt:

```typescript
sl.register('LoginUseCase', new LoginUseCase(sl.get('AuthRepository')));
const uc = sl.get<LoginUseCase>('LoginUseCase');
```

Call order in `setupDependencies()`:
1. Infrastructure (datasources)
2. Repositories
3. Use cases

Redux thunks call `sl.get<UseCase>(key)` at dispatch time — dependencies are always resolved after `setupDependencies()` runs in `App.tsx`.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start Expo Go / dev server
npm start

# Run on specific platform
npm run ios
npm run android
```

**Demo credentials** — hardcoded in `AppConstants.mockCredentials` and pre-filled in the login form:

```
Email:    demo@example.com
Password: password123
```

> The mock adapter accepts any credentials and always returns the same user object.

---

## Adding a New Feature

1. Create `src/features/<name>/` with `data/`, `domain/`, `presentation/` sub-folders.
2. Define your entity in `domain/entities/` (plain TypeScript interface).
3. Define the repository contract in `domain/repositories/` (interface).
4. Implement use cases in `domain/usecases/` (one class per operation).
5. Add a mock remote datasource in `data/datasources/`.
6. Add a local (cache) datasource in `data/datasources/` (AsyncStorage).
7. Implement the repository in `data/repositories/` (remote-first + cache fallback).
8. Create a Redux Toolkit slice in `presentation/store/` with async thunks.
9. Build screens in `presentation/screens/` using `useAppSelector` + `useAppDispatch`.
10. Register all new classes in `serviceLocator.ts → setupDependencies()`.
11. Add a screen to the navigator and update `types.ts` param lists.

---

## Key Design Decisions

### `Result<T, E>` instead of exceptions
Repositories never throw — they return `Result`. This forces callers (thunks) to handle both paths explicitly rather than relying on try/catch.

### Serialisable Redux state
Redux Toolkit's serializability middleware is kept enabled. `RealtimeEvent.timestamp` is stored as an ISO string (not a `Date`), and the unsubscribe handle from `subscribeToEventsUseCase` is stored in a module-level variable outside Redux state.

### Singleton datasources
`mockWebSocketDatasource` is a module-level singleton so a single interval runs regardless of how many times a component re-mounts or the store dispatches `connectRealtimeThunk`.

### ServiceLocator vs. React Context
The service locator pattern was chosen to mirror the Flutter kit's GetIt exactly. For a context-only approach, each use case could be injected via React Context or passed directly to thunks.

// ─── Auth feature ─────────────────────────────────────────────────────────────
import { AuthRemoteDatasource } from '../../features/auth/data/datasources/authRemoteDatasource';
import { AuthLocalDatasource } from '../../features/auth/data/datasources/authLocalDatasource';
import { AuthRepositoryImpl } from '../../features/auth/data/repositories/authRepositoryImpl';
import { LoginUseCase } from '../../features/auth/domain/usecases/loginUseCase';
import { LogoutUseCase } from '../../features/auth/domain/usecases/logoutUseCase';
import { GetCurrentUserUseCase } from '../../features/auth/domain/usecases/getCurrentUserUseCase';

// ─── Posts feature ────────────────────────────────────────────────────────────
import { PostsRemoteDatasource } from '../../features/posts/data/datasources/postsRemoteDatasource';
import { PostsLocalDatasource } from '../../features/posts/data/datasources/postsLocalDatasource';
import { PostsRepositoryImpl } from '../../features/posts/data/repositories/postsRepositoryImpl';
import { GetPostsUseCase } from '../../features/posts/domain/usecases/getPostsUseCase';
import { GetPostDetailUseCase } from '../../features/posts/domain/usecases/getPostDetailUseCase';

// ─── Realtime feature ─────────────────────────────────────────────────────────
import { RealtimeRepositoryImpl } from '../../features/realtime/data/repositories/realtimeRepositoryImpl';
import { SubscribeToEventsUseCase } from '../../features/realtime/domain/usecases/subscribeToEventsUseCase';

// ─── Service locator ──────────────────────────────────────────────────────────

/**
 * Minimal singleton service locator — replaces GetIt from the Flutter kit.
 *
 * Usage:
 *   sl.register('LoginUseCase', new LoginUseCase(repo));
 *   const uc = sl.get<LoginUseCase>('LoginUseCase');
 */
class ServiceLocator {
  private readonly _services = new Map<string, unknown>();

  register<T>(key: string, instance: T): void {
    if (this._services.has(key)) {
      // Idempotent — skip double-registration (e.g. hot-reload)
      return;
    }
    this._services.set(key, instance);
  }

  get<T>(key: string): T {
    const service = this._services.get(key);
    if (service === undefined) {
      throw new Error(
        `ServiceLocator: "${key}" is not registered. Did you call setupDependencies()?`,
      );
    }
    return service as T;
  }

  /** Remove all registrations (useful in test teardown). */
  reset(): void {
    this._services.clear();
  }
}

export const sl = new ServiceLocator();

// ─── Dependency wiring ────────────────────────────────────────────────────────

/**
 * Register all datasources, repositories, and use cases.
 * Call once from `App.tsx` before rendering.
 *
 * Ordering matters: leaf dependencies are registered first.
 */
export function setupDependencies(): void {
  // ── Infrastructure ────────────────────────────────────────────────────────
  sl.register('AuthRemoteDatasource', new AuthRemoteDatasource());
  sl.register('AuthLocalDatasource', new AuthLocalDatasource());
  sl.register('PostsRemoteDatasource', new PostsRemoteDatasource());
  sl.register('PostsLocalDatasource', new PostsLocalDatasource());

  // ── Repositories ──────────────────────────────────────────────────────────
  sl.register(
    'AuthRepository',
    new AuthRepositoryImpl(
      sl.get('AuthRemoteDatasource'),
      sl.get('AuthLocalDatasource'),
    ),
  );
  sl.register(
    'PostsRepository',
    new PostsRepositoryImpl(
      sl.get('PostsRemoteDatasource'),
      sl.get('PostsLocalDatasource'),
    ),
  );
  sl.register('RealtimeRepository', new RealtimeRepositoryImpl());

  // ── Use cases — Auth ──────────────────────────────────────────────────────
  sl.register('LoginUseCase', new LoginUseCase(sl.get('AuthRepository')));
  sl.register('LogoutUseCase', new LogoutUseCase(sl.get('AuthRepository')));
  sl.register('GetCurrentUserUseCase', new GetCurrentUserUseCase(sl.get('AuthRepository')));

  // ── Use cases — Posts ─────────────────────────────────────────────────────
  sl.register('GetPostsUseCase', new GetPostsUseCase(sl.get('PostsRepository')));
  sl.register('GetPostDetailUseCase', new GetPostDetailUseCase(sl.get('PostsRepository')));

  // ── Use cases — Realtime ──────────────────────────────────────────────────
  sl.register('SubscribeToEventsUseCase', new SubscribeToEventsUseCase(sl.get('RealtimeRepository')));
}

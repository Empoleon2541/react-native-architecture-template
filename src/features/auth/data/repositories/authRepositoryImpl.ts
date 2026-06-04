import { AppError } from '../../../../core/error/AppError';
import { err, ok, Result } from '../../../../core/error/Result';
import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { IAuthLocalDatasource } from '../datasources/authLocalDatasource';
import { IAuthRemoteDatasource } from '../datasources/authRemoteDatasource';
import { clearAuthToken, setAuthToken } from '../../../../core/api/apiClient';

/**
 * Concrete repository that:
 *  1. Attempts the remote datasource.
 *  2. On success → persists to local cache.
 *  3. On network failure → falls back to cached data.
 *
 * Implements `IAuthRepository` so the domain layer stays decoupled.
 */
export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private readonly remote: IAuthRemoteDatasource,
    private readonly local: IAuthLocalDatasource,
  ) {}

  async login(email: string, password: string): Promise<Result<User>> {
    try {
      const userModel = await this.remote.login(email, password);
      await this.local.saveUser(userModel);
      setAuthToken(userModel.token);
      return ok(userModel);
    } catch (error) {
      const appError =
        error instanceof AppError
          ? error
          : new AppError('AUTH_ERROR', String(error));
      return err(appError);
    }
  }

  async logout(): Promise<Result<void>> {
    try {
      await this.remote.logout();
      await this.local.clearUser();
      clearAuthToken();
      return ok(undefined);
    } catch (error) {
      // Even if remote logout fails we still clear local session
      await this.local.clearUser().catch(() => undefined);
      clearAuthToken();
      const appError =
        error instanceof AppError
          ? error
          : new AppError('AUTH_ERROR', String(error));
      return err(appError);
    }
  }

  async getCurrentUser(): Promise<Result<User>> {
    try {
      // Try remote first (refreshes token if needed)
      const userModel = await this.remote.getCurrentUser();
      await this.local.saveUser(userModel);
      setAuthToken(userModel.token);
      return ok(userModel);
    } catch (_remoteError) {
      // Remote failed — fall back to cache
      try {
        const cached = await this.local.getUser();
        if (cached) {
          setAuthToken(cached.token);
          return ok(cached);
        }
        return err(new AppError('AUTH_ERROR', 'No cached session found'));
      } catch (cacheError) {
        const appError =
          cacheError instanceof AppError
            ? cacheError
            : new AppError('AUTH_ERROR', String(cacheError));
        return err(appError);
      }
    }
  }
}

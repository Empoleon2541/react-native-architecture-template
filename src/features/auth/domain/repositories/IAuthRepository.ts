import { Result } from '../../../../core/error/Result';
import { User } from '../entities/User';

/**
 * Repository contract for the auth feature.
 * The domain layer depends on this interface, not the concrete implementation.
 */
export interface IAuthRepository {
  /** Authenticate with email + password; returns User on success. */
  login(email: string, password: string): Promise<Result<User>>;

  /** Invalidate the current session. */
  logout(): Promise<Result<void>>;

  /** Restore session from cache (used on app start). */
  getCurrentUser(): Promise<Result<User>>;
}

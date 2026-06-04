import { Result } from '../../../../core/error/Result';
import { User } from '../entities/User';
import { IAuthRepository } from '../repositories/IAuthRepository';

/**
 * Single-responsibility use case: log in a user.
 * Thin wrapper around the repository — all business rules live here.
 */
export class LoginUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  execute(email: string, password: string): Promise<Result<User>> {
    return this.repository.login(email, password);
  }
}

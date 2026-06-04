import { Result } from '../../../../core/error/Result';
import { User } from '../entities/User';
import { IAuthRepository } from '../repositories/IAuthRepository';

/** Single-responsibility use case: restore session from cache or remote. */
export class GetCurrentUserUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  execute(): Promise<Result<User>> {
    return this.repository.getCurrentUser();
  }
}

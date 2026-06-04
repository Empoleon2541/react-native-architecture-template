import { Result } from '../../../../core/error/Result';
import { IAuthRepository } from '../repositories/IAuthRepository';

/** Single-responsibility use case: log out the current user. */
export class LogoutUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  execute(): Promise<Result<void>> {
    return this.repository.logout();
  }
}

import { Result } from '../../../../core/error/Result';
import { Post } from '../entities/Post';
import { IPostsRepository } from '../repositories/IPostsRepository';

/** Single-responsibility use case: fetch the full post list. */
export class GetPostsUseCase {
  constructor(private readonly repository: IPostsRepository) {}

  execute(): Promise<Result<Post[]>> {
    return this.repository.getPosts();
  }
}

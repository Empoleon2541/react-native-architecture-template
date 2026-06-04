import { Result } from '../../../../core/error/Result';
import { Post } from '../entities/Post';
import { IPostsRepository } from '../repositories/IPostsRepository';

/** Single-responsibility use case: fetch a single post by ID. */
export class GetPostDetailUseCase {
  constructor(private readonly repository: IPostsRepository) {}

  execute(id: number): Promise<Result<Post>> {
    return this.repository.getPostDetail(id);
  }
}

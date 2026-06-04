import { Result } from '../../../../core/error/Result';
import { Post } from '../entities/Post';

/** Repository contract for the posts feature. */
export interface IPostsRepository {
  getPosts(): Promise<Result<Post[]>>;
  getPostDetail(id: number): Promise<Result<Post>>;
}

import { AppError } from '../../../../core/error/AppError';
import { err, ok, Result } from '../../../../core/error/Result';
import { Post } from '../../domain/entities/Post';
import { IPostsRepository } from '../../domain/repositories/IPostsRepository';
import { IPostsLocalDatasource } from '../datasources/postsLocalDatasource';
import { IPostsRemoteDatasource } from '../datasources/postsRemoteDatasource';

/**
 * Remote-first, cache-fallback repository implementation.
 * - On success → write to cache, return data.
 * - On network failure → return cached data if available.
 */
export class PostsRepositoryImpl implements IPostsRepository {
  constructor(
    private readonly remote: IPostsRemoteDatasource,
    private readonly local: IPostsLocalDatasource,
  ) {}

  async getPosts(): Promise<Result<Post[]>> {
    try {
      const posts = await this.remote.getPosts();
      await this.local.savePosts(posts);
      return ok(posts);
    } catch (_remoteError) {
      try {
        const cached = await this.local.getPosts();
        if (cached && cached.length > 0) return ok(cached);
        return err(new AppError('NETWORK_ERROR', 'No posts available offline'));
      } catch (cacheError) {
        const appError =
          cacheError instanceof AppError
            ? cacheError
            : new AppError('NETWORK_ERROR', String(cacheError));
        return err(appError);
      }
    }
  }

  async getPostDetail(id: number): Promise<Result<Post>> {
    try {
      const post = await this.remote.getPostDetail(id);
      return ok(post);
    } catch (error) {
      const appError =
        error instanceof AppError ? error : new AppError('NOT_FOUND', String(error));
      return err(appError);
    }
  }
}

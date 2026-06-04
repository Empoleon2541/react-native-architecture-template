import { cacheManager } from '../../../../core/cache/cacheManager';
import { AppConstants } from '../../../../core/constants/appConstants';
import { AppError } from '../../../../core/error/AppError';
import { PostModel } from '../models/PostModel';

export interface IPostsLocalDatasource {
  savePosts(posts: PostModel[]): Promise<void>;
  getPosts(): Promise<PostModel[] | null>;
  clearPosts(): Promise<void>;
}

export class PostsLocalDatasource implements IPostsLocalDatasource {
  private readonly _key = AppConstants.cacheKeys.posts;

  async savePosts(posts: PostModel[]): Promise<void> {
    try {
      await cacheManager.set(
        this._key,
        posts.map((p) => PostModel.toJson(p)),
      );
    } catch (error) {
      throw new AppError('CACHE_ERROR', `Failed to save posts: ${String(error)}`);
    }
  }

  async getPosts(): Promise<PostModel[] | null> {
    try {
      const jsonArray = await cacheManager.get<Record<string, unknown>[]>(this._key);
      if (jsonArray === null) return null;
      return jsonArray.map((json) => PostModel.fromJson(json));
    } catch (error) {
      throw new AppError('CACHE_ERROR', `Failed to get cached posts: ${String(error)}`);
    }
  }

  async clearPosts(): Promise<void> {
    try {
      await cacheManager.remove(this._key);
    } catch (error) {
      throw new AppError('CACHE_ERROR', `Failed to clear posts cache: ${String(error)}`);
    }
  }
}

import { apiClient } from '../../../../core/api/apiClient';
import { AppError } from '../../../../core/error/AppError';
import { PostModel } from '../models/PostModel';

export interface IPostsRemoteDatasource {
  getPosts(): Promise<PostModel[]>;
  getPostDetail(id: number): Promise<PostModel>;
}

export class PostsRemoteDatasource implements IPostsRemoteDatasource {
  async getPosts(): Promise<PostModel[]> {
    try {
      const response = await apiClient.get<Record<string, unknown>[]>('/posts');
      return response.data.map((json) => PostModel.fromJson(json));
    } catch (error) {
      throw new AppError('NETWORK_ERROR', `Failed to fetch posts: ${String(error)}`);
    }
  }

  async getPostDetail(id: number): Promise<PostModel> {
    try {
      const response = await apiClient.get<Record<string, unknown>>(`/posts/${id}`);
      return PostModel.fromJson(response.data);
    } catch (error) {
      throw new AppError('NOT_FOUND', `Failed to fetch post ${id}: ${String(error)}`);
    }
  }
}

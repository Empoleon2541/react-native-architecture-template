import { Post } from '../../domain/entities/Post';

/** Data-layer model with JSON serialisation helpers. */
export interface PostModel extends Post {}

export const PostModel = {
  fromJson(json: Record<string, unknown>): PostModel {
    return {
      id: Number(json['id'] ?? 0),
      userId: Number(json['userId'] ?? 0),
      title: String(json['title'] ?? ''),
      body: String(json['body'] ?? ''),
    };
  },

  toJson(model: PostModel): Record<string, unknown> {
    return {
      id: model.id,
      userId: model.userId,
      title: model.title,
      body: model.body,
    };
  },
};

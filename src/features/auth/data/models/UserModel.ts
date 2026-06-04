import { User } from '../../domain/entities/User';

/**
 * Data-layer model that extends the domain entity.
 * Adds JSON serialisation helpers — the domain entity stays clean.
 */
export interface UserModel extends User {}

export const UserModel = {
  /**
   * Deserialise a raw API/cache object into a `UserModel`.
   * Unknown fields are ignored; missing required fields fall back to empty strings.
   */
  fromJson(json: Record<string, unknown>): UserModel {
    return {
      id: String(json['id'] ?? ''),
      name: String(json['name'] ?? ''),
      email: String(json['email'] ?? ''),
      token: String(json['token'] ?? ''),
      avatar: json['avatar'] !== undefined ? String(json['avatar']) : undefined,
    };
  },

  /**
   * Serialise a `UserModel` to a plain object suitable for JSON.stringify.
   */
  toJson(model: UserModel): Record<string, unknown> {
    const obj: Record<string, unknown> = {
      id: model.id,
      name: model.name,
      email: model.email,
      token: model.token,
    };
    if (model.avatar !== undefined) obj['avatar'] = model.avatar;
    return obj;
  },
};

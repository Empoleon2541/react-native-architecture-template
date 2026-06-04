import { cacheManager } from '../../../../core/cache/cacheManager';
import { AppConstants } from '../../../../core/constants/appConstants';
import { AppError } from '../../../../core/error/AppError';
import { UserModel } from '../models/UserModel';

/**
 * Local (AsyncStorage) datasource for the auth feature.
 * Stores the authenticated user so the session survives app restarts.
 */
export interface IAuthLocalDatasource {
  saveUser(user: UserModel): Promise<void>;
  getUser(): Promise<UserModel | null>;
  clearUser(): Promise<void>;
}

export class AuthLocalDatasource implements IAuthLocalDatasource {
  private readonly _key = AppConstants.cacheKeys.user;

  async saveUser(user: UserModel): Promise<void> {
    try {
      await cacheManager.set(this._key, UserModel.toJson(user));
    } catch (error) {
      throw new AppError('CACHE_ERROR', `Failed to save user: ${String(error)}`);
    }
  }

  async getUser(): Promise<UserModel | null> {
    try {
      const json = await cacheManager.get<Record<string, unknown>>(this._key);
      if (json === null) return null;
      return UserModel.fromJson(json);
    } catch (error) {
      throw new AppError('CACHE_ERROR', `Failed to get cached user: ${String(error)}`);
    }
  }

  async clearUser(): Promise<void> {
    try {
      await cacheManager.remove(this._key);
    } catch (error) {
      throw new AppError('CACHE_ERROR', `Failed to clear user cache: ${String(error)}`);
    }
  }
}

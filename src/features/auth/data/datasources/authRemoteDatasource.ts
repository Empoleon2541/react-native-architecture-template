import { apiClient } from '../../../../core/api/apiClient';
import { AppError } from '../../../../core/error/AppError';
import { UserModel } from '../models/UserModel';

/**
 * Remote datasource for the auth feature.
 * Uses the shared `apiClient` (intercepted by mockAdapter in dev).
 */
export interface IAuthRemoteDatasource {
  login(email: string, password: string): Promise<UserModel>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserModel>;
}

export class AuthRemoteDatasource implements IAuthRemoteDatasource {
  async login(email: string, password: string): Promise<UserModel> {
    try {
      const response = await apiClient.post<Record<string, unknown>>('/auth/login', {
        email,
        password,
      });
      return UserModel.fromJson(response.data);
    } catch (error) {
      throw new AppError('AUTH_ERROR', `Login failed: ${String(error)}`);
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      throw new AppError('AUTH_ERROR', `Logout failed: ${String(error)}`);
    }
  }

  async getCurrentUser(): Promise<UserModel> {
    try {
      const response = await apiClient.get<Record<string, unknown>>('/auth/me');
      return UserModel.fromJson(response.data);
    } catch (error) {
      throw new AppError('AUTH_ERROR', `Get current user failed: ${String(error)}`);
    }
  }
}

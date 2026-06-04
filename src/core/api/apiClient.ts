import axios, { AxiosInstance } from 'axios';

/**
 * Singleton Axios instance used throughout the app.
 * The base URL points to the mock domain; all requests are
 * intercepted by mockAdapter before they hit the network.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://mock.api.local',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

/** Attach a JWT to every subsequent request. */
export const setAuthToken = (token: string): void => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/** Remove the JWT (e.g. after logout). */
export const clearAuthToken = (): void => {
  delete apiClient.defaults.headers.common['Authorization'];
};

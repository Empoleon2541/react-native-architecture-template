export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'CACHE_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_FOUND';

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
    // Restore prototype chain (required when extending built-ins in TS)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

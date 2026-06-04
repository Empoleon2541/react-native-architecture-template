import { AppError } from './AppError';

/**
 * Discriminated union that replaces dartz Either<Failure, T>.
 *
 * - `{ success: true;  data: T }` — equivalent to Right / success path
 * - `{ success: false; error: E }` — equivalent to Left / failure path
 *
 * Usage:
 *   const result = await loginUseCase.execute(email, password);
 *   if (result.success) {
 *     console.log(result.data.name);
 *   } else {
 *     console.error(result.error.message);
 *   }
 */
export type Result<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E };

/** Wraps a successful value. */
export const ok = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
});

/** Wraps a failure value. */
export const err = <E extends AppError>(error: E): Result<never, E> => ({
  success: false,
  error,
});

/**
 * Domain entity — User.
 * Pure TypeScript, no framework dependencies.
 * Mirrors `User` from the Flutter kit.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  avatar?: string;
}

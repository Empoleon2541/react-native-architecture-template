/**
 * Domain entity — Post.
 * Pure TypeScript, no framework dependencies.
 */
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

import { RealtimeEvent } from '../entities/RealtimeEvent';

/**
 * Repository contract for the realtime feature.
 * Uses a callback-based API to avoid non-serialisable objects (functions)
 * in Redux state.
 */
export interface IRealtimeRepository {
  connect(): void;
  disconnect(): void;
  onEvent(callback: (event: RealtimeEvent) => void): void;
  offEvent(callback: (event: RealtimeEvent) => void): void;
  get isConnected(): boolean;
}

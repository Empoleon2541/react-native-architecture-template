import { RealtimeEvent } from '../entities/RealtimeEvent';
import { IRealtimeRepository } from '../repositories/IRealtimeRepository';

/**
 * Use case: connect to the realtime channel and subscribe to incoming events.
 *
 * Callers pass a callback that is invoked for each event. Call `unsubscribe()`
 * on the returned handle to clean up.
 */
export class SubscribeToEventsUseCase {
  constructor(private readonly repository: IRealtimeRepository) {}

  execute(onEvent: (event: RealtimeEvent) => void): { unsubscribe: () => void } {
    this.repository.connect();
    this.repository.onEvent(onEvent);

    return {
      unsubscribe: () => {
        this.repository.offEvent(onEvent);
        this.repository.disconnect();
      },
    };
  }

  get isConnected(): boolean {
    return this.repository.isConnected;
  }
}

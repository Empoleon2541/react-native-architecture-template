import { RealtimeEvent } from '../../domain/entities/RealtimeEvent';
import { IRealtimeRepository } from '../../domain/repositories/IRealtimeRepository';
import { mockWebSocketDatasource } from '../datasources/mockWebSocketDatasource';

/**
 * Wraps the mock WebSocket datasource behind the domain repository contract.
 */
export class RealtimeRepositoryImpl implements IRealtimeRepository {
  connect(): void {
    mockWebSocketDatasource.connect();
  }

  disconnect(): void {
    mockWebSocketDatasource.disconnect();
  }

  onEvent(callback: (event: RealtimeEvent) => void): void {
    mockWebSocketDatasource.onEvent(callback);
  }

  offEvent(callback: (event: RealtimeEvent) => void): void {
    mockWebSocketDatasource.offEvent(callback);
  }

  get isConnected(): boolean {
    return mockWebSocketDatasource.isConnected;
  }
}

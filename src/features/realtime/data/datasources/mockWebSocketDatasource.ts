import { startNetworkLogging } from 'react-native-network-logger';
import { AppConstants } from '../../../../core/constants/appConstants';
import { RealtimeEventModel } from '../models/RealtimeEventModel';

// ─── Payload banks (mirrors Flutter kit) ─────────────────────────────────────

const EVENT_TYPES: RealtimeEventModel['type'][] = [
  'notification',
  'price_update',
  'chat_message',
];

const PAYLOADS: Record<RealtimeEventModel['type'], string[]> = {
  notification: [
    'New follower: @john_dev',
    'Your post was liked by 12 people',
    'System update available v2.1.0',
    'Reminder: Meeting in 15 minutes',
    'New comment on your post',
  ],
  price_update: [
    'BTC: $67,432 (+2.3%)',
    'ETH: $3,201 (-0.8%)',
    'AAPL: $189.50 (+1.2%)',
    'TSLA: $248.30 (+3.7%)',
    'SOL: $142.80 (+5.1%)',
  ],
  chat_message: [
    'Hello there! How is the project going?',
    'Meeting at 3pm in the main conference room',
    'Can you review my PR when you have a moment?',
    'Great work on the architecture demo!',
    'The build is passing on CI now.',
  ],
};

// ─── Datasource ───────────────────────────────────────────────────────────────

/**
 * Simulates a WebSocket connection using `setInterval`.
 * Emits one event every `AppConstants.realtimeEventIntervalMs` (3 s) and
 * reports each event to react-native-network-logger so it appears in the
 * inspector overlay.
 *
 * This is a singleton — the same instance is shared across the app.
 */
class MockWebSocketDatasource {
  private _interval: ReturnType<typeof setInterval> | null = null;
  private _listeners: Set<(event: RealtimeEventModel) => void> = new Set();
  private _counter = 0;
  isConnected = false;

  constructor() {
    if (AppConstants.enableNetworkInspector) {
      startNetworkLogging({ maxRequests: 100 });
    }
  }

  connect(): void {
    if (this.isConnected) return;

    this.isConnected = true;
    this._counter = 0;

    // Emit the first event after a short delay so the UI has time to render
    setTimeout(() => {
      if (this.isConnected) this._emit();
    }, 500);

    // Then emit on the configured interval
    this._interval = setInterval(() => {
      if (this.isConnected) this._emit();
    }, AppConstants.realtimeEventIntervalMs);
  }

  disconnect(): void {
    this.isConnected = false;
    if (this._interval !== null) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  onEvent(cb: (event: RealtimeEventModel) => void): void {
    this._listeners.add(cb);
  }

  offEvent(cb: (event: RealtimeEventModel) => void): void {
    this._listeners.delete(cb);
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private _emit(): void {
    const type = EVENT_TYPES[this._counter % EVENT_TYPES.length];
    const payloadList = PAYLOADS[type];
    const payload = payloadList[this._counter % payloadList.length];
    const now = new Date();

    const event: RealtimeEventModel = {
      id: `evt_${String(this._counter).padStart(4, '0')}`,
      type,
      payload,
      timestamp: now.toISOString(),
    };

    // Forward to network inspector
    this._reportToInspector(event, now);

    // Notify all registered listeners
    this._listeners.forEach((cb) => cb(event));

    this._counter++;
  }

  private _reportToInspector(event: RealtimeEventModel, sentAt: Date): void {
    if (!AppConstants.enableNetworkInspector) return;

    // react-native-network-logger v1 captures XHR/fetch automatically.
    // For simulated WebSocket events we log to the console so they are
    // visible in Metro / Flipper without crashing the app.
    if (__DEV__) {
      console.debug(
        `[WS] ${sentAt.toISOString()} ${event.type} | ${event.id} | ${event.payload}`,
        RealtimeEventModel.toJson(event),
      );
    }
  }
}

/** Singleton instance used throughout the app. */
export const mockWebSocketDatasource = new MockWebSocketDatasource();

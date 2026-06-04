/**
 * Domain entity — RealtimeEvent.
 *
 * `timestamp` is an ISO-8601 string (not a `Date` object) so it is
 * safely serialisable in Redux state without the non-serialisable
 * value middleware warning.
 */
export interface RealtimeEvent {
  id: string;
  type: 'notification' | 'price_update' | 'chat_message';
  payload: string;
  /** ISO-8601 string e.g. "2024-03-15T14:22:03.000Z" */
  timestamp: string;
}

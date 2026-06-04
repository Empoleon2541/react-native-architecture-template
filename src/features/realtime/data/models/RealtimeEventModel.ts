import { RealtimeEvent } from '../../domain/entities/RealtimeEvent';

/** Data-layer model with JSON serialisation helpers. */
export interface RealtimeEventModel extends RealtimeEvent {}

export const RealtimeEventModel = {
  fromJson(json: Record<string, unknown>): RealtimeEventModel {
    const rawType = String(json['type'] ?? 'notification');
    const validTypes = ['notification', 'price_update', 'chat_message'] as const;
    const type = validTypes.includes(rawType as (typeof validTypes)[number])
      ? (rawType as RealtimeEvent['type'])
      : 'notification';

    return {
      id: String(json['id'] ?? ''),
      type,
      payload: String(json['payload'] ?? ''),
      timestamp: String(json['timestamp'] ?? new Date().toISOString()),
    };
  },

  toJson(model: RealtimeEventModel): Record<string, unknown> {
    return {
      id: model.id,
      type: model.type,
      payload: model.payload,
      timestamp: model.timestamp,
    };
  },
};

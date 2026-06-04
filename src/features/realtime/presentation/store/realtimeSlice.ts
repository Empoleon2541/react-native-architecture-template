import { createAsyncThunk, createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { RealtimeEvent } from '../../domain/entities/RealtimeEvent';
import { sl } from '../../../../core/di/serviceLocator';
import { SubscribeToEventsUseCase } from '../../domain/usecases/subscribeToEventsUseCase';
import { AppConstants } from '../../../../core/constants/appConstants';

// Use the built-in Dispatch type to avoid a circular dependency with store.ts
type AppDispatch = Dispatch;

// ─── State ────────────────────────────────────────────────────────────────────

interface RealtimeState {
  status: 'disconnected' | 'connecting' | 'connected';
  events: RealtimeEvent[]; // newest first, capped at AppConstants.maxRealtimeEvents
  error: string | null;
}

const initialState: RealtimeState = {
  status: 'disconnected',
  events: [],
  error: null,
};

// ─── Module-level unsubscribe handle ─────────────────────────────────────────

// Stored outside Redux (functions are not serialisable) so we can clean up
// when disconnect is called.
let _unsubscribeHandle: (() => void) | null = null;

// ─── Async thunks ─────────────────────────────────────────────────────────────

/**
 * Connect to the realtime channel.
 * Sets up the subscription and wires incoming events back to the store
 * via `dispatch(eventReceived(...))`.
 */
export const connectRealtimeThunk = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
  'realtime/connect',
  async (_, { dispatch }) => {
    const useCase = sl.get<SubscribeToEventsUseCase>('SubscribeToEventsUseCase');

    _unsubscribeHandle = useCase.execute((event) => {
      dispatch(eventReceived(event));
    }).unsubscribe;
  },
);

/** Disconnect from the realtime channel and clean up the subscription. */
export const disconnectRealtimeThunk = createAsyncThunk(
  'realtime/disconnect',
  async () => {
    if (_unsubscribeHandle) {
      _unsubscribeHandle();
      _unsubscribeHandle = null;
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const realtimeSlice = createSlice({
  name: 'realtime',
  initialState,
  reducers: {
    /**
     * Prepend the new event to the list and cap at `maxRealtimeEvents`.
     * Only called from within `connectRealtimeThunk` via dispatch.
     */
    eventReceived(state, action: PayloadAction<RealtimeEvent>) {
      state.events = [action.payload, ...state.events].slice(
        0,
        AppConstants.maxRealtimeEvents,
      );
    },

    setRealtimeError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'disconnected';
    },

    clearRealtimeEvents(state) {
      state.events = [];
    },
  },
  extraReducers: (builder) => {
    // ── connect ────────────────────────────────────────────────────────────
    builder
      .addCase(connectRealtimeThunk.pending, (state) => {
        state.status = 'connecting';
        state.error = null;
      })
      .addCase(connectRealtimeThunk.fulfilled, (state) => {
        state.status = 'connected';
      })
      .addCase(connectRealtimeThunk.rejected, (state, action) => {
        state.status = 'disconnected';
        state.error = action.error.message ?? 'Connection failed';
      });

    // ── disconnect ─────────────────────────────────────────────────────────
    builder
      .addCase(disconnectRealtimeThunk.fulfilled, (state) => {
        state.status = 'disconnected';
      });
  },
});

export const { eventReceived, setRealtimeError, clearRealtimeEvents } = realtimeSlice.actions;
export default realtimeSlice.reducer;

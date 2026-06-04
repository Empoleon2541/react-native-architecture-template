import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Functions (e.g. callbacks stored outside Redux) can show false-positive
      // warnings; we keep the check enabled to catch accidental violations.
      serializableCheck: {
        // Allow `Date` objects only at these specific paths if needed
        ignoredActions: [],
        ignoredPaths: [],
      },
    }),
  devTools: __DEV__,
});

export type AppDispatch = typeof store.dispatch;

// Typed hooks — import from here instead of react-redux directly
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState } from './rootReducer';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

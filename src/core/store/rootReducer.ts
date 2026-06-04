import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/presentation/store/authSlice';
import postsReducer from '../../features/posts/presentation/store/postsSlice';
import realtimeReducer from '../../features/realtime/presentation/store/realtimeSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  realtime: realtimeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

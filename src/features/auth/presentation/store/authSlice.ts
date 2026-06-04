import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../domain/entities/User';
import { sl } from '../../../../core/di/serviceLocator';
import { LoginUseCase } from '../../domain/usecases/loginUseCase';
import { LogoutUseCase } from '../../domain/usecases/logoutUseCase';
import { GetCurrentUserUseCase } from '../../domain/usecases/getCurrentUserUseCase';

// ─── State ───────────────────────────────────────────────────────────────────

type AuthStatus = 'initial' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

interface AuthState {
  status: AuthStatus;
  user: User | null;
  error: string | null;
}

const initialState: AuthState = {
  status: 'initial',
  user: null,
  error: null,
};

// ─── Async thunks ─────────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const useCase = sl.get<LoginUseCase>('LoginUseCase');
    const result = await useCase.execute(email, password);
    if (result.success) return result.data;
    return rejectWithValue(result.error.message);
  },
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    const useCase = sl.get<LogoutUseCase>('LogoutUseCase');
    const result = await useCase.execute();
    if (result.success) return;
    return rejectWithValue(result.error.message);
  },
);

export const checkAuthThunk = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const useCase = sl.get<GetCurrentUserUseCase>('GetCurrentUserUseCase');
    const result = await useCase.execute();
    if (result.success) return result.data;
    return rejectWithValue(result.error.message);
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Manually clear auth error (e.g. when user starts typing again). */
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── login ──────────────────────────────────────────────────────────────
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'authenticated';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'error';
        state.error = (action.payload as string) ?? 'Login failed';
      });

    // ── logout ─────────────────────────────────────────────────────────────
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state) => {
        // Even on error we treat the user as logged out locally
        state.status = 'unauthenticated';
        state.user = null;
        state.error = null;
      });

    // ── checkAuth ──────────────────────────────────────────────────────────
    builder
      .addCase(checkAuthThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'authenticated';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkAuthThunk.rejected, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

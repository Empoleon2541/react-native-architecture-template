import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../domain/entities/Post';
import { sl } from '../../../../core/di/serviceLocator';
import { GetPostsUseCase } from '../../domain/usecases/getPostsUseCase';
import { GetPostDetailUseCase } from '../../domain/usecases/getPostDetailUseCase';

// ─── State ────────────────────────────────────────────────────────────────────

interface PostsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  posts: Post[];
  selectedPost: Post | null;
  error: string | null;
}

const initialState: PostsState = {
  status: 'idle',
  posts: [],
  selectedPost: null,
  error: null,
};

// ─── Async thunks ─────────────────────────────────────────────────────────────

export const fetchPostsThunk = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    const useCase = sl.get<GetPostsUseCase>('GetPostsUseCase');
    const result = await useCase.execute();
    if (result.success) return result.data;
    return rejectWithValue(result.error.message);
  },
);

export const fetchPostDetailThunk = createAsyncThunk(
  'posts/fetchPostDetail',
  async (id: number, { rejectWithValue }) => {
    const useCase = sl.get<GetPostDetailUseCase>('GetPostDetailUseCase');
    const result = await useCase.execute(id);
    if (result.success) return result.data;
    return rejectWithValue(result.error.message);
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearSelectedPost(state) {
      state.selectedPost = null;
    },
    clearPostsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchPosts ─────────────────────────────────────────────────────────
    builder
      .addCase(fetchPostsThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPostsThunk.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = 'succeeded';
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchPostsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load posts';
      });

    // ── fetchPostDetail ────────────────────────────────────────────────────
    builder
      .addCase(fetchPostDetailThunk.pending, (state) => {
        state.status = 'loading';
        state.selectedPost = null;
        state.error = null;
      })
      .addCase(fetchPostDetailThunk.fulfilled, (state, action: PayloadAction<Post>) => {
        state.status = 'succeeded';
        state.selectedPost = action.payload;
        state.error = null;
      })
      .addCase(fetchPostDetailThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load post';
      });
  },
});

export const { clearSelectedPost, clearPostsError } = postsSlice.actions;
export default postsSlice.reducer;

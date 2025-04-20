import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCommitMetadata = createAsyncThunk<
  any, // Return type
  { commitId: string; signal?: AbortSignal } // Argument type
>(
  'commitMetadata/fetchCommitMetadata',
  async ({ commitId }) => {
    const res = await fetch(`http://localhost:4300/api/metadata/commit-metadata/${commitId}`);
    if (!res.ok) {
      throw new Error(`Error fetching commit metadata: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data as any;
  }
);

interface CommitMetadataState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommitMetadataState = {
  data: null,
  loading: false,
  error: null
};

const commitMetadataSlice = createSlice({
  name: 'commitMetadata',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCommitMetadata.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommitMetadata.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.metaData;
      })
      .addCase(fetchCommitMetadata.rejected, (state, action) => {
        state.loading = false;
        if (action.error.name === 'AbortError') {
          state.error = 'Request was cancelled';
        } else {
          state.error = action.error.message || 'Failed to fetch commit metadata';
        }
      });
  }
});

export default commitMetadataSlice.reducer;
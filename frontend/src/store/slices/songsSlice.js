import { createSlice } from '@reduxjs/toolkit';

const songsSlice = createSlice({
  name: 'songs',
  initialState: {
    list: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    totalPages: 1
  },
  reducers: {
    fetchSongsRequest: (state, action) => {
      state.loading = true;
    },
    fetchSongsSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
    },
    fetchSongsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addSongRequest: (state) => { state.loading = true; },
    updateSongRequest: (state) => { state.loading = true; },
    deleteSongRequest: (state) => { state.loading = true; },
  }
});

export const { 
  fetchSongsRequest, 
  fetchSongsSuccess, 
  fetchSongsFailure,
  addSongRequest,
  updateSongRequest,
  deleteSongRequest
} = songsSlice.actions;

export default songsSlice.reducer;
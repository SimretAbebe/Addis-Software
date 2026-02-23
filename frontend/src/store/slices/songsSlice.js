import { createSlice } from '@reduxjs/toolkit';

const songsSlice = createSlice({
  name: 'songs',
  initialState: {
    list: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    totalPages: 1,
    currentSong: null,
    isPlaying: false
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
    
    // Playback Reducers
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    playNext: (state) => {
      if (!state.currentSong || state.list.length === 0) return;
      const currentIndex = state.list.findIndex(s => s.id === state.currentSong.id);
      const nextIndex = (currentIndex + 1) % state.list.length;
      state.currentSong = state.list[nextIndex];
    },
    playPrevious: (state) => {
      if (!state.currentSong || state.list.length === 0) return;
      const currentIndex = state.list.findIndex(s => s.id === state.currentSong.id);
      const prevIndex = (currentIndex - 1 + state.list.length) % state.list.length;
      state.currentSong = state.list[prevIndex];
    }
  }
});

export const { 
  fetchSongsRequest, 
  fetchSongsSuccess, 
  fetchSongsFailure,
  addSongRequest,
  updateSongRequest,
  deleteSongRequest,
  setCurrentSong,
  togglePlay,
  playNext,
  playPrevious
} = songsSlice.actions;

export default songsSlice.reducer;
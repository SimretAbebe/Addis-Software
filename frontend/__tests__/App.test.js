import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import songsReducer from '../src/store/slices/songsSlice';
import App from '../src/App';

// Helper: create a fresh store with optional preloaded state
const makeStore = (preloadedState = {}) =>
  configureStore({
    reducer: { songs: songsReducer },
    preloadedState,
  });

const renderApp = (preloadedState = {}) =>
  render(
    <Provider store={makeStore(preloadedState)}>
      <App />
    </Provider>
  );

describe('App component', () => {
  it('renders the sidebar', () => {
    renderApp();
    expect(screen.getByText('Addis Music')).toBeInTheDocument();
  });

  it('shows Songs page by default', () => {
    renderApp();
    // 'Songs' appears in both the sidebar nav item and the page header
    const songElements = screen.getAllByText('Songs');
    expect(songElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByPlaceholderText('Search by title or artist...')).toBeInTheDocument();
  });

  it('shows the Add New Song form on the Songs page', () => {
    renderApp();
    expect(screen.getByText('Add New Song')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Artist')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Album')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Year')).toBeInTheDocument();
  });

  it('navigates to Home page when Home nav item is clicked', () => {
    renderApp();
    fireEvent.click(screen.getByText('Home'));
    expect(screen.getByText('Welcome to Addis Music')).toBeInTheDocument();
  });

  it('navigates to Statistics page when Statistics nav item is clicked', () => {
    renderApp();
    fireEvent.click(screen.getByText('Statistics'));
    expect(screen.getByText('Artists')).toBeInTheDocument();
    expect(screen.getByText('Albums')).toBeInTheDocument();
  });

  it('shows song list when songs are in the store', () => {
    const preloadedState = {
      songs: {
        list: [
          { id: 1, title: 'Ethio Jazz', artist: 'Mulatu Astatke', album: 'Ethio-Jazz', year: 1969 },
          { id: 2, title: 'Tizita', artist: 'Mahmoud Ahmed', album: 'Soul of Addis', year: 1975 },
        ],
        loading: false,
        error: null,
        page: 1,
        totalPages: 1,
        total: 2,
        currentSong: null,
        isPlaying: false,
      },
    };
    renderApp(preloadedState);
    expect(screen.getByText('Ethio Jazz')).toBeInTheDocument();
    expect(screen.getByText('Tizita')).toBeInTheDocument();
  });

  it('shows loading indicator when loading is true', () => {
    const preloadedState = {
      songs: {
        list: [],
        loading: true,
        error: null,
        page: 1,
        totalPages: 1,
        total: 0,
        currentSong: null,
        isPlaying: false,
      },
    };
    renderApp(preloadedState);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    const preloadedState = {
      songs: {
        list: [],
        loading: false,
        error: 'Failed to fetch songs',
        page: 1,
        totalPages: 1,
        total: 0,
        currentSong: null,
        isPlaying: false,
      },
    };
    renderApp(preloadedState);
    expect(screen.getByText('Failed to fetch songs')).toBeInTheDocument();
  });

  it('updates the search input when typing', () => {
    renderApp();
    const searchInput = screen.getByPlaceholderText('Search by title or artist...');
    fireEvent.change(searchInput, { target: { value: 'Ethio' } });
    expect(searchInput.value).toBe('Ethio');
  });
});

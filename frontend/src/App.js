import React, { useEffect, useState, suspense, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSongsRequest,
  addSongRequest,
  deleteSongRequest,
  updateSongRequest,
  setCurrentSong,
  togglePlay,
  playNext,
  playPrevious
} from './store/slices/songsSlice';
import { ThemeProvider, Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from './styles/theme';
import Sidebar from './components/Sidebar';

const SongsView = lazy(() => import('./components/SongsView'));
const StatsView = lazy(() => import('./components/StatsView'));

const GlobalStyles = () => (
  <Global
    styles={css`
      body {
        margin: 0;
        padding: 0;
        background-color: ${theme.colors.background};
        color: ${theme.colors.text};
        font-family: 'Inter', sans-serif;
      }
    `}
  />
);


const AppLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Container = styled.div`
  flex: 1;
  margin-left: 220px;
  padding: ${theme.spacing.large};
  padding-bottom: 120px;
  max-width: 900px;
`;


const Header = styled.h1`
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.large};
`;

const Button = styled.button`
  padding: 12px;
  background-color: ${props => props.danger ? theme.colors.error : theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius};
  font-weight: bold;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;


const PlayerBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background-color: #181818;
  border-top: 1px solid #282828;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.large};
  z-index: 1000;
`;

const SongInfoBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
`;

const PlaybackControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 40%;
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Progress = styled.div`
  width: 100%;
  height: 4px;
  background: #4f4f4f;
  border-radius: 2px;
  position: relative;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: ${theme.colors.primary};
  width: 30%;
  border-radius: 2px;
`;

const App = () => {
  const dispatch = useDispatch();
  const { list, loading, error, page, totalPages, currentSong, isPlaying } =
    useSelector((state) => state.songs);

  const [formData, setFormData] = useState({ title: '', artist: '', album: '', year: '' });
  const [editingId, setEditingId]   = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePage, setActivePage] = useState('songs');


  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchSongsRequest({ page: 1, search: searchTerm }));
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, searchTerm]);

  const handlePageChange = (newPage) => {
    dispatch(fetchSongsRequest({ page: newPage, search: searchTerm }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateSongRequest({ id: editingId, data: formData }));
      setEditingId(null);
    } else {
      dispatch(addSongRequest(formData));
    }
    setFormData({ title: '', artist: '', album: '', year: '' });
  };

  const handleEdit = (song) => {
    setFormData({ title: song.title, artist: song.artist, album: song.album, year: song.year });
    setEditingId(song.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this song?')) dispatch(deleteSongRequest(id));
  };

  const handlePlaySong = (song) => {
    if (currentSong && currentSong.id === song.id) {
      dispatch(togglePlay());
    } else {
      dispatch(setCurrentSong(song));
    }
  };

  const pageTitle = activePage === 'stats' ? 'Statistics' : activePage === 'home' ? 'Welcome' : 'Songs';

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppLayout>
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <Container>
          <Header>{pageTitle}</Header>
          <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading component...</p>}>
            {activePage === 'home' && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <h2 style={{ color: theme.colors.primary }}>Welcome to Addis Music</h2>
                <p style={{ color: theme.colors.textSecondary }}>Your personal Ethiopian music library.</p>
                <Button onClick={() => setActivePage('songs')}>Browse Songs</Button>
              </div>
            )}
            {activePage === 'stats' && <StatsView list={list} />}
            {activePage === 'songs' && (
              <SongsView
                formData={formData}
                setFormData={setFormData}
                editingId={editingId}
                setEditingId={setEditingId}
                handleSubmit={handleSubmit}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                loading={loading}
                error={error}
                list={list}
                currentSong={currentSong}
                isPlaying={isPlaying}
                handlePlaySong={handlePlaySong}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                page={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            )}
          </Suspense>
        </Container>
      </AppLayout>

      {currentSong && (
        <PlayerBar>
          <SongInfoBar>
            <strong style={{ color: theme.colors.primary }}>{currentSong.title}</strong>
            <small style={{ color: theme.colors.textSecondary }}>{currentSong.artist}</small>
          </SongInfoBar>
          <PlaybackControls>
            <ControlButtons>
              <Button onClick={() => dispatch(playPrevious())} style={{ padding: '8px 15px' }}>Prev</Button>
              <Button onClick={() => dispatch(togglePlay())} style={{ padding: '8px 20px', fontSize: '18px' }}>
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={() => dispatch(playNext())} style={{ padding: '8px 15px' }}>Next</Button>
            </ControlButtons>
            <Progress><ProgressBar /></Progress>
          </PlaybackControls>
          <div style={{ width: '30%', textAlign: 'right', color: theme.colors.textSecondary }}>
            {currentSong.album} ({currentSong.year})
          </div>
        </PlayerBar>
      )}
    </ThemeProvider>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
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

// ── Layout ──────────────────────────────────────
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

// ── Typography ───────────────────────────────────
const Header = styled.h1`
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.large};
`;

// ── Form ─────────────────────────────────────────
const Form = styled.form`
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.medium};
  border-radius: ${theme.borderRadius};
  margin-bottom: ${theme.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.small};
`;

const Input = styled.input`
  padding: 10px;
  background: #282828;
  border: 1px solid #333;
  color: white;
  border-radius: 4px;
`;

// ── Buttons ───────────────────────────────────────
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

// ── Song List ─────────────────────────────────────
const SongCard = styled.li`
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.medium};
  margin-bottom: ${theme.spacing.small};
  border-radius: ${theme.borderRadius};
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover { background-color: #282828; }
`;

// ── Pagination ────────────────────────────────────
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing.medium};
  margin-top: ${theme.spacing.large};
`;

const PageInfo = styled.span`
  color: ${theme.colors.textSecondary};
  font-weight: bold;
`;

// ── Search ────────────────────────────────────────
const SearchBar = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: ${theme.spacing.medium};
  background-color: ${theme.colors.surface};
  border: 1px solid #333;
  color: white;
  border-radius: ${theme.borderRadius};
  box-sizing: border-box;
`;

// ── Player ────────────────────────────────────────
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

// ── Statistics ────────────────────────────────────
const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-top: 8px;
`;

const StatCard = styled.div`
  background: ${theme.colors.surface};
  padding: 24px;
  border-radius: ${theme.borderRadius};
  text-align: center;
`;

// ════════════════════════════════════════════════
//  App Component
// ════════════════════════════════════════════════
const App = () => {
  const dispatch = useDispatch();
  const { list, loading, error, page, totalPages, currentSong, isPlaying } =
    useSelector((state) => state.songs);

  const [formData, setFormData] = useState({ title: '', artist: '', album: '', year: '' });
  const [editingId, setEditingId]   = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePage, setActivePage] = useState('songs');

  // Debounced search / page fetch
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

  // ── Page content ─────────────────────────────
  const renderContent = () => {
    if (activePage === 'home') {
      return (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h2 style={{ color: theme.colors.primary }}>Welcome to Addis Music</h2>
          <p style={{ color: theme.colors.textSecondary }}>Your personal Ethiopian music library.</p>
          <Button onClick={() => setActivePage('songs')}>Browse Songs</Button>
        </div>
      );
    }

    if (activePage === 'stats') {
      return (
        <StatGrid>
          <StatCard>
            <h2 style={{ color: theme.colors.primary, margin: 0 }}>{list.length}</h2>
            <p style={{ color: theme.colors.textSecondary, margin: '8px 0 0' }}>Songs (this page)</p>
          </StatCard>
          <StatCard>
            <h2 style={{ color: theme.colors.primary, margin: 0 }}>
              {new Set(list.map(s => s.artist)).size}
            </h2>
            <p style={{ color: theme.colors.textSecondary, margin: '8px 0 0' }}>Artists</p>
          </StatCard>
          <StatCard>
            <h2 style={{ color: theme.colors.primary, margin: 0 }}>
              {new Set(list.map(s => s.album)).size}
            </h2>
            <p style={{ color: theme.colors.textSecondary, margin: '8px 0 0' }}>Albums</p>
          </StatCard>
        </StatGrid>
      );
    }

    // Songs page (default)
    return (
      <>
        <Form onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Song' : 'Add New Song'}</h3>
          <Input placeholder="Title"  value={formData.title}  onChange={e => setFormData({...formData, title:  e.target.value})} required />
          <Input placeholder="Artist" value={formData.artist} onChange={e => setFormData({...formData, artist: e.target.value})} required />
          <Input placeholder="Album"  value={formData.album}  onChange={e => setFormData({...formData, album:  e.target.value})} required />
          <Input placeholder="Year" type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
          <Button type="submit">{editingId ? 'Update Song' : 'Add Song'}</Button>
          {editingId && (
            <Button type="button" style={{ background: '#444', marginTop: '5px' }}
              onClick={() => { setEditingId(null); setFormData({ title: '', artist: '', album: '', year: '' }); }}>
              Cancel Edit
            </Button>
          )}
        </Form>

        <SearchBar
          placeholder="Search by title or artist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
        {error   && <p style={{ color: theme.colors.error, textAlign: 'center' }}>{error}</p>}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {list.map((song) => (
            <SongCard key={song.id}>
              <div>
                <strong>{song.title}</strong><br />
                <small style={{ color: theme.colors.textSecondary }}>
                  {song.artist} &bull; {song.album} ({song.year})
                </small>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <Button
                  onClick={() => handlePlaySong(song)}
                  style={{ background: currentSong?.id === song.id && isPlaying ? '#158a3e' : undefined }}>
                  {currentSong?.id === song.id && isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button onClick={() => handleEdit(song)}>Edit</Button>
                <Button danger onClick={() => handleDelete(song.id)}>Delete</Button>
              </div>
            </SongCard>
          ))}
        </ul>

        {list.length > 0 && (
          <Pagination>
            <Button disabled={page === 1} onClick={() => handlePageChange(page - 1)} style={{ width: '100px' }}>
              Previous
            </Button>
            <PageInfo>Page {page} of {totalPages}</PageInfo>
            <Button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)} style={{ width: '100px' }}>
              Next
            </Button>
          </Pagination>
        )}
      </>
    );
  };

  const pageTitle = activePage === 'stats' ? 'Statistics' : activePage === 'home' ? 'Welcome' : 'Songs';

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppLayout>
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <Container>
          <Header>{pageTitle}</Header>
          {renderContent()}
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

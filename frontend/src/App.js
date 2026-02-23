import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongsRequest, addSongRequest, deleteSongRequest, updateSongRequest, setCurrentSong, togglePlay, playNext, playPrevious } from './store/slices/songsSlice';
import { ThemeProvider, Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from './styles/theme';

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

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing.large};
  padding-bottom: 120px;
`;

const Header = styled.h1`
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.large};
`;

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

const SongInfo = styled.div`
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
  width: 30%; /* Simulated progress */
  border-radius: 2px;
`;

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

const App = () => {
  const dispatch = useDispatch();
  const { list, loading, error, page, totalPages, currentSong, isPlaying } = useSelector((state) => state.songs);
  const [formData, setFormData] = useState({ title: '', artist: '', album: '', year: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePlaySong = (song) => {
    if (currentSong && currentSong.id === song.id) {
      dispatch(togglePlay());
    } else {
      dispatch(setCurrentSong(song));
    }
  };

  useEffect(() => {
    // Initial fetch for page 1 with search
    const timer = setTimeout(() => {
      dispatch(fetchSongsRequest({ page: 1, search: searchTerm }));
    }, 300); // 300ms debounce
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
    setFormData({
      title: song.title,
      artist: song.artist,
      album: song.album,
      year: song.year
    });
    setEditingId(song.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this song?')) {
      dispatch(deleteSongRequest(id));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Container>
        <Header>Addis Music App</Header>

        <Form onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Song' : 'Add New Song'}</h3>
          <Input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <Input placeholder="Artist" value={formData.artist} onChange={e => setFormData({...formData, artist: e.target.value})} required />
          <Input placeholder="Album" value={formData.album} onChange={e => setFormData({...formData, album: e.target.value})} required />
          <Input placeholder="Year" type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
          <Button type="submit">{editingId ? 'Update Song' : 'Add Song'}</Button>
          {editingId && (
            <Button 
              type="button" 
              style={{ background: '#444', marginTop: '5px' }} 
              onClick={() => {
                setEditingId(null);
                setFormData({ title: '', artist: '', album: '', year: '' });
              }}
            >
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
        {error && <p style={{ color: theme.colors.error, textAlign: 'center' }}>{error}</p>}
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {list.map((song) => (
            <SongCard key={song.id}>
              <div>
                <strong>{song.title}</strong><br/>
                <small style={{ color: theme.colors.textSecondary }}>{song.artist} • {song.album} ({song.year})</small>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <Button onClick={() => handlePlaySong(song)} style={{ background: currentSong?.id === song.id && isPlaying ? '#158a3e' : undefined }}>
                  {currentSong?.id === song.id && isPlaying ? '⏸ Pause' : '▶ Play'}
                </Button>
                <Button onClick={() => handleEdit(song)}>Edit</Button>
                <Button danger onClick={() => handleDelete(song.id)}>Delete</Button>
              </div>
            </SongCard>
          ))}
        </ul>

        {list.length > 0 && (
          <Pagination>
            <Button 
              disabled={page === 1} 
              onClick={() => handlePageChange(page - 1)}
              style={{ width: '100px' }}
            >
              Previous
            </Button>
            <PageInfo>Page {page} of {totalPages}</PageInfo>
            <Button 
              disabled={page === totalPages} 
              onClick={() => handlePageChange(page + 1)}
              style={{ width: '100px' }}
            >
              Next
            </Button>
          </Pagination>
        )}
      </Container>

      {currentSong && (
        <PlayerBar>
          <SongInfo>
            <strong style={{ color: theme.colors.primary }}>{currentSong.title}</strong>
            <small style={{ color: theme.colors.textSecondary }}>{currentSong.artist}</small>
          </SongInfo>
          <PlaybackControls>
            <ControlButtons>
              <Button onClick={() => dispatch(playPrevious())} style={{ padding: '8px 15px' }}>⏮</Button>
              <Button onClick={() => dispatch(togglePlay())} style={{ padding: '8px 20px', fontSize: '18px' }}>
                {isPlaying ? '⏸' : '▶'}
              </Button>
              <Button onClick={() => dispatch(playNext())} style={{ padding: '8px 15px' }}>⏭</Button>
            </ControlButtons>
            <Progress>
              <ProgressBar />
            </Progress>
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

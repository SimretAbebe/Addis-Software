import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongsRequest, addSongRequest, deleteSongRequest } from './store/slices/songsSlice';
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

const App = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.songs);
  const [formData, setFormData] = useState({ title: '', artist: '', album: '', year: '' });

  useEffect(() => {
    dispatch(fetchSongsRequest());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addSongRequest(formData));
    setFormData({ title: '', artist: '', album: '', year: '' });
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
          <h3>Add New Song</h3>
          <Input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <Input placeholder="Artist" value={formData.artist} onChange={e => setFormData({...formData, artist: e.target.value})} required />
          <Input placeholder="Album" value={formData.album} onChange={e => setFormData({...formData, album: e.target.value})} required />
          <Input placeholder="Year" type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
          <Button type="submit">Add Song</Button>
        </Form>
        
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: theme.colors.error }}>{error}</p>}
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {list.map((song) => (
            <SongCard key={song.id}>
              <div>
                <strong>{song.title}</strong><br/>
                <small style={{ color: theme.colors.textSecondary }}>{song.artist} • {song.album} ({song.year})</small>
              </div>
              <Button danger onClick={() => handleDelete(song.id)}>Delete</Button>
            </SongCard>
          ))}
        </ul>
      </Container>
    </ThemeProvider>
  );
};

export default App;

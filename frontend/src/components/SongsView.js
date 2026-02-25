import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';

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

const SongsView = ({
  formData,
  setFormData,
  editingId,
  setEditingId,
  handleSubmit,
  searchTerm,
  setSearchTerm,
  loading,
  error,
  list,
  currentSong,
  isPlaying,
  handlePlaySong,
  handleEdit,
  handleDelete,
  page,
  totalPages,
  handlePageChange
}) => {
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

export default SongsView;

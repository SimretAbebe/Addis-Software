import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongsRequest, addSongRequest } from './store/slices/songsSlice';

const App = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.songs);
  
  // Local state for the form
  const [formData, setFormData] = useState({ title: '', artist: '', album: '', year: '' });

  useEffect(() => {
    dispatch(fetchSongsRequest());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addSongRequest(formData));
    setFormData({ title: '', artist: '', album: '', year: '' }); // Clear form
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Addis Music App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>Add New Song</h3>
        <input 
          placeholder="Title" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
          required 
        /><br/>
        <input 
          placeholder="Artist" 
          value={formData.artist} 
          onChange={e => setFormData({...formData, artist: e.target.value})} 
          required 
        /><br/>
        <input 
          placeholder="Album" 
          value={formData.album} 
          onChange={e => setFormData({...formData, album: e.target.value})} 
          required 
        /><br/>
        <input 
          placeholder="Year" 
          type="number"
          value={formData.year} 
          onChange={e => setFormData({...formData, year: e.target.value})} 
          required 
        /><br/>
        <button type="submit">Add Song</button>
      </form>
      
      {loading && <p>Loading songs...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <ul>
        {list.map((song) => (
          <li key={song.id} style={{ marginBottom: '10px' }}>
            <strong>{song.title}</strong> - {song.artist} ({song.year})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

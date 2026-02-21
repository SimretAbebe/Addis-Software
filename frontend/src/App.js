import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongsRequest } from './store/slices/songsSlice';

const App = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.songs);

  useEffect(() => {
    dispatch(fetchSongsRequest());
  }, [dispatch]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🎵 Addis Music App</h1>
      
      {loading && <p>Loading songs...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <ul>
        {list.map((song) => (
          <li key={song.id} style={{ marginBottom: '10px' }}>
            <strong>{song.title}</strong> - {song.artist} ({song.year})
          </li>
        ))}
      </ul>

      {list.length === 0 && !loading && <p>No songs found. Add some!</p>}
    </div>
  );
};

export default App;

const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


let songs = [
  { id: 1, title: 'Ethio Jazz', artist: 'Mulatu Astatke', album: 'Ethio-Jazz', year: 1969 },
  { id: 2, title: 'Tizita', artist: 'Mahmoud Ahmed', album: 'Soul of Addis', year: 1975 },
  { id: 3, title: 'Musicawi Silt', artist: 'Hailu Mergia', album: 'Wede Harer Guzo', year: 1978 },
  { id: 4, title: 'Yene Felagot', artist: 'Ayalew Mesfin', album: 'Hasabe', year: 1977 },
  { id: 5, title: 'Gubelye', artist: 'Aster Aweke', album: 'Aster', year: 1989 }
];


const paginate = (array, page_size, page_number) => {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
};

app.get('/api/songs', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const paginatedSongs = paginate(songs, limit, page);
  
  res.json({
    data: paginatedSongs,
    total: songs.length,
    page,
    totalPages: Math.ceil(songs.length / limit)
  });
});


app.post('/api/songs', (req, res) => {
  const newSong = { id: Date.now(), ...req.body };
  songs.push(newSong);
  res.status(201).json(newSong);
});


app.put('/api/songs/:id', (req, res) => {
  const { id } = req.params;
  const index = songs.findIndex(s => s.id == id);
  if (index !== -1) {
    songs[index] = { ...songs[index], ...req.body };
    res.json(songs[index]);
  } else {
    res.status(404).send('Song not found');
  }
});


app.delete('/api/songs/:id', (req, res) => {
  const { id } = req.params;
  songs = songs.filter(s => s.id != id);
  res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

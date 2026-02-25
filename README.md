# Addis Music App

A professional music management application featuring a React/Emotion frontend and an Express backend with Redux-Saga state management.

## Features
- **Full CRUD**: Add, Edit, Delete, and View songs.
- **Real-time Search**: Debounced search by title or artist.
- **Pagination**: Browse through the library with 5 songs per page.
- **Music Player**: Bottom playback bar with Play/Pause and Next/Prev controls.
- **Responsive Sidebar**: Professional navigation with Home, Songs, and Statistics views.
- **Unit & Component Testing**: High coverage with Jest and React Testing Library.

## Tech Stack
- **Frontend**: React, Emotion (CSS-in-JS), Redux Toolkit, Redux-Saga.
- **Backend**: Node.js, Express.
- **Styling**: Spotify-inspired Dark Theme.

## Getting Started

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
*Runs on http://localhost:5000*

### 2. Frontend
```bash
cd frontend
npm install
npm start
```
*Runs on http://localhost:3000*

## Testing
To run the full test suite (17 tests):
```bash
cd frontend
npm test
```

## Environment Variables
Create a `.env` in the root (or provided) with:
```env
API_BASE_URL=http://localhost:5000/api
```

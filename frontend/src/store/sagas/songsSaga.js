import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { 
  fetchSongsSuccess, 
  fetchSongsFailure, 
  fetchSongsRequest,
  addSongRequest 
} from '../slices/songsSlice';

const API_URL = process.env.API_BASE_URL + '/songs';

// Worker Sagas
function* fetchSongsSaga(action) {
  try {
    const { page = 1, limit = 10 } = action.payload || {};
    const response = yield call(axios.get, `${API_URL}?page=${page}&limit=${limit}`);
    yield put(fetchSongsSuccess(response.data));
  } catch (e) {
    yield put(fetchSongsFailure(e.message));
  }
}

function* addSongSaga(action) {
  try {
    yield call(axios.post, API_URL, action.payload);
    yield put(fetchSongsRequest()); // Refresh the list after adding
  } catch (e) {
    yield put(fetchSongsFailure(e.message));
  }
}

// Watcher Saga
function* songsSaga() {
  yield takeEvery(fetchSongsRequest.type, fetchSongsSaga);
  yield takeEvery(addSongRequest.type, addSongSaga);
}

export default songsSaga;
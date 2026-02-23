import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { 
  fetchSongsSuccess, 
  fetchSongsFailure, 
  fetchSongsRequest,
  addSongRequest,
  deleteSongRequest,
  updateSongRequest 
} from '../slices/songsSlice';

const API_URL = process.env.API_BASE_URL + '/songs';

// Worker Sagas
function* fetchSongsSaga(action) {
  try {
    const { page = 1, limit = 5, search = '' } = action.payload || {};
    let url = `${API_URL}?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = yield call(axios.get, url);
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

function* deleteSongSaga(action) {
  try {
    yield call(axios.delete, `${API_URL}/${action.payload}`);
    yield put(fetchSongsRequest()); // Refresh the list
  } catch (e) {
    yield put(fetchSongsFailure(e.message));
  }
}

function* updateSongSaga(action) {
  try {
    const { id, data } = action.payload;
    yield call(axios.put, `${API_URL}/${id}`, data);
    yield put(fetchSongsRequest()); // Refresh the list
  } catch (e) {
    yield put(fetchSongsFailure(e.message));
  }
}

// Watcher Saga
function* songsSaga() {
  yield takeEvery(fetchSongsRequest.type, fetchSongsSaga);
  yield takeEvery(addSongRequest.type, addSongSaga);
  yield takeEvery(deleteSongRequest.type, deleteSongSaga);
  yield takeEvery(updateSongRequest.type, updateSongSaga);
}

export default songsSaga;
import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { fetchSongsSuccess, fetchSongsFailure, fetchSongsRequest } from '../slices/songsSlice';

const API_URL = process.env.API_BASE_URL + '/songs';


function* fetchSongsSaga(action) {
  try {
    const { page = 1, limit = 10 } = action.payload || {};
    const response = yield call(axios.get, `${API_URL}?page=${page}&limit=${limit}`);
    yield put(fetchSongsSuccess(response.data));
  } catch (e) {
    yield put(fetchSongsFailure(e.message));
  }
}


function* songsSaga() {
  yield takeEvery(fetchSongsRequest.type, fetchSongsSaga);
}

export default songsSaga;
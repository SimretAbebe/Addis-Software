import songsReducer, { 
  fetchSongsRequest, 
  fetchSongsSuccess, 
  fetchSongsFailure 
} from '../src/store/slices/songsSlice';

describe('songsSlice', () => {
  const initialState = {
    list: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    totalPages: 1
  };

  it('should handle fetchSongsRequest', () => {
    const nextState = songsReducer(initialState, fetchSongsRequest());
    expect(nextState.loading).toBe(true);
  });

  it('should handle fetchSongsSuccess', () => {
    const mockData = {
      data: [{ id: 1, title: 'Test Song' }],
      total: 1,
      page: 1,
      totalPages: 1
    };
    const nextState = songsReducer(initialState, fetchSongsSuccess(mockData));
    expect(nextState.loading).toBe(false);
    expect(nextState.list).toEqual(mockData.data);
    expect(nextState.total).toBe(1);
  });

  it('should handle fetchSongsFailure', () => {
    const errorMsg = 'Failed to fetch';
    const nextState = songsReducer(initialState, fetchSongsFailure(errorMsg));
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(errorMsg);
  });
});

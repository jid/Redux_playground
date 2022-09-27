import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { THUNK_STATUSES } from '../../common/dicts'
import axios from 'axios'

const POST_URL = 'https://jsonplaceholder.typicode.com/users'

const initialState = {
  users: [],
  status: THUNK_STATUSES.idle,
  error: ''
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(POST_URL)
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = THUNK_STATUSES.loading
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = THUNK_STATUSES.succeeded
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = THUNK_STATUSES.rejected
        state.error = action.error.message
      })
  }
})

// selectors
export const selectAllUsers = (state) => state.users.users
export const getUsersStatus = (state) => state.users.status
export const getUsersError = (state) => state.users.error

// actions
// export const { } = usersSlice.actions

// reducer
export default usersSlice.reducer
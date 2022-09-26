import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: 1, name: 'Adam' },
  { id: 2, name: 'Eva' },
  { id: 3, name: 'Jason' }
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {

  }
})

// selectors
export const selectAllUsers = (state) => state.users

// actions
// export const { } = usersSlice.actions

// reducer
export default usersSlice.reducer
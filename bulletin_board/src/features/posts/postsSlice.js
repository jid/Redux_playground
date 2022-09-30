import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from 'date-fns'
import axios from 'axios'
import { THUNK_STATUSES } from '../../common/dicts'

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
  status: THUNK_STATUSES.idle, //'idle' || 'loading' || 'succeeded' || 'failed'
  error: null,
  count: 0
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(POSTS_URL)
  return response.data
})

export const addPost = createAsyncThunk('posts/addNewPost', async (payload) => {
  const response = await axios.post(POSTS_URL, payload)
  return response.data
})

export const updatePost = createAsyncThunk('posts/updatePost', async (payload) => {
  const { id } = payload
  const response = await axios.put(`${POSTS_URL}/${id}`, payload)
  return response.data
})

export const deletePost = createAsyncThunk('posts/deletePost', async (payload) => {
  const { id } = payload
  const response = await axios.delete(`${POSTS_URL}/${id}`)
  if (response?.status === 200) return payload

  return `${response?.status}: ${response?.statusText}`
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) existingPost.reactions[reaction]++
    },
    increaseCount(state, action) {
      state.count += 1
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = THUNK_STATUSES.loading
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = THUNK_STATUSES.succeeded
        // Adding additional fields
        let min = 1
        const loadedPosts = action.payload.map(post => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString()
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
          return post
        })

        // state.posts = posts.push(post)
        // state.posts = loadedPosts//state.posts.concat(loadedPosts)
        postsAdapter.upsertMany(state, loadedPosts)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = THUNK_STATUSES.rejected
        state.error = action.error.message
      })
      .addCase(addPost.fulfilled, (state, action) => {
        action.payload.date = new Date().toISOString()
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0
        }
        // state.posts.push(action.payload)
        postsAdapter.addOne(state, action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Update could not complete')
          console.log(action.payload)
          return
        }
        // const { id } = action.payload
        action.payload.date = new Date().toISOString()
        // const posts = state.posts.filter(el => el.id !== id)
        // state.posts = [...posts, action.payload]
        postsAdapter.upsertOne(state, action.payload)
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Delete could not be completed')
          console.log(action.payload)
          return
        }
        // const { id } = action.payload
        // const posts = state.posts.filter(post => post.id !== id)
        // state.posts = posts
        postsAdapter.removeOne(state, action.payload.id)
      })
  }
})

// selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error
export const getCount = (state) => state.posts.count

export const selectPostsByUserId = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.userId === userId)
)

// actions
export const { increaseCount, reactionAdded } = postsSlice.actions

// reducer
export default postsSlice.reducer

import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns'
import axios from 'axios'
import { THUNK_STATUSES } from '../../common/dicts'

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

const initialState = {
  posts: [],
  status: THUNK_STATUSES.idle, //'idle' || 'loading' || 'succeeded' || 'failed'
  error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(POSTS_URL)
  return response.data
})

export const addPost = createAsyncThunk('posts/addNewPost', async (payload) => {
  const response = await axios.post(POSTS_URL, payload)
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0
            }
          }
        }
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find(el => el.id === postId)
      if (existingPost) existingPost.reactions[reaction]++
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
        state.posts = loadedPosts//state.posts.concat(loadedPosts)
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
        state.posts.push(action.payload)
      })
  }
})

// selectors
export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error

// actions
export const { postAdded, reactionAdded } = postsSlice.actions

// reducer
export default postsSlice.reducer

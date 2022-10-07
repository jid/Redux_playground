import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from 'date-fns'
import { apiSlice } from "../api/apiSlice";

// const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState(
  // {
  //   status: THUNK_STATUSES.idle, //'idle' || 'loading' || 'succeeded' || 'failed'
  //   error: null,
  //   count: 0
  // }
)

// export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
//   const response = await axios.get(POSTS_URL)
//   return response.data
// })

// export const addPost = createAsyncThunk('posts/addNewPost', async (payload) => {
//   const response = await axios.post(POSTS_URL, payload)
//   return response.data
// })

// export const updatePost = createAsyncThunk('posts/updatePost', async (payload) => {
//   const { id } = payload
//   const response = await axios.put(`${POSTS_URL}/${id}`, payload)
//   return response.data
// })

// export const deletePost = createAsyncThunk('posts/deletePost', async (payload) => {
//   const { id } = payload
//   const response = await axios.delete(`${POSTS_URL}/${id}`)
//   if (response?.status === 200) return payload
//   return `${response?.status}: ${response?.statusText}`
// })

// const postsSlice = createSlice({
//   name: 'posts',
//   initialState,
//   reducers: {
//     reactionAdded(state, action) {
//       const { postId, reaction } = action.payload
//       const existingPost = state.entities[postId]
//       if (existingPost) existingPost.reactions[reaction]++
//     },
//     increaseCount(state, action) {
//       state.count += 1
//     }
//   },
//   extraReducers(builder) {
//     builder
//       .addCase(fetchPosts.pending, (state, action) => {
//         state.status = THUNK_STATUSES.loading
//       })
//       .addCase(fetchPosts.fulfilled, (state, action) => {
//         state.status = THUNK_STATUSES.succeeded
//         // Adding additional fields
//         let min = 1
//         const loadedPosts = action.payload.map(post => {
//           post.date = sub(new Date(), { minutes: min++ }).toISOString()
//           post.reactions = {
//             thumbsUp: 0,
//             wow: 0,
//             heart: 0,
//             rocket: 0,
//             coffee: 0
//           }
//           return post
//         })

//         // state.posts = posts.push(post)
//         // state.posts = loadedPosts//state.posts.concat(loadedPosts)
//         postsAdapter.upsertMany(state, loadedPosts)
//       })
//       .addCase(fetchPosts.rejected, (state, action) => {
//         state.status = THUNK_STATUSES.rejected
//         state.error = action.error.message
//       })
//       .addCase(addPost.fulfilled, (state, action) => {
//         action.payload.date = new Date().toISOString()
//         action.payload.reactions = {
//           thumbsUp: 0,
//           wow: 0,
//           heart: 0,
//           rocket: 0,
//           coffee: 0
//         }
//         // state.posts.push(action.payload)
//         postsAdapter.addOne(state, action.payload)
//       })
//       .addCase(updatePost.fulfilled, (state, action) => {
//         if (!action.payload?.id) {
//           console.log('Update could not complete')
//           console.log(action.payload)
//           return
//         }
//         // const { id } = action.payload
//         action.payload.date = new Date().toISOString()
//         // const posts = state.posts.filter(el => el.id !== id)
//         // state.posts = [...posts, action.payload]
//         postsAdapter.upsertOne(state, action.payload)
//       })
//       .addCase(deletePost.fulfilled, (state, action) => {
//         if (!action.payload?.id) {
//           console.log('Delete could not be completed')
//           console.log(action.payload)
//           return
//         }
//         // const { id } = action.payload
//         // const posts = state.posts.filter(post => post.id !== id)
//         // state.posts = posts
//         postsAdapter.removeOne(state, action.payload.id)
//       })
//   }
// })

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: responseData => {
        let min = 1
        const loadedPosts = responseData.map(post => {
          if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString()
          if (!post?.reactions) post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
          return post
        })
        return postsAdapter.setAll(initialState, loadedPosts)
      },
      providesTags: (result, error, arg) =>
        result
          ? [
            { type: 'Post', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Post', id }))
          ]
          : [{ type: 'Post', id: 'LIST' }]
    }),
    getPostsByUserId: builder.query({
      query: id => `/posts/?userId=${id}`,
      transformResponse: responseData => {
        let min = 1
        const loadedPosts = responseData.map(post => {
          if (!post?.date) post.date = sub(new Date(), { minutes: min++ }).toISOString()
          if (!post?.reactions) post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
          return post
        })
        return postsAdapter.setAll(initialState, loadedPosts)
      },
      providesTags: (result, error, arg) => {
        return [
          ...result.ids.map(id => ({ type: 'Post', id }))
        ]
      }
    }),
    addNewPost: builder.mutation({
      query: newPost => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...newPost,
          userId: Number(newPost.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
        }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: 'LIST' }
      ]
    }),
    updatePost: builder.mutation({
      query: post => ({
        url: `/posts/${post.id}`,
        method: 'PATCH',
        body: {
          ...post,
          date: new Date().toISOString()
        }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.id }
      ]
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.id }
      ]
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: 'PATCH',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: {
          reactions
        }
      }),
      // OPTIMISTIC UPDATE
      async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
        // 'updateQueryData' requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          // updateQueryData takes three arguments: the name of the endpoint to update,
          // the same cache key value used to identify the specific cached data and a callback that updates the cached data.
          extendedApiSlice.util.updateQueryData('getPosts', postId, draft => {
            // The 'draft' is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.entities[postId]
            if (post) {
              post.reactions = reactions
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.postId }]
    })
  })
})

// hooks
export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation
} = extendedApiSlice

// returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select()

// creates memoized selector
const selectPostsData = createSelector(
  selectPostsResult,
  postResult => postResult.data // normalized state object {ids: [], entities: {}}
)

// // selectors (memoized)
// export const {
//   selectAll: selectAllPosts,
//   selectById: selectPostById,
//   selectIds: selectPostIds
//   // pass in a selector that returns the posts slice of state
// } = postsAdapter.getSelectors(state => state.posts)

// selectors (memoized)
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState)

// export const getPostsStatus = (state) => state.posts.status
// export const getPostsError = (state) => state.posts.error
// export const getCount = (state) => state.posts.count

// export const selectPostsByUserId = createSelector(
//   [selectAllPosts, (state, userId) => userId],
//   (posts, userId) => posts.filter(post => post.userId === userId)
// )

// // actions
// export const { increaseCount, reactionAdded } = postsSlice.actions

// // reducer
// export default postsSlice.reducer

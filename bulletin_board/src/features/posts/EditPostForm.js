import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllUsers } from '../users/usersSlice'
import { selectPostById, updatePost, deletePost } from './postsSlice'
import { THUNK_STATUSES } from '../../common/dicts'

const EditPostForm = () => {
  const { postId } = useParams()
  const navigate = useNavigate()

  const post = useSelector(state => selectPostById(state, Number(postId)))
  const users = useSelector(selectAllUsers)

  const [title, setTitle] = useState(post?.title)
  const [content, setContent] = useState(post?.body)
  const [userId, setAuthor] = useState(post?.userId)
  const [requestStatus, setRequestStatus] = useState(THUNK_STATUSES.idle)

  const dispatch = useDispatch()

  if (!post) {
    return (
      <section>
        <h2>Post Not Found!</h2>
      </section>
    )
  }

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  const onAuthorChanged = e => setAuthor(e.target.value)

  const formValid = [title, content, userId].every(Boolean) && requestStatus === THUNK_STATUSES.idle

  const onSavePostClicked = e => {
    if (formValid) {
      try {
        setRequestStatus(THUNK_STATUSES.loading)
        dispatch(updatePost({
          id: postId,
          title,
          body: content,
          userId,
          reactions: post.reactions
        })).unwrap()

        setTitle('')
        setContent('')
        setAuthor('')
        navigate(`/post/${postId}`)
      } catch (err) {
        console.error('Failed to save post', err)
      } finally {
        setRequestStatus(THUNK_STATUSES.idle)
      }
    }
  }

  const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>{user.name}</option>
  ))

  const onDeletePostClicked = e => {
    try {
      setRequestStatus(THUNK_STATUSES.loading)
      dispatch(deletePost({
        id: postId
      })).unwrap()

      setTitle('')
      setContent('')
      setAuthor('')
      navigate('/')
    } catch (err) {
      console.error('Failed to delete post', err)
    } finally {
      setRequestStatus(THUNK_STATUSES.idle)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={onContentChanged}
        />
        <label htmlFor="author">Author:</label>
        <select
          id="author"
          name="author"
          // value={userId}
          defaultValue={userId}
          onChange={onAuthorChanged}
        >
          <option value=""></option>
          {userOptions}
        </select>
        <button
          type="button"
          onClick={onSavePostClicked}
          disabled={!formValid}
        >Save</button>
        <button
          className="deleteButton"
          type="button"
          onClick={onDeletePostClicked}
        >Delete</button>
      </form>
    </section>
  )
}

export default EditPostForm
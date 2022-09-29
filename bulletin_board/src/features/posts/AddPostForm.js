import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { addPost } from './postsSlice'
import { selectAllUsers } from '../users/usersSlice'
import { THUNK_STATUSES } from "../../common/dicts";
import { useNavigate } from 'react-router-dom'

const AddPostForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState(THUNK_STATUSES.idle)

  const users = useSelector(selectAllUsers)

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)

  const formValid = [title, content, userId].every(Boolean) && addRequestStatus === THUNK_STATUSES.idle

  const onSavePostClicked = (e) => {
    if (formValid) {
      try {
        setAddRequestStatus(THUNK_STATUSES.pending)
        dispatch(addPost({ title, body: content, userId: parseInt(userId, 10) })).unwrap()

        setTitle('')
        setContent('')
        setUserId('')

        navigate('/')
      } catch (err) {
        console.error('Failed to save post', err)
      } finally {
        setAddRequestStatus(THUNK_STATUSES.idle)
      }
    }
  }

  const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
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
          value={userId}
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
      </form>
    </section>
  )
}

export default AddPostForm
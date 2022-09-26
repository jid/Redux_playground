import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { postAdded } from './postsSlice'
import { selectAllUsers } from '../users/usersSlice'

const AddPostForm = () => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  const users = useSelector(selectAllUsers)

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)

  const onSavePostClicked = (e) => {
    if (formValid) {
      dispatch(
        postAdded(title, content, parseInt(userId, 10))
      )
      setTitle('')
      setContent('')
    }
  }

  const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  const formValid = Boolean(title) && Boolean(content) && Boolean(userId)

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
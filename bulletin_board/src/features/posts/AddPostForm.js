import { useState } from "react";
import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersSlice'
import { useNavigate } from 'react-router-dom'
import { useAddNewPostMutation } from "./postsSlice";

const AddPostForm = () => {
  const [addNewPost, { isLoading }] = useAddNewPostMutation()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  const users = useSelector(selectAllUsers)

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)

  const formValid = [title, content, userId].every(Boolean) && !isLoading

  const onSavePostClicked = async (e) => {
    if (formValid) {
      try {
        await addNewPost({ title, body: content, userId }).unwrap()

        setTitle('')
        setContent('')
        setUserId('')
        navigate('/')
      } catch (err) {
        console.error('Failed to save post', err)
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
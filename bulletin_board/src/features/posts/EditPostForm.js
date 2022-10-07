import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAllUsers } from '../users/usersSlice'
import { selectPostById } from './postsSlice'

import { useUpdatePostMutation, useDeletePostMutation } from './postsSlice'

const EditPostForm = () => {
  const { postId } = useParams()
  const navigate = useNavigate()

  const post = useSelector(state => selectPostById(state, Number(postId)))
  const users = useSelector(selectAllUsers)

  const [title, setTitle] = useState(post?.title)
  const [content, setContent] = useState(post?.body)
  const [userId, setAuthor] = useState(post?.userId)
  const [updatePost, { isLoading }] = useUpdatePostMutation()
  const [deletePost] = useDeletePostMutation()

  if (!post) {
    return (
      <section>
        <h2>Post Not Found!</h2>
      </section>
    )
  }

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  const onAuthorChanged = e => setAuthor(Number(e.target.value))

  const formValid = [title, content, userId].every(Boolean) && !isLoading

  const onSavePostClicked = async (e) => {
    if (formValid) {
      try {
        // dispatch(updatePost({
        //   id: postId,
        //   title,
        //   body: content,
        //   userId,
        //   reactions: post.reactions
        // })).unwrap()
        await updatePost({
          id: postId,
          title,
          body: content,
          userId,
          reactions: post.reactions
        }).unwrap()

        setTitle('')
        setContent('')
        setAuthor('')
        navigate(`/post/${postId}`)
      } catch (err) {
        console.error('Failed to save post', err)
      }
    }
  }

  const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>{user.name}</option>
  ))

  const onDeletePostClicked = async (e) => {
    try {
      // dispatch(deletePost({
      //   id: postId
      // })).unwrap()
      await deletePost({ id: postId }).unwrap()

      setTitle('')
      setContent('')
      setAuthor('')
      navigate('/')
    } catch (err) {
      console.error('Failed to delete post', err)
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
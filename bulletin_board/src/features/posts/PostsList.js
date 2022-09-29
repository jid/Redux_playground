import { useSelector } from 'react-redux'
import { selectAllPosts, getPostsStatus, getPostsError } from './postsSlice'
import PostsExcerpt from './PostsExcerpt'
import { THUNK_STATUSES } from '../../common/dicts'

const PostsList = () => {
  const posts = useSelector(selectAllPosts)
  const postsStatus = useSelector(getPostsStatus)
  const postsError = useSelector(getPostsError)

  let content
  if (postsStatus === THUNK_STATUSES.loading) {
    content = <p>Loading...</p>
  } else if (postsStatus === THUNK_STATUSES.succeeded) {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPosts.map(post => <PostsExcerpt key={post.id} post={post} />)
  } else if (postsStatus === THUNK_STATUSES.failed) {
    content = <p>{postsError}</p>
  }

  return (
    <section>
      <h2>Posts:</h2>
      {content}
    </section>
  )

}

export default PostsList
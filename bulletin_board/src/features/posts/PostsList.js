import { useSelector } from 'react-redux'
import { selectPostIds, getPostsStatus, getPostsError } from './postsSlice'
import PostsExcerpt from './PostsExcerpt'
import { THUNK_STATUSES } from '../../common/dicts'

const PostsList = () => {
  const orderedPostIds = useSelector(selectPostIds)
  const postsStatus = useSelector(getPostsStatus)
  const postsError = useSelector(getPostsError)

  let content
  if (postsStatus === THUNK_STATUSES.loading) {
    content = <p>Loading...</p>
  } else if (postsStatus === THUNK_STATUSES.succeeded) {
    content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />)
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
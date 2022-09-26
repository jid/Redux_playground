import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: '👍',
  wow: '😮',
  heart: '❤️',
  rocket: '🚀',
  coffee: '☕'
}

const ReacionButtons = ({ post }) => {
  const dispatch = useDispatch()

  const onEmojiClicked = (e) => {
    const payload = {
      postId: post.id,
      reaction: e.target.name
    }

    dispatch(reactionAdded(payload))
  }

  const reactionButtons = Object.entries(reactionEmoji).map(([key, emoji]) => {
    return (
      <button
        key={key}
        title={key}
        type="button"
        className="reactionButton"
        name={key}
        onClick={onEmojiClicked}
      >
        {emoji} {post.reactions[key]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>

}

export default ReacionButtons
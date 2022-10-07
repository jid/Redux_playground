import { useAddReactionMutation } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: '👍',
  wow: '😮',
  heart: '❤️',
  rocket: '🚀',
  coffee: '☕'
}

const ReacionButtons = ({ post }) => {
  const [addReaction] = useAddReactionMutation()

  const onEmojiClicked = (e) => {
    // const payload = {
    //   postId: post.id,
    //   reaction: e.target.name
    // }

    // dispatch(reactionAdded(payload))
    const reaction = e.target.name
    const newValue = post.reactions[reaction] + 1
    addReaction({ postId: post.id, reactions: { ...post.reactions, [reaction]: newValue } })
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
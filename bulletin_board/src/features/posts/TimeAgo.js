import { parseISO, formatDistanceToNow } from 'date-fns'

import React from 'react'

let TimeAgo = ({ timestamp }) => {
  let timeAgo = ''

  if (timestamp) {
    timeAgo = `${formatDistanceToNow(parseISO(timestamp))} ago`
  }

  return (
    <span title={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </span>
  )
}

TimeAgo = React.memo(TimeAgo)

export default TimeAgo
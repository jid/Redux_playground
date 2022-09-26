import { parseISO, formatDistanceToNow } from 'date-fns'

import React from 'react'

const TimeAgo = ({ timestamp }) => {
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

export default TimeAgo
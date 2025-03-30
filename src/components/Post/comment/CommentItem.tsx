import React from 'react'
import CommentType from '@/types/CommentType'

const CommentItem = ({comment} : {comment : CommentType}) => {
  return (
    <div>
      {comment.comment}
    </div>
  )
}

export default CommentItem

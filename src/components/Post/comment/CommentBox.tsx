import { useState} from 'react'
import CommentItem from './CommentItem'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import supabase from '@/supabase/supabase-client'
import CommentType from '@/types/CommentType'
import { useAuth } from '@/hooks'

export type Comment = {
    comment : string,
    post_id : number,
    user_id : string | undefined,
    author_username : string,
    author_pfp : string,
}

const fetchComments =  async (postId : number) => {
    const {data , error } = await supabase.from("comments").select('*').eq("post_id", postId).order("created_at", { ascending: false })
    if(error)  throw new Error(error.message)

    return data  as CommentType[]
}

const postComment = async (comment : Comment ) => {
    const {error} = await supabase.from("comments").insert(comment)
    if(error)  throw new Error(error.message)
}

const flatcomments = (comments: CommentType[]) => {
    if(!comments) return []
    const commentMap = new Map<number, CommentType & { replies: CommentType[] }>()

    comments.forEach((comment) => {
        commentMap.set(comment.id!, {...comment, replies: []})
    })

    comments.forEach((comment) => {
        if(comment.parent_id !== null){
            const parentComment = commentMap.get(comment.parent_id!)
            if(parentComment){
                parentComment.replies.push({...comment, replies: []})
                commentMap.delete(comment.id!) 
            }
        }
       
    })

    return Array.from(commentMap.values())
}

const CommentBox = ({postId} : {postId : number}) => {

  const [comment,setComment] = useState<string>("")
  const {user} = useAuth()

  const {data : comments , error} = useQuery({queryKey : ["comments",postId] , queryFn : () => fetchComments(postId)})
  if(error)  throw new Error(error.message)


  const queryClient = useQueryClient()
  const {mutate} = useMutation({ mutationFn : postComment , onSuccess : () => 
    queryClient.invalidateQueries({ queryKey: ["comments",postId] })})

  const handlePostComment = () => {
    if(!user) {
        alert("You are not authenticated!")
    }
    if(comment.length === 0) {
        alert("comment cannot be empty!")
    }
    const newComment : Comment = {
        comment : comment,
        post_id : postId,
        user_id : user?.id,
        author_username : user?.user_metadata.user_name,
        author_pfp : user?.user_metadata.avatar_url,
    }
    mutate(newComment)
    setComment("")
  }  

  const flattedComments = flatcomments(comments ?? [])

  return (
    <div className='w-full'>
        <div className='flex flex-col items-end gap-3'>
         <textarea value={comment} onChange={(e) => setComment(e.target.value)} autoFocus rows={3} className='w-full outline-0 border border-green-400 rounded-lg px-3 py-2' placeholder='Leave a comment...' />
         <button onClick={handlePostComment} className='px-3 py-2 bg-green-500 rounded-lg font-semibold'>
            Post Comment
         </button>
      </div>
      <div className='mt-5 space-y-2.5'>
      {flattedComments && flattedComments?.length > 0  ? (flattedComments?.map((comment) => (
          <CommentItem key={comment.id} comment={comment}  />
      )))
    : (
        <p className='text-gray-500'>No comments yet</p>
    )
    }
    </div>
    </div>
  )
}

export default CommentBox

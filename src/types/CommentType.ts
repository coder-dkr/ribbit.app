type CommentType = {
    comment : string,
    user_id : string,
    created_at? : Date,
    id?: number,
    post_id : number,
    parent_id? : number
}


export default CommentType
type CommentType = {
    comment : string,
    user_id : string,
    created_at? : Date,
    id?: number,
    post_id : number,
    parent_id? : number,
    author_username : string,
    author_pfp :  string,
    replies?: CommentType[]
}


export default CommentType
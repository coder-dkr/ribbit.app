type PostType = {
    content : string,
    upLoadFile? : File | null;
    image_url? : string | null,
    user_id : string,
    created_at? : Date,
    id?: number,
    comment_count? : []
}


export default PostType
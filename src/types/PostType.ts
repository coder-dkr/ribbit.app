type PostType = {
    content : string,
    upLoadFile? : File | null;
    image_url? : string | null,
    user_id : string,
}


export default PostType
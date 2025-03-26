import PostType from "@/types/PostType";
import React from "react";
import Image from "next/image";
import ProfileType from "@/types/ProfileType";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import VoteButtons from "./VoteButtons";
import { useAuth } from "@/hooks";

TimeAgo.addDefaultLocale(en);

const PostCard = ({
  post,
  author,
}: {
  post: PostType;
  author: ProfileType | null;
}) => {
  const { content, image_url, created_at } = post;

  const {user} = useAuth()

  if (!author) return <p>Author not Found</p>;
  return (
    <div className="max-w-lg border border-gray-700 px-5 py-4 ">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-base">
          <Image
            width={40}
            height={40}
            alt="author avatar"
            src={author?.avatar_url}
            className="rounded-full"
          />
          <span className="text-lg font-semibold tracking-tighter">{author.name}</span>{" "}
          <span className="text-slate-200">@{author.user_name}</span>
          •
          <ReactTimeAgo className="text-sm" date={created_at!} locale="en-US" />
        </div>
        <HiOutlineDotsHorizontal />
      </div>

      <div className="ml-4">
        <p className="mt-2">{content}</p>

        {image_url && (
          <Image
            width={400}
            height={450}
            src={image_url}
            alt="post image"
            className="rounded-xl mt-3"
          />
        )}
       <div className="mt-3.5">
        <VoteButtons userId={user?.id} postId={post.id!} />
      </div>
      </div>
    </div>
  );
};

export default PostCard;

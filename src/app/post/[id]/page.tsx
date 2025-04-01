"use client";

import supabase from "@/supabase/supabase-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import VoteButtons from "@/components/Post/PostCard/VoteButtons";
import ReactTimeAgo from "react-time-ago";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { useAuth } from "@/hooks";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import CommentBox from "@/components/Post/comment/CommentBox";

TimeAgo.addLocale(en);

const fetchPost = async (id: number) => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      comment_count: comments!post_id(count)
    `)
    .order('created_at', { ascending: false })
    .filter('comments.parent_id', 'is', null)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const { data: authorData, error: authorError } = await supabase
    .from("profiles")
    .select()
    .eq("user_id", data.user_id)
    .single();
  if (authorError) throw new Error(authorError.message);
  return { ...data, author: authorData };
};

const Page = () => {
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;

  const [isSavedByUser, seiIsSavedByUser] = useState(false);

  const { data: post, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => (id ? fetchPost(id) : Promise.resolve(null)),
    enabled: !!id,
  });
  if (error) throw new Error(error.message);

  const { user } = useAuth();

  if (!post) return <p>Loading...</p>;

  const comment_count = (post.comment_count as { count: number }[])[0]?.count ?? 0;
  return (
    <section className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2 text-base">
          <Image
            width={40}
            height={40}
            alt="author avatar"
            src={post?.author.avatar_url}
            className="rounded-full"
          />
          <span className="text-lg font-semibold tracking-tighter">
            {post?.author.name}
          </span>{" "}
          <span className="text-slate-200">@{post?.author?.user_name}</span>
          •
          <ReactTimeAgo
            className="text-sm"
            date={post?.created_at}
            locale="en-US"
          />
        </div>
        <HiOutlineDotsHorizontal />
      </div>

      <div className="ml-4">
        <p className="mt-2 ">{post?.content}</p>

        {post?.image_url && (
          <Image
            width={700}
            height={900}
            src={post.image_url}
            alt="post image"
            className="rounded-xl mt-3"
          />
        )}
        <div className="mt-5 flex items-center justify-between ">
          <div className="flex items-center gap-3.5">
            <VoteButtons userId={user?.id} postId={post?.id} />
            <button
        className="text-xl flex items-center gap-1.5">
          <FaRegComment /> <span className="text-base">{comment_count}</span>
        </button>
          </div>

          <button
            onClick={() => seiIsSavedByUser((p) => !p)}
            className="text-xl"
          >
            {isSavedByUser ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4 w-full">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <div className="w-full">
          <CommentBox postId={post.id} />
        </div>
      </div>
    </section>
  );
};

export default Page;

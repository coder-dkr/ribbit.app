import React, { useState } from "react";
import CommentType from "@/types/CommentType";
import Image from "next/image";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { MdOutlineReply } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks";
import { type Comment } from "./CommentBox";
import supabase from "@/supabase/supabase-client";

TimeAgo.addDefaultLocale(en);

type ReplyType = Comment & { parent_id: number | undefined };

const postReply = async (reply: ReplyType) => {
  const { error } = await supabase.from("comments").insert(reply);
  if (error) throw new Error(error.message);
};

const CommentItem = ({ comment }: { comment: CommentType }) => {
  const [showreplies, setShowreplies] = useState<boolean>(false);
  const [typeReply, setTypeReply] = useState<boolean>(false);
  const [replyComment, setreplyComment] = useState<string>("");

  const { user } = useAuth();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: postReply,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["comments", comment.post_id],
      }),
  });

  const handleReply = () => {
    if (!user) {
      alert("You are not authenticated!");
    }
    if (replyComment.length === 0) {
      alert("comment cannot be empty!");
    }
    const newReply: ReplyType = {
      comment: replyComment,
      post_id: comment.post_id,
      user_id: user?.id,
      author_username: user?.user_metadata.user_name,
      author_pfp: user?.user_metadata.avatar_url,
      parent_id: comment.id,
    };
    mutate(newReply);
    setreplyComment("");
    setTypeReply(false);
  };

  return (
    <div>
      <div className="flex items-center gap-1">
        <Image
          width={35}
          height={35}
          src={comment?.author_pfp}
          alt={comment.author_username}
          className="rounded-full mr-0.5"
        />
        <span className="font-sans font-medium">
          @{comment.author_username}
        </span>
        <ReactTimeAgo
          className="text-sm text-gray-400 ml-1"
          date={comment.created_at!}
          locale="en-US"
        />
      </div>

      <p className="font-sans ml-10">{comment.comment}</p>
      <div className="ml-10 mt-2 flex items-center gap-5">
        <button
          onClick={() => setTypeReply((r) => !r)}
          className="flex items-center gap-1 text-green-500"
        >
          {typeReply ? (
            <span>
              <MdClose className="text-lg" />
            </span>
          ) : (
            <>
              <MdOutlineReply className="text-lg" />
              <span>reply</span>
            </>
          )}
        </button>
        <button
          onClick={() => setShowreplies((p) => !p)}
          className="flex items-center gap-1 text-green-500"
        >
          <span>{showreplies ? "hide replies" : "show replies"}</span>
          <IoChevronDown className={`${showreplies ? "rotate-180" : ""}`} />
        </button>
      </div>

      {typeReply && (
        <div
          className={`ml-10 mt-2 flex flex-col items-end gap-3 duration-150`}
        >
          <textarea
            value={replyComment}
            onChange={(e) => setreplyComment(e.target.value)}
            autoFocus
            rows={2}
            className="w-full outline-0 border border-green-400 rounded-lg px-3 py-2"
            placeholder="Leave a reply..."
          />
          <button
            onClick={handleReply}
            className="px-3 py-2 bg-green-500 rounded-lg font-semibold"
          >
            Post Reply
          </button>
        </div>
      )}
      {showreplies &&
        comment.replies &&
        (comment.replies.length > 0 ? (
          <div className="ml-10 mt-2">
            {comment.replies?.map((item) => (
              <div key={item.id} className={`duration-150`}>
                <CommentItem comment={item} />
              </div>
            ))}
          </div>
        ) : (
          <p className="ml-10 mt-2 text-gray-500">No replies yet</p>
        ))}
    </div>
  );
};

export default CommentItem;

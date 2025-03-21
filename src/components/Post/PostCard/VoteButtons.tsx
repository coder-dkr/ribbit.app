"use client";
import {useMemo} from "react";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "@/supabase/supabase-client";

const fetchVotes = async (postId: number) => {
  const { data, error } = await supabase
    .from("votes")
    .select()
    .eq("post_id", postId);

  if (error) {
    console.error(error);
    return;
  }

  return data || [];
};

const updateVotes = async ({
  userId,
  postId,
  vote,
}: {
  userId: string;
  postId: number;
  vote: number;
}) => {
  const { data: existingVote } = await supabase
    .from("votes")
    .select()
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    const currentVote = existingVote.vote;

    if (currentVote === vote) {
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("user_id", userId);
        if (error) {
          console.error(error);
          return;
        }
      }
      else {
        const { error } = await supabase
          .from("votes")
          .update({ vote })
          .eq("id", existingVote.id);
        console.log(vote)
        if (error) {
          console.error(error);
          return;
        }
      }
  } else {
    const newVote = { user_id: userId, post_id: postId, vote: vote };
    const {error} = await supabase.from("votes").insert(newVote);
    if (error) {
        console.error(error);
        return;
      }
  }
};

export default function VoteButtons({
  userId,
  postId,
}: {
  postId: number;
  userId: string;
}) {

  const queryclient = useQueryClient();

  const { data: allVotes } = useQuery({
    queryKey: ["allvotes", postId],
    queryFn: () => fetchVotes(postId)
  });


  const { mutate } = useMutation({
    mutationFn: updateVotes,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["allvotes", postId] });
    },
  });

  const likes = useMemo(() => allVotes?.filter((vote) => vote.vote === 1).length , [allVotes]);
  const dislikes = useMemo(() => allVotes?.filter((vote) => vote.vote === -1).length , [allVotes]);
  const userVote =   allVotes?.find((vote) => vote.user_id === userId)?.vote

  return (
    <div className="flex items-center text-2xl gap-3">
      <button
        className={`flex items-center gap-1`}
        onClick={() => mutate({ userId, postId, vote: 1 })}
      >
        {userVote === 1 ? <AiFillLike /> : <AiOutlineLike />}
        <span className="text-base">{likes}</span>
      </button>

      <button
        className={`flex items-center gap-1`}
        onClick={() => mutate({ userId, postId, vote: -1 })}
      >
        {userVote === -1 ? <AiFillDislike /> : <AiOutlineDislike />}
        <span className="text-base">{dislikes}</span>
      </button>
    </div>
  );
}

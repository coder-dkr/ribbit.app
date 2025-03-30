"use client";

import React from "react";
import ActualPost from "./ActualPost";
import PostType from "@/types/PostType";
import ProfileType from "@/types/ProfileType";
import { useQuery } from "@tanstack/react-query";
import supabase from "@/supabase/supabase-client";

const fetchAuthor = async (user_id: string): Promise<ProfileType | null> => {
  const { data, error } = await supabase
  .from('profiles') 
  .select()
  .eq('user_id', user_id)
  .single();

  if (error) {
    console.error("Error fetching author:", error.message);
    throw new Error(error.message);
  }

  return data;
};

const Post = ({ post }: { post: PostType }) => {
  const { user_id } = post;
  const {
      data : author,
      error,
      isLoading
    } = useQuery({
      queryKey: ["post", user_id],
      queryFn: () => fetchAuthor(user_id),
    });

    if (isLoading) return <p>Loading</p>;
    if (error) throw new Error(error.message);

    return <ActualPost post={post} author={author!} />;
  };

export default Post;

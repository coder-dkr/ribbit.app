"use client";

import Post from "@/components/Post/PostCard/Post";
import supabase from "@/supabase/supabase-client";
import ProfileType from "@/types/ProfileType";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

const fetchUser = async (username: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("user_name", username)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as ProfileType;
};

const fetchPosts = async (userId : string | undefined) => {
    if(!userId) return null
    const { data, error } = await supabase.from("posts").select(`
        *,
        comment_count: comments!post_id(count)
      `)
      .order('created_at', { ascending: false })
      .filter('comments.parent_id', 'is', null)
      .eq("user_id",userId);
  if (error) throw new Error(error.message);
  return data ;
}

const Page = () => {
  const params = useParams();
  const username = params?.username ? String(params?.username) : '';

  const [showSaved , setShowSaved] = useState(false)

  const { data: user, error } = useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUser(username),
  });
  if (error) throw new Error(error.message);

  const { data: posts, error : postError } = useQuery({
    queryKey: ["posts", username],
    queryFn: () => fetchPosts(user?.user_id),
  });

  if (postError) throw new Error(postError.message);

  if (!user) {
    return null;
  }
  console.log("posts",posts)
  return (
    <section className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-10">
        <div>
          <Image
            width={300}
            height={300}
            src={user?.avatar_url}
            alt="user avatar"
            className="rounded-full"
          />
        </div>
        <div className="space-y-3">
          <h3 className="text-4xl">{user.name}</h3>
          <p className="font-sans">@{user.user_name}</p>
        </div>
      </div>
      <div className="mt-5">
        <div className="w-full flex items-center justify-around">
        <button 
        onClick={() => setShowSaved(false)}
        className={`text-2xl font-semibold ${showSaved ? "" : "underline"} `}>
            Your Posts
        </button>
        <span className="h-8 w-0.5 bg-gray-500" />
        <button 
        onClick={() => setShowSaved(true)}
        className={`text-2xl font-semibold  ${showSaved ? "underline" : ""}`}>
            Saved Posts
        </button>
        </div>
        <div className="mt-7 justify-items-center">
            {!showSaved ? (posts && posts.length > 0 ? (posts.map((post) => (
                <Post key={post.id} post={post} />
            ))) : 
            (<p>You ain&apos;t ribbiting enough</p>)
            ) :
            <p>Hello</p>
            }
        </div>
      </div>
    </section>
  );
};

export default Page;

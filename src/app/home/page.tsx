"use client"

import Post from '@/components/Post/PostCard/Post'
import supabase from '@/supabase/supabase-client'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const fetchPosts = async () => {
  const {data,error} = await supabase.from("posts").select().order("created_at", { ascending: false })
  if(error) throw new Error(error.message)
  return data
}

const Page = () => {
  const {data : posts, error , isLoading} = useQuery({queryKey: ["postslist"], queryFn: fetchPosts})

  if(error) throw new Error(error.message)
  if(isLoading) return <p>lOADIN</p>  

  return (
    <div>
      {posts && posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <p>No posts available</p>
      )}
    </div>
  )
}

export default Page

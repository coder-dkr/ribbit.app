"use client";
import { useAuth } from "@/hooks";
import Image from "next/image";
import ButtonShimmer from "@/components/ui/Button-shimmer";
import ButtonMagic from "@/components/ui/Button-magicB";
import { useState } from "react";

export default function SignUser() {
  const [copied , setCopied] = useState(false)
  const { user, handleSignInWithOAuth ,signOut } = useAuth();


  const shareProfileLink = async () => {
    const link = `${window.origin}/${user?.user_metadata.user_name}`
    await navigator.clipboard.writeText(link);
    setCopied(true)
    setTimeout(() => {
    setCopied(false)
    },1000)
  }

  return (
    <>
      {user ? (
        <div className="relative flex items-center gap-3 group">
          <div className="flex items-center gap-3 cursor-pointer">
            {user.user_metadata.avatar_url && (
              <Image
                width={40}
                height={40}
                src={user.user_metadata.avatar_url}
                alt="user avatar"
                className="rounded-full border border-slate-800"
              />
            )}
          </div>
          <div className="absolute top-full right-0 hidden group-hover:flex flex-col justify-center border bg-black border-gray-800 gap-3 p-3 rounded-2xl">
            <div className="absolute inset-0 m-3 bg-white blur-sm -z-[1]" />
            <ButtonShimmer
              onClick={shareProfileLink}
              content={copied ? "Copied ✌️" :"Share profile ➤"}
            />
            <ButtonShimmer
              onClick={signOut}
              content={`Sign out  @${user.user_metadata.user_name}`}
            />
          </div>
        </div>
      ) : (
        <div className="relative group">
          <ButtonMagic content="Sign Up" />
          <div className="absolute top-full right-0 hidden group-hover:flex flex-col justify-center border bg-black border-gray-800 gap-3 p-3 rounded-2xl">
          <div className="absolute inset-0 m-3 bg-white blur-sm -z-[1]" />
            <ButtonShimmer
              onClick={() => handleSignInWithOAuth("github")}
              content="Sign Up with github"
            />
            <ButtonShimmer
              onClick={() => handleSignInWithOAuth("google")}
              content="Sign Up with Google"
            />
            <ButtonShimmer
              onClick={() => handleSignInWithOAuth("twitter")}
              content="Sign Up with X"
            />
          </div>
        </div>
      )}
    </>
  );
}

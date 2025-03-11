"use client";
import { useAuth } from "@/hooks";
import Image from "next/image";

export default function SignUser() {
  const { user, handleSignInWithOAuth, signOut } = useAuth();
  // console.log(user);
  return (
    <>
      {user ? (
        <div className="flex items-center gap-3">
          {user.user_metadata.avatar_url && (
            <Image
              width={35}
              height={35}
              src={user.user_metadata.avatar_url}
              alt="user avatar"
              className="rounded-full"
            />
          )}
          <button
            onClick={signOut}
            className="inline-flex h-9 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSignInWithOAuth("github")}
            className="inline-flex h-9 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none active:scale-105 duration-150"
          >
            Sign Up with github
          </button>
          <button
            onClick={() => handleSignInWithOAuth("google")}
            className="inline-flex h-9 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none active:scale-105 duration-150"
          >
            Sign Up with Google
          </button>
          <button
            onClick={() => handleSignInWithOAuth("twitter")}
            className="inline-flex h-9 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none active:scale-105 duration-150"
          >
            Sign Up with Twitter
          </button>
        </div>
      )}
    </>
  );
}

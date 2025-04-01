"use client";

import supabase from "@/supabase/supabase-client";
import ProfileType from "@/types/ProfileType";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";

const fetchUser = async (username: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("user_name", username)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as ProfileType;
};

const Page = () => {
  const params = useParams();
  const username = params?.username ? String(params?.username) : '';

  const { data: user, error } = useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUser(username),
  });
  if (error) throw new Error(error.message);

  if (!user) {
    return null;
  }

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
        <h3 className="text-2xl font-semibold">
            Your Posts
        </h3>
        <div>
            
        </div>
      </div>
    </section>
  );
};

export default Page;

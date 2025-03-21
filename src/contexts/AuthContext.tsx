"use client";

import supabase from "@/supabase/supabase-client";
import { Provider, User } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import UsernameForm from "@/components/User/UsernameForm";

type AuthContextType = {
  user: User | null;
  handleSignInWithOAuth: (provider: Provider) => void;
  signOut: () => void;
  needsUserName: boolean;
  updateUserName: (userName: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [needsUserName, setNeedsUserName] = useState(false);

  useEffect(() => {
    // Check if the user is signed in
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      if (data?.user) {
        checkUserName(data.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserName(session.user.id);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const checkUserName = async (userId: string) => {
    // Fetch the user's profile
    const { data, error } = await supabase
      .from("profiles")
      .select("user_name")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    // If user_name is missing, prompt the user to provide one
    if (!data.user_name) {
      setNeedsUserName(true);
    }
  };

  const isUserNameUnique = async (userName: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("user_name")
      .eq("user_name", userName)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking username uniqueness:", error);
      throw new Error(error.message);
    }

    return !data;
  };

  const handleSignInWithOAuth = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) throw new Error(error.message);
  };

  const updateUserName = async (userName: string) => {
    if (!user) return;

    try {
      // Check if the username is unique
      const isUnique = await isUserNameUnique(userName);
      if (!isUnique) {
        throw new Error("Username is already taken. Please choose another one.");
      }

      // Update user_metadata in auth.users
      const { error: authError } = await supabase.auth.updateUser({
        data: { ...user.user_metadata, user_name: userName },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ user_name: userName })
        .eq("user_id", user.id);

      if (profileError) {
        if (profileError.code === "23505") {
          throw new Error("Username is already taken. Please choose another one.");
        }
        throw new Error(profileError.message);
      }

      // Reset the needsUserName state
      setNeedsUserName(false);

      // Refresh the session to get the updated user data
      const {
        data: { session: newSession },
        error: sessionError,
      } = await supabase.auth.refreshSession();
      if (sessionError) {
        throw new Error(sessionError.message);
      }

      // Update the user state with the new session data
      setUser(newSession?.user ?? null);
    } catch (error) {
      console.error("Error updating user_name:", error);
      throw error;
    }
  };

  const signOut = () => {
    supabase.auth.signOut();
    redirect("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        handleSignInWithOAuth,
        signOut,
        needsUserName,
        updateUserName,
      }}
    >
      <UsernameForm />
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
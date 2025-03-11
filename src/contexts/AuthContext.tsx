"use client";

import supabase from "@/supabase/supabase-client";
import { Provider, User } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";

type AuthContextType  ={
    user : User | null,
    handleSignInWithOAuth: (provider : Provider) => void,
    signOut : () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({children} : {children : React.ReactNode}) => {
    const [user , setUser] = useState<User | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({data : {session}}) => {
            setUser(session?.user?? null)
        })

        const {data : listener } = supabase.auth.onAuthStateChange((_,session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    },[])

    const handleSignInWithOAuth = (provider : Provider) => {
        supabase.auth.signInWithOAuth({provider})
    }

    const signOut = () => {
        supabase.auth.signOut()
    }
    return (
        <AuthContext.Provider value={{user , handleSignInWithOAuth , signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider 
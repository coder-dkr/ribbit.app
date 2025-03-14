"use client";

import LandingPage from "@/pages/Landing/LandingPage";
import supabase from "@/supabase/supabase-client";
import { Provider, User } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";
import {redirect} from 'next/navigation'

type AuthContextType  ={
    user : User | null,
    handleSignInWithOAuth: (provider : Provider) => void,
    signOut : () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider = ({children} : {children : React.ReactNode}) => {
    const [user , setUser] = useState<User | null>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({data}) => {
            setUser(data?.user?? null)
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
        redirect('/')
    }
    return (
        <AuthContext.Provider value={{user , handleSignInWithOAuth , signOut}}>
            {user ? children : <LandingPage /> }
        </AuthContext.Provider>
    )
}

export default AuthProvider 
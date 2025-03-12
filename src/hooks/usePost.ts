import { useContext } from "react";
import { PostContext } from "@/contexts/PostContext";

export const usePost = () => {
    const context = useContext(PostContext)
    if(context === undefined) {
        throw new Error("usePost must only be used within PostContextProvider")
    }

    return context
}

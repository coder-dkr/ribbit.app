"use client";

import { createContext, useState, Dispatch , SetStateAction } from "react";

type PostContextType  ={
    isModalOpen : boolean,
    setIsModalOpen : Dispatch<SetStateAction<boolean>>
}

export const PostContext = createContext<PostContextType>({
    isModalOpen : false,
    setIsModalOpen : () => {}

})

const PostContextProvider = ({children} : {children : React.ReactNode}) => {
    const [isModalOpen , setIsModalOpen] = useState<boolean>(false);

    return (
        <PostContext.Provider value={{isModalOpen , setIsModalOpen}}>
            {children}
        </PostContext.Provider>
    )
}

export default PostContextProvider 
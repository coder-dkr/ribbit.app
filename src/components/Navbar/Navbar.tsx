"use client";
import React from "react";
import NavItems from "@/constants";
import NavTab from "./NavTab";
import {usePost} from "@/hooks";
import { useAuth } from "@/hooks";
import { FaRegUser, FaUser } from "react-icons/fa";

const Navbar = () => {
  const{setIsModalOpen } = usePost()
  const {user} = useAuth()

  const TogglePostModal = () => {
    setIsModalOpen((prev) => !prev)
  }

  return (
    <div className="flex flex-col  justify-center items-start gap-y-10 ">
      <nav className="flex flex-col items-center text-xl justify-center gap-3">
        {NavItems.map((item) => (
          <div key={item.name} className="w-full">
            <NavTab item={item} />
          </div>
        ))}
        <div className="w-full">
            <NavTab item={{
               name: "Profile",
               route: `/profile/${user?.user_metadata.user_name}`,
               icon: FaRegUser,
               activeIcon: FaUser
            }} />
          </div>
      </nav>
      <div>
        <button onClick={TogglePostModal} className="p-3 px-10 bg-green-500 text-[1.3rem] font-semibold rounded-full">
          Create Post
        </button>
      </div>
    </div>
  );
};

export default Navbar;

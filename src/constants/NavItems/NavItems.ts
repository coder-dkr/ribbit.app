import { IoHomeOutline , IoHomeSharp } from "react-icons/io5";
import { IoMdNotificationsOutline , IoMdNotifications } from "react-icons/io"
import { HiOutlineUsers , HiUsers} from "react-icons/hi2";
import { MdChatBubbleOutline , MdChat} from "react-icons/md";
import { FaRegUser, FaUser } from "react-icons/fa";
import { NavItemType } from "@/types/NavItemType";



const  NavItems : NavItemType[] = [
    {
        name : "Home",
        route : "/home",
        icon : IoHomeOutline,
        activeIcon : IoHomeSharp
    },
    {
        name : "Notifications",
        route : "/notifications",
        icon : IoMdNotificationsOutline,
        activeIcon : IoMdNotifications
    },
    {
        name : "Communities",
        route : "/communities",
        icon : HiOutlineUsers,
        activeIcon: HiUsers
    },
    {
        name : "Messages",
        route : "/messages",
        icon : MdChatBubbleOutline,
        activeIcon: MdChat
    },
    {
        name : "Profile",
        route : "/profile",
        icon : FaRegUser,
        activeIcon: FaUser
    },

]

export {NavItems}


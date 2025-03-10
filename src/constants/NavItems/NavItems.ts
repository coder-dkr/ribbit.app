import { IconType } from "react-icons";
import { IoHomeOutline } from "react-icons/io5";

type NavItemType = {
    name: string,
    route: string,
    icon: IconType
}

const  NavItems : NavItemType[] = [
    {
        name : "Home",
        route : "/",
        icon : IoHomeOutline
    },
    
]

export {NavItems}
"use client";

import React, { useMemo } from "react";
import { NavItemType } from "@/types/NavItemType";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const NavTab = ({ item }: { item: NavItemType }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending , startTransition] = useTransition()

  function handleNavigation () {
    startTransition(() => {
        router.push(item.route)
    })
  }

  const activeRoute = useMemo(
    () => pathname === item.route || (item.route !== "/" && pathname?.startsWith(item.route)),
    [pathname, item.route]
  );

  const Icon = activeRoute && item.activeIcon ? item.activeIcon : item.icon;

  return (
    <button
      onClick={handleNavigation}
      disabled={isPending}
      className={`w-full flex items-center gap-3 text-xl p-3 rounded-2xl duration-200 ${
        activeRoute ? "text-white bg-white/10" : "hover:bg-white/10"
      }`}
    >
      <Icon />
      <span>{item.name}</span>
    </button>
  );
};

export default NavTab;
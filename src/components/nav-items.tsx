"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";

import { useAuthContext } from "./app-provider";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false,
  },
];

interface Props {
  className?: string;
}

export default function NavItems({ className }: Props) {
  const mounted = useMounted();
  const pathname = usePathname();
  const { isLoggedIn } = useAuthContext();
  console.log("🚀 ~ NavItems ~ isLoggedIn:", isLoggedIn);

  if (!mounted) {
    return null;
  }

  return menuItems.map((item) => {
    const { href, title, authRequired } = item;

    if (
      (authRequired === true && !isLoggedIn) ||
      (authRequired === false && isLoggedIn)
    ) {
      return null;
    }

    return (
      <Link
        href={item.href}
        key={href}
        className={cn(className, {
          "text-foreground": pathname === href,
        })}
      >
        {title}
      </Link>
    );
  });
}

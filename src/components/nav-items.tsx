"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useMounted } from "@/lib/hooks";
import { getLocalStorage } from "@/utils/storage";
import { cn } from "@/utils/ui";

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

function getAccount() {
  try {
    const account = getLocalStorage("account");
    return account ? JSON.parse(account) : null;
  } catch (error) {
    console.error("Failed to parse account from localStorage:", error);
    return null;
  }
}

interface Props {
  className?: string;
}

export default function NavItems({ className }: Props) {
  const mounted = useMounted();
  const pathname = usePathname();

  if (!mounted) {
    return null;
  }

  const account = getAccount();

  return menuItems.map((item) => {
    const { href, title, authRequired } = item;

    if (
      (authRequired === true && !account) ||
      (authRequired === false && account)
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

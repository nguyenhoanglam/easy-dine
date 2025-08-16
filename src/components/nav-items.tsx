"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/auth";
import { Role } from "@/types/others";

import { useAuthContext } from "./app-provider";

const menuItems: {
  title: string;
  href: string;
  roles?: Role[];
  hideWhenLoggedIn?: boolean;
}[] = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Menu",
    href: "/guest/menu",
    roles: ["Guest"],
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLoggedIn: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    roles: ["Owner", "Employee"],
  },
];

interface Props {
  className?: string;
}

export default function NavItems({ className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const { role, setRole } = useAuthContext();
  const logoutMutation = useLogoutMutation();

  if (!mounted) {
    return null;
  }

  const handleLogout = async () => {
    if (logoutMutation.isPending) return;

    await logoutMutation.mutateAsync();

    setRole(null);
    router.push("/");
  };
  return (
    <>
      {menuItems.map((item) => {
        const { title, href, roles, hideWhenLoggedIn } = item;

        const accessible = !roles || (role && roles.includes(role));
        const hidden = role && hideWhenLoggedIn;

        if (!accessible || hidden) {
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
      })}
      {role && (
        <div className={cn(className, "cursor-pointer")} onClick={handleLogout}>
          Đăng xuất
        </div>
      )}
    </>
  );
}

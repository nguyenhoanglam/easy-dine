"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuthContext } from "@/components/app-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/auth";
import { Role } from "@/types/others";

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
    title: "Đơn hàng",
    href: "/guest/orders",
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

type Props = {
  className?: string;
};

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
        <AlertDialog>
          <AlertDialogTrigger>
            <div className={cn(className, "cursor-pointer")}>Đăng xuất</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có muốn đăng xuất không?</AlertDialogTitle>
              <AlertDialogDescription>
                Đăng xuất có thể làm mất hóa đơn của bạn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

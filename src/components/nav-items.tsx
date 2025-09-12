"use client";

import { useTranslations } from "next-intl";

import { useAppStore } from "@/components/app-provider";
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
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/auth";
import { I18nNavItemsKeys, Role } from "@/types/others";

const menuItems: {
  key: I18nNavItemsKeys;
  href: string;
  roles?: Role[];
  hideWhenLoggedIn?: boolean;
}[] = [
  {
    key: "home",
    href: "/",
  },
  {
    key: "menu",
    href: "/guest/menu",
    roles: ["Guest"],
  },
  {
    key: "orders",
    href: "/guest/orders",
    roles: ["Guest"],
  },
  {
    key: "login",
    href: "/login",
    hideWhenLoggedIn: true,
  },
  {
    key: "manage",
    href: "/manage/dashboard",
    roles: ["Owner", "Employee"],
  },
];

type Props = {
  className?: string;
};

export default function NavItems({ className }: Props) {
  const t = useTranslations("NavItems");
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const { role, setRole, disconnectSocket } = useAppStore();
  const logoutMutation = useLogoutMutation();

  if (!mounted) {
    return null;
  }

  const handleLogout = async () => {
    if (logoutMutation.isPending) return;

    await logoutMutation.mutateAsync();

    disconnectSocket();
    setRole(null);

    router.push("/");
  };

  return (
    <>
      {menuItems.map((item) => {
        const { key, href, roles, hideWhenLoggedIn } = item;

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
            {key !== "logoutDialog" ? t(key) : key}
          </Link>
        );
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger>
            <div className={cn(className, "cursor-pointer")}>{t("logout")}</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("logoutDialog.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("logoutDialog.content")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("logoutDialog.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                {t("logoutDialog.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

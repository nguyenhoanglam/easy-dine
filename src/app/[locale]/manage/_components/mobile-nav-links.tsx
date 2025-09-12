"use client";

import { Package2, PanelLeft, X } from "lucide-react";
import { useTranslations } from "next-intl";

import menuItems from "@/app/[locale]/manage/_components/menu-items";
import { useAppStore } from "@/components/app-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/navigation";
import { Role } from "@/lib/constants";
import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function MobileNavLinks() {
  const t = useTranslations("NavLinks");
  const { role } = useAppStore();
  const mounted = useMounted();
  const pathname = usePathname();

  if (!mounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Mở menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="sm:max-w-xs sm:w-full py-4 [&>button:first-of-type]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle />
          <SheetDescription />
        </SheetHeader>
        <nav className="grid gap-6 text-lg font-medium">
          <div className="flex items-center justify-between px-4">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Easy Dine</span>
            </Link>
            <SheetClose asChild>
              <Button variant="outline" size="icon">
                <X className="h-5 w-5" />
                <span className="sr-only">Đóng menu</span>
              </Button>
            </SheetClose>
          </div>
          {menuItems.map((item, index) => {
            const { key, href, Icon, roles } = item;
            const isActive = pathname === href;
            const accessible =
              role && role !== Role.Guest && roles && roles.includes(role);

            if (!accessible) {
              return null;
            }

            return (
              <Link
                key={index}
                href={href}
                className={cn(
                  "flex items-center gap-4 px-4 hover:text-foreground",
                  {
                    "text-foreground": isActive,
                    "text-muted-foreground": !isActive,
                  },
                )}
              >
                <Icon className="h-5 w-5" />
                {t(key)}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { Package2, PanelLeft, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import menuItems from "@/app/manage/_components/menu-items";
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
import { cn } from "@/lib/utils";

export default function MobileNavLinks() {
  const pathname = usePathname();

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
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <SheetClose asChild>
              <Button variant="outline" size="icon">
                <X className="h-5 w-5" />
                <span className="sr-only">Đóng menu</span>
              </Button>
            </SheetClose>
          </div>
          {menuItems.map((item, index) => {
            const { href, title, Icon } = item;
            const isActive = pathname === href;

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
                {title}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

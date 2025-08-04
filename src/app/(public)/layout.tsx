import { House, Menu, X } from "lucide-react";
import Link from "next/link";

import DarkModeToggle from "@/components/dark-mode-toggle";
import NavItems from "@/components/nav-items";
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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col w-full min-h-screen">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden items-center font-medium md:flex md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <House className="h-6 w-6" />
            <span className="sr-only">Trang chủ</span>
          </Link>
          <NavItems className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden shrink-0"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="[&>button:first-of-type]:hidden">
            <SheetHeader className="sr-only">
              <SheetTitle />
              <SheetDescription />
            </SheetHeader>
            <nav className="grid gap-6 p-4 text-lg font-medium">
              <div className="flex items-center justify-between">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <House className="h-6 w-6" />
                  <span className="sr-only">Trang chủ</span>
                </Link>
                <SheetClose asChild>
                  <Button variant="outline" size="icon">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Đóng menu</span>
                  </Button>
                </SheetClose>
              </div>
              <NavItems className="text-muted-foreground hover:text-foreground transition-colors" />
            </nav>
          </SheetContent>
        </Sheet>
        <div className="ml-auto">
          <DarkModeToggle />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}

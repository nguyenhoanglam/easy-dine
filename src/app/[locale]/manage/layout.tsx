import DropdownAvatar from "@/app/[locale]/manage/_components/dropdown-avatar";
import MobileNavLinks from "@/app/[locale]/manage/_components/mobile-nav-links";
import NavLinks from "@/app/[locale]/manage/_components/nav-links";
import { DarkModeToggle } from "@/components";
import LocalSwitcher from "@/components/locale-switcher";
import { setLayoutLocale } from "@/services/locales";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default function Layout({ children, params }: Props) {
  setLayoutLocale(params);

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/40">
      <NavLinks />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <MobileNavLinks />
          <div className="relative ml-auto flex-1 md:grow-0">
            <div className="flex justify-end gap-4">
              <LocalSwitcher />
              <DarkModeToggle />
            </div>
          </div>
          <DropdownAvatar />
        </header>
        {children}
      </div>
    </div>
  );
}

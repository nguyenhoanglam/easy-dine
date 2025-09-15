"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Suspense } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Locale, locales } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";

function Switcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getLocaleLabel = (locale: Locale) => {
    return locale === "en" ? "English" : "Tiếng Việt";
  };

  const switchLocale = (nextLocale: Locale) => {
    const queryString = searchParams.toString();
    const newPathname = pathname.replace(`/${locale}`, `/${nextLocale}`);
    const href = queryString ? `${newPathname}?${queryString}` : newPathname;

    console.log(href);
    router.replace(href, { locale: nextLocale });
  };

  return (
    <Select value={locale} onValueChange={switchLocale}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={getLocaleLabel(locale)} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {getLocaleLabel(locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function LocalSwitcher() {
  return (
    <Suspense>
      <Switcher />
    </Suspense>
  );
}

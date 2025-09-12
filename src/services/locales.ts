import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { Locale } from "@/i18n/config";
import { routing } from "@/i18n/routing";

export async function setLayoutLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);
}

export function setPageLocale(params: Promise<{ locale: string }>) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { locale } = use(params);

  // Enable static rendering
  setRequestLocale(locale as Locale);
}

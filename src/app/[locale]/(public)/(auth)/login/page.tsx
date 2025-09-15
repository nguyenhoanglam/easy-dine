import { getTranslations } from "next-intl/server";

import { Locale } from "@/i18n/config";
import { createMetadata } from "@/lib/utils";
import { setPageLocale } from "@/services/locales";
import { PageProps } from "@/types/others";

import LoginForm from "./login-form";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "LoginPage",
  });

  return createMetadata({
    title: t("title"),
    description: t("description"),
    pathname: `/${locale}/login`,
  });
}

export default function LoginPage({ params }: PageProps) {
  setPageLocale(params);

  return (
    <div className="flex justify-center items-center flex-1">
      <LoginForm />
    </div>
  );
}

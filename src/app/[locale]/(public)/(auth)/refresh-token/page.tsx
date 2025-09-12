import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Locale } from "@/i18n/config";
import { createMetadata } from "@/lib/utils";
import { PageProps } from "@/types/others";

import RefreshToken from "./refresh-token";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "RefreshTokenPage",
  });

  return createMetadata({
    title: t("title"),
    description: t("description"),
    robots: { index: false },
  });
}

export default function RefreshTokenPage() {
  return (
    <Suspense>
      <RefreshToken />
    </Suspense>
  );
}

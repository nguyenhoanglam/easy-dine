import { getTranslations } from "next-intl/server";

import { getDishDetailAction, getDishListAction } from "@/actions/dish";
import DishDetail from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";
import { Locale } from "@/i18n/config";
import {
  createMetadata,
  generateSlugUrl,
  parseIdFromSlugUrl,
} from "@/lib/utils";
import { PageProps } from "@/types/others";

import DishModal from "./dish-modal";

export async function generateStaticParams() {
  const response = await getDishListAction();

  if (!response.ok) {
    return [];
  }

  return response.data.map((dish) => ({
    slug: generateSlugUrl({ name: dish.name, id: dish.id }),
  }));
}

export async function generateMetadata({
  params,
}: PageProps<{ slug: string }>) {
  const { locale, slug } = await params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "DishDetailPage",
  });

  const id = parseIdFromSlugUrl(slug);
  const response = await getDishDetailAction(Number(id));

  if (!response.ok) {
    return createMetadata({ title: t("notFound") });
  }

  const { name, description } = response.data;
  const pathname = `/${locale}/dishes/${slug}`;

  return createMetadata({
    title: name,
    description,
    pathname,
  });
}

export default async function DishPage({
  params,
}: PageProps<{ slug: string }>) {
  const { slug } = await params;
  const id = parseIdFromSlugUrl(slug);

  const response = await getDishDetailAction(Number(id));

  return (
    <DishModal>
      <DishDetail dish={(response.ok && response.data) || undefined} />
    </DishModal>
  );
}

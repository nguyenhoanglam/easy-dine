import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { getDishDetailAction, getDishListAction } from "@/actions/dish";
import {
  createMetadata,
  generateSlugUrl,
  parseIdFromSlugUrl,
} from "@/lib/utils";
import { PageProps } from "@/types/others";

import DishDetail from "./dish-detail";

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

  const { name, description, image } = response.data;
  const pathname = `/${locale}/dishes/${slug}`;

  return createMetadata({
    title: name,
    description,
    pathname,
    imageUrl: image,
  });
}

//e.x: slug = "banh-my-i.123" => id = 123
export default async function DishPage({
  params,
}: PageProps<{ slug: string }>) {
  const { slug } = await params;
  const id = parseIdFromSlugUrl(slug);

  const response = await getDishDetailAction(Number(id));

  return <DishDetail dish={(response.ok && response.data) || undefined} />;
}

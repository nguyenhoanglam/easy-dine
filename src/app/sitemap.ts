import type { MetadataRoute } from "next";

import { getDishListAction } from "@/actions/dish";
import { locales } from "@/i18n/config";
import { env } from "@/lib/env";
import { generateSlugUrl } from "@/lib/utils";

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: "",
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: "/login",
    changeFrequency: "yearly",
    priority: 0.5,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [...staticRoutes];

  const response = await getDishListAction();
  if (response.ok) {
    const dishRoutes: MetadataRoute.Sitemap = response.data.map((dish) => ({
      url:
        "/" +
        generateSlugUrl({
          name: dish.name,
          id: dish.id,
        }),
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: new Date(dish.updatedAt),
    }));

    routes.push(...dishRoutes);
  }

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      ...route,
      url: `${env.NEXT_PUBLIC_APP_URL}/${locale}${route.url}`,
      lastModified: new Date(),
    })),
  );
}

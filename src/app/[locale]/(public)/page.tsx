import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { getDishListAction } from "@/actions/dish";
import { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { createMetadata, formatCurrency, generateSlugUrl } from "@/lib/utils";
import { PageProps } from "@/types/others";

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "HomePage",
  });

  return createMetadata({
    title: t("title"),
    description: t("description"),
    pathname: `/${locale}`,
  });
}

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const response = await getDishListAction();

  if (!response.ok) {
    return <div>Đã xảy ra lỗi.</div>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <div className="relative w-full aspect-[4]">
          <Image
            src="/banner.jpg"
            alt="banner"
            fill
            className="object-cover"
            sizes="100vw"
            fetchPriority="high"
            priority
          />
        </div>
        <div className="absolute z-20 px-4 sm:px-10 md:px-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white">
            {t("title")}
          </h1>
          <p className="text-center text-sm sm:text-base mt-4 text-white">
            Vị ngon, trọn khoảnh khắc
          </p>
        </div>
      </div>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">Đa dạng các món ăn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {response.data.map((dish) => (
            <Link
              className="flex gap-4 w"
              key={dish.id}
              href={`/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`}
            >
              <div className="flex-shrink-0">
                <Image
                  src={dish.image}
                  width={150}
                  height={150}
                  quality={100}
                  alt={dish.name}
                  className="object-cover w-[150px] h-[150px] rounded-md"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{dish.name}</h3>
                <p className="">{dish.description}</p>
                <p className="font-semibold">{formatCurrency(dish.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

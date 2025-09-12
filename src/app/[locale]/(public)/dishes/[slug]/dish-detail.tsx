import Image from "next/image";

import { formatCurrency } from "@/lib/utils";
import { Dish } from "@/types/dish";

type Props = {
  dish?: Dish;
};

export default function DishDetail({ dish }: Props) {
  if (!dish) {
    return <div>Món ăn không tồn tại.</div>;
  }

  const { name, price, image, description } = dish;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-semibold">{name}</h1>
      <div>Giá: {formatCurrency(price)}</div>
      <Image
        src={image}
        width={700}
        height={700}
        quality={100}
        title={name}
        alt={name}
        className="object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md"
      />
      <p>{description}</p>
    </div>
  );
}

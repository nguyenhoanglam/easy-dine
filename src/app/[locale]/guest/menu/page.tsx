import MenuOrders from "@/app/[locale]/guest/menu/menu-orders";
import { setPageLocale } from "@/services/locales";
import { PageProps } from "@/types/others";

export default function GuestMenuPage({ params }: PageProps) {
  setPageLocale(params);

  return (
    <div className="max-w-[400px] mx-auto space-y-4">
      <h1 className="text-center text-xl font-bold">🍕 Menu quán</h1>
      <MenuOrders />;
    </div>
  );
}

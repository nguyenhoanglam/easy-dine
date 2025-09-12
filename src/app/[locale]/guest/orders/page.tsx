import OrderList from "@/app/[locale]/guest/orders/order-list";
import { setPageLocale } from "@/services/locales";
import { PageProps } from "@/types/others";

export default function GuestOrdersPage({ params }: PageProps) {
  setPageLocale(params);

  return (
    <div className="max-w-[400px] mx-auto space-y-4">
      <h1 className="text-center text-xl font-bold">Đơn hàng</h1>
      <OrderList />
    </div>
  );
}

import GuestLoginForm from "@/app/[locale]/(public)/tables/[number]/guest-login-form";
import { setPageLocale } from "@/services/locales";
import { PageProps } from "@/types/others";

export default function TableNumberPage({ params }: PageProps) {
  setPageLocale(params);

  return <GuestLoginForm />;
}

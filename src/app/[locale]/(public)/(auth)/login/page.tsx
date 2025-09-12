import { setPageLocale } from "@/services/locales";
import { PageProps } from "@/types/others";

import LoginForm from "./login-form";

export default function LoginPage({ params }: PageProps) {
  setPageLocale(params);

  return (
    <div className="flex justify-center items-center flex-1">
      <LoginForm />
    </div>
  );
}

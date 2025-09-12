"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useRouter } from "@/i18n/navigation";
import { SearchParamKey } from "@/lib/constants";
import { useLogoutMutation } from "@/queries/auth";
import { checkAndRefreshToken } from "@/services/auth";
import { getLocalStorage, removeAuthLocalStorage } from "@/services/storage";

export default function RefreshToken() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync } = useLogoutMutation();

  const refreshToken = searchParams.get(SearchParamKey.RefreshToken);
  const redirectPathname = searchParams.get(SearchParamKey.Redirect);

  useEffect(() => {
    if (refreshToken && refreshToken === getLocalStorage("refresh_token")) {
      checkAndRefreshToken({
        onSuccess: () => router.push(redirectPathname || "/"),
        onError: async () => {
          await mutateAsync();

          removeAuthLocalStorage();
          router.push("/login");
        },
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, redirectPathname, refreshToken, router]);

  return <div>Vui lòng chờ...</div>;
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { checkAndRefreshToken } from "@/helpers/auth";
import { getLocalStorage, removeAuthLocalStorage } from "@/helpers/storage";
import { SearchParamKey } from "@/lib/constants";
import { useLogoutMutation } from "@/queries/auth";

export default function RefreshTokenPage() {
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

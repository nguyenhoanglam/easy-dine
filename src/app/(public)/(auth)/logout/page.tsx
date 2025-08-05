"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { SearchParamKey } from "@/lib/constants";
import { useLogoutMutation } from "@/queries/auth";
import { createUniqueRunning } from "@/utils/common";
import { getLocalStorage, removeLocalStorage } from "@/utils/storage";

export default function LogoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync } = useLogoutMutation();

  const refreshTokenParam = searchParams.get(SearchParamKey.RefreshToken);

  useEffect(() => {
    // Do not allow logout if the refresh token is not provided or does not match
    if (
      !refreshTokenParam ||
      refreshTokenParam !== getLocalStorage("refresh_token")
    ) {
      router.push("/login");
      return;
    }

    const logout = createUniqueRunning(async () => {
      await mutateAsync();

      removeLocalStorage("access_token");
      removeLocalStorage("refresh_token");
      removeLocalStorage("account");

      router.push("/login");
    });

    logout();
  }, [mutateAsync, refreshTokenParam, router]);

  return <div>Đang đăng xuất...</div>;
}

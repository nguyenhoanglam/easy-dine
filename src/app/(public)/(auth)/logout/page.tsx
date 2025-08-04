"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useLogoutMutation } from "@/hooks/auth";
import { StorageKey } from "@/lib/constants";
import { getLocalStorage, removeLocalStorage } from "@/lib/utils";

export default function LogoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync } = useLogoutMutation();
  const isMutatingRef = useRef(false);

  const refreshTokenParam = searchParams.get(StorageKey.RefreshToken);

  useEffect(() => {
    async function logout() {
      isMutatingRef.current = true;

      await mutateAsync();

      isMutatingRef.current = false;

      removeLocalStorage("access_token");
      removeLocalStorage("refresh_token");
      removeLocalStorage("account");

      router.push("/login");
    }

    if (isMutatingRef.current) {
      return;
    }

    // Do not allow logout if the refresh token is not provided or does not match
    if (
      !refreshTokenParam ||
      refreshTokenParam !== getLocalStorage("refresh_token")
    ) {
      router.push("/login");
      return;
    }

    logout();
  }, [mutateAsync, refreshTokenParam, router]);

  return <div>Đang đăng xuất...</div>;
}

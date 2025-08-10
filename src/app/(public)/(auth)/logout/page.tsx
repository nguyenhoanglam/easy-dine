"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuthContext } from "@/components/app-provider";
import { getLocalStorage } from "@/helpers/storage";
import { SearchParamKey } from "@/lib/constants";
import { useLogoutMutation } from "@/queries/auth";

export default function LogoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoggedIn } = useAuthContext();
  const { mutateAsync } = useLogoutMutation();
  const isMutatingRef = useRef(false);

  const refreshTokenParam = searchParams.get(SearchParamKey.RefreshToken);

  useEffect(() => {
    if (
      !isMutatingRef.current &&
      refreshTokenParam &&
      refreshTokenParam === getLocalStorage("refresh_token")
    ) {
      isMutatingRef.current = true;
      mutateAsync().finally(() => {
        setLoggedIn(false);
        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, refreshTokenParam, router, setLoggedIn]);

  return <div>Đang đăng xuất...</div>;
}

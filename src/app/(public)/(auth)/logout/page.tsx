"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import { useAppStore } from "@/components/app-provider";
import { getLocalStorage } from "@/helpers/storage";
import { SearchParamKey } from "@/lib/constants";
import { useLogoutMutation } from "@/queries/auth";

function Logout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRole, disconnectSocket } = useAppStore();
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
        isMutatingRef.current = false;
        disconnectSocket();
        setRole(null);

        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [disconnectSocket, mutateAsync, refreshTokenParam, router, setRole]);

  return <div>Đang đăng xuất...</div>;
}

export default function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  );
}

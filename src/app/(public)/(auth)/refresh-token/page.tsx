"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { SearchParamKey } from "@/lib/constants";
import { getLocalStorage } from "@/utils/storage";
import { checkAndRefreshToken } from "@/utils/token";

export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const refreshToken = searchParams.get(SearchParamKey.RefreshToken);
  const redirectPathname = searchParams.get(SearchParamKey.Redirect);

  useEffect(() => {
    if (refreshToken && refreshToken === getLocalStorage("refresh_token")) {
      checkAndRefreshToken({
        onSuccess: () => router.push(redirectPathname || "/"),
      });
    }
  }, [redirectPathname, refreshToken, router]);

  return <div>Vui lòng chờ...</div>;
}

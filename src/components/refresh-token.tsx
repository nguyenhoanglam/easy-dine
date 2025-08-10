"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { checkAndRefreshToken } from "@/helpers/auth";

const AUTH_ROUTES = ["/login", "/logout", "/refresh-token"];
const INTERVAL_TIME = 5 * 60 * 1000; // 5 minutes - change this value as needed

export default function RefreshToken() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (AUTH_ROUTES.includes(pathname)) {
      return;
    }

    let intervalId: number | undefined;

    function onError() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }

      router.push("/login");
    }

    checkAndRefreshToken({ onError });
    setInterval(() => checkAndRefreshToken({ onError }), INTERVAL_TIME);

    return () => clearInterval(intervalId);
  }, [pathname, router]);

  return null;
}

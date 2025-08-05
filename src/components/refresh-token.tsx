"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { checkAndRefreshToken } from "@/utils/token";

const AUTH_ROUTES = ["/login", "/logout", "/refresh-token"];
const INTERVAL_TIME = 5 * 60 * 1000; // 5 minutes

export default function RefreshToken() {
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
    }

    checkAndRefreshToken({ onError });
    setInterval(() => checkAndRefreshToken({ onError }), INTERVAL_TIME);

    return () => clearInterval(intervalId);
  }, [pathname]);

  return null;
}

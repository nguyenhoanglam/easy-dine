"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAppStore } from "@/components/app-provider";
import { checkAndRefreshToken } from "@/helpers/auth";
import { SocketEvent } from "@/lib/constants";

const AUTH_ROUTES = ["/login", "/logout", "/refresh-token"];
const INTERVAL_TIME = 5 * 60 * 1000; // 5 minutes - change this value as needed

export default function RefreshToken() {
  const { socket, disconnectSocket } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (AUTH_ROUTES.includes(pathname)) {
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | undefined;

    function onError() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }

      disconnectSocket();

      router.push("/login");
    }

    function onRefreshToken(force: boolean = false) {
      checkAndRefreshToken({ onError, force });
    }

    onRefreshToken();
    intervalId = setInterval(onRefreshToken, INTERVAL_TIME);

    // Socket.io
    function onConnect() {
      console.log("Socket connected:", socket?.id);
    }

    function onDisconnect() {
      console.log("Socket disconnected");
    }

    function onForceRefreshToken() {
      onRefreshToken(true);
    }

    socket?.on(SocketEvent.Connect, onConnect);
    socket?.on(SocketEvent.Disconnect, onDisconnect);
    socket?.on(SocketEvent.RefreshToken, onForceRefreshToken);

    return () => {
      socket?.off(SocketEvent.Connect, onConnect);
      socket?.off(SocketEvent.Disconnect, onDisconnect);
      socket?.off(SocketEvent.RefreshToken, onForceRefreshToken);

      clearInterval(intervalId);
    };
  }, [disconnectSocket, pathname, router, socket]);

  return null;
}

import { useEffect } from "react";

import { useAppStore } from "@/components/app-provider";
import { usePathname, useRouter } from "@/i18n/navigation";
import { SocketEvent } from "@/lib/constants";
import { useLogoutMutation } from "@/queries/auth";

const AUTH_ROUTES = ["/login", "/logout", "/refresh-token"];

export default function SocketListener() {
  const { socket, setRole, disconnectSocket } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const { isPending, mutateAsync } = useLogoutMutation();

  useEffect(() => {
    if (AUTH_ROUTES.includes(pathname)) {
      return;
    }

    async function onLogout() {
      if (isPending) {
        return;
      }

      await mutateAsync();

      disconnectSocket();
      setRole(null);

      router.push("/");
    }

    socket?.on(SocketEvent.Logout, onLogout);

    return () => {
      socket?.off(SocketEvent.RefreshToken, onLogout);
    };
  }, [
    disconnectSocket,
    isPending,
    mutateAsync,
    pathname,
    router,
    setRole,
    socket,
  ]);

  return null;
}

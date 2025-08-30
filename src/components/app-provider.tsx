"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Socket } from "socket.io-client";
import { create } from "zustand";

import RefreshToken from "@/components/refresh-token";
import SocketListener from "@/components/socket-listener";
import { getLocalStorage, removeAuthLocalStorage } from "@/helpers/storage";
import { createSocket } from "@/lib/socket";
import { decodeToken } from "@/lib/utils";
import { Role } from "@/types/others";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

type AppState = {
  role: Role | null;
  setRole: (role: Role | null) => void;
  socket: Socket | undefined;
  setSocket: (socket?: Socket) => void;
  disconnectSocket: () => void;
};

function getInitialStateValues() {
  const accessToken = getLocalStorage("access_token");
  const refreshToken = getLocalStorage("refresh_token");
  const role = refreshToken ? decodeToken(refreshToken)?.role || null : null;
  const socket = accessToken ? createSocket(accessToken) : undefined;

  return { role, socket };
}

export const useAppStore = create<AppState>()((set) => {
  const { role, socket } = getInitialStateValues();

  return {
    role,
    socket,
    setRole: (role) => {
      set({ role });
      if (!role) {
        removeAuthLocalStorage();
      }
    },
    setSocket: (socket) => set({ socket }),
    disconnectSocket: () =>
      set((state) => {
        state.socket?.disconnect();
        return { socket: undefined };
      }),
  };
});

export default function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <SocketListener />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

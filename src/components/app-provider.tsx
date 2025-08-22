"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import RefreshToken from "@/components/refresh-token";
import { getLocalStorage, removeAuthLocalStorage } from "@/helpers/storage";
import { decodeToken } from "@/lib/utils";
import { Role } from "@/types/others";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

type AuthContextType = {
  role: Role | null;
  setRole: (role: Role | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  role: null,
  setRole: () => {},
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AppProvider");
  }

  return context;
};

export default function AppProvider({ children }: React.PropsWithChildren) {
  const [role, setUserRole] = useState<Role | null>(() => {
    const refreshToken = getLocalStorage("refresh_token");

    if (!refreshToken) {
      return null;
    }

    return decodeToken(refreshToken)?.role || null;
  });

  const setRole = useCallback((role: Role | null) => {
    setUserRole(role);

    if (!role) {
      removeAuthLocalStorage();
    }
  }, []);

  const authContextValue = useMemo(() => {
    return {
      role,
      setRole,
    };
  }, [role, setRole]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryOnMount: false,
    },
  },
});

type AuthContextType = {
  isLoggedIn: boolean;
  setLoggedIn: (isLoggedIn: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setLoggedIn: () => {},
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AppProvider");
  }

  return context;
};

export default function AppProvider({ children }: React.PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const refreshToken = getLocalStorage("refresh_token");
    return !!refreshToken;
  });

  const setLoggedIn = useCallback((value: boolean) => {
    setIsLoggedIn(value);

    if (!value) {
      removeAuthLocalStorage();
    }
  }, []);

  const authContextValue = useMemo(() => {
    return {
      isLoggedIn,
      setLoggedIn,
    };
  }, [isLoggedIn, setLoggedIn]);

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

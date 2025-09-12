"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { useAppStore } from "@/components/app-provider";
import { useRouter } from "@/i18n/navigation";
import { createSocket } from "@/lib/socket";
import { decodeToken } from "@/lib/utils";
import { useSetTokensToCookieMutation } from "@/queries/auth";
import { setAuthLocalStorage } from "@/services/storage";

function OAuth() {
  const { setRole, setSocket } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const [message, setMessage] = useState(searchParams.get("message") || "");

  const { mutateAsync, isSuccess } = useSetTokensToCookieMutation();

  useEffect(() => {
    if (isSuccess) {
      return;
    }

    if (accessToken && refreshToken) {
      const payload = decodeToken(accessToken);
      if (payload) {
        mutateAsync({ accessToken, refreshToken }).then((response) => {
          if (response.ok) {
            setRole(payload.role);
            setAuthLocalStorage({ accessToken, refreshToken });
            setSocket(createSocket(accessToken));

            router.push("/manage/dashboard");
          } else {
            toast.error(response.message, { richColors: true });
            setMessage(response.message);
          }
        });
      }
    } else {
      toast.error(message, { richColors: true });
    }
  }, [
    accessToken,
    refreshToken,
    message,
    router,
    setRole,
    setSocket,
    mutateAsync,
    isSuccess,
  ]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-lg">{message || "Đang xử lý đăng nhập..."}</div>
    </div>
  );
}

export default function OAuthPage() {
  return (
    <Suspense>
      <OAuth />
    </Suspense>
  );
}

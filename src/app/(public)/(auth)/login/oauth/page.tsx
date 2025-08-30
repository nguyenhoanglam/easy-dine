"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAppStore } from "@/components/app-provider";
import { setAuthLocalStorage } from "@/helpers/storage";
import { createSocket } from "@/lib/socket";
import { decodeToken } from "@/lib/utils";
import { useSetTokensToCookieMutation } from "@/queries/auth";

export default function OauthPage() {
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
        console.log(payload);
        mutateAsync({ accessToken, refreshToken }).then((response) => {
          console.log(response);
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

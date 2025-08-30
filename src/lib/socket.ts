import { io } from "socket.io-client";

import { env } from "@/lib/env";

export function createSocket(accessToken: string) {
  return io(env.NEXT_PUBLIC_API_URL, {
    auth: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

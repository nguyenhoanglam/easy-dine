import { io } from "socket.io-client";

import { getLocalStorage } from "@/helpers/storage";
import { env } from "@/lib/env";

const socket = io(env.NEXT_PUBLIC_API_URL, {
  auth: {
    Authorization: `Bearer ${getLocalStorage("access_token")}`,
  },
});

export default socket;

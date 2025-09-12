import { refreshTokenAction } from "@/actions/auth";
import { guestRefreshTokenAction } from "@/actions/guest";
import { decodeToken } from "@/lib/utils";
import {
  getLocalStorage,
  removeAuthLocalStorage,
  setAuthLocalStorage,
} from "@/services/storage";

type RefreshTokenActionPromise = ReturnType<typeof refreshTokenAction> | null;

let refreshTokenActionPromise: RefreshTokenActionPromise = null;

export async function checkAndRefreshToken({
  onSuccess,
  onError,
  force,
}: {
  onSuccess?: () => void;
  onError?: () => void;
  force?: boolean;
}) {
  try {
    const accessToken = getLocalStorage("access_token");
    const refreshToken = getLocalStorage("refresh_token");

    if (!accessToken || !refreshToken) {
      return;
    }

    const decodedAccessToken = decodeToken(accessToken)!;
    const decodedRefreshToken = decodeToken(refreshToken)!;
    const now = Date.now() / 1000 - 1; // Subtract 1 second to ensure the token is deleted before calling refresh token API
    // If the access token is expired, do not refresh
    if (now >= decodedRefreshToken.exp) {
      removeAuthLocalStorage();
      onError?.();

      return;
    }

    if (
      force ||
      decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
    ) {
      // If the action is already in progress, use the existing one
      // to avoid multiple requests when navigate to other pages
      let action: RefreshTokenActionPromise;

      if (refreshTokenActionPromise) {
        action = refreshTokenActionPromise;
      } else {
        action =
          decodedRefreshToken.role === "Guest"
            ? guestRefreshTokenAction()
            : refreshTokenAction();
        refreshTokenActionPromise = action;
      }

      const response = await action;
      refreshTokenActionPromise = null;

      if (!response.ok) {
        onError?.();
        return;
      }

      if (response.ok) {
        const { accessToken, refreshToken } = response.data;
        setAuthLocalStorage({ accessToken, refreshToken });
        onSuccess?.();
      }
    }
  } catch (error) {
    console.log("Request refresh token error:", error);
    onError?.();
  }
}

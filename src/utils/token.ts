import { refreshTokenAction } from "@/actions/auth";
import { decodeJWT } from "@/utils/common";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";

type RefreshTokenActionPromise = ReturnType<typeof refreshTokenAction> | null;

let refreshTokenActionPromise: RefreshTokenActionPromise = null;

export async function checkAndRefreshToken({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  try {
    const accessToken = getLocalStorage("access_token");
    const refreshToken = getLocalStorage("refresh_token");

    if (!accessToken || !refreshToken) {
      return;
    }

    const decodedAccessToken = decodeJWT(accessToken)!;
    const decodedRefreshToken = decodeJWT(refreshToken)!;
    const now = Date.now() / 1000;

    // If the access token is expired, do not refresh
    if (decodedRefreshToken.exp <= now) {
      return;
    }

    if (
      decodedAccessToken.exp - now <
      (decodedAccessToken.exp - decodedAccessToken.iat) / 3
    ) {
      // If the action is already in progress, use the existing one
      // to avoid multiple requests when navigate to other pages
      let action: RefreshTokenActionPromise;

      if (refreshTokenActionPromise) {
        action = refreshTokenActionPromise;
      } else {
        action = refreshTokenAction();
        refreshTokenActionPromise = action;
      }

      const response = await action;

      refreshTokenActionPromise = null;

      if (!response.ok) {
        onError?.();
        return;
      }

      if (response.ok) {
        setLocalStorage("access_token", response.data.accessToken);
        setLocalStorage("refresh_token", response.data.refreshToken);
        onSuccess?.();
      }
    }
  } catch (error) {
    console.log("Request refresh token error:", error);
    onError?.();
  }
}

import { useMutation } from "@tanstack/react-query";

import {
  loginAction,
  logoutAction,
  refreshTokenAction,
  setTokensToCookieAction,
} from "@/actions/auth";

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginAction,
  });
}

export function useSetTokensToCookieMutation() {
  return useMutation({
    mutationFn: setTokensToCookieAction,
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logoutAction,
  });
}

export function useRefreshTokenMutation() {
  return useMutation({
    mutationFn: refreshTokenAction,
  });
}

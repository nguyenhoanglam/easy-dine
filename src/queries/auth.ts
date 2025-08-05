import { useMutation } from "@tanstack/react-query";

import { loginAction, logoutAction, refreshTokenAction } from "@/actions/auth";

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginAction,
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

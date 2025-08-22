import { useMutation, useQuery } from "@tanstack/react-query";

import {
  guestCreateOrdersAction,
  guestGetOrderListAction,
  guestLoginAction,
  guestLogoutAction,
  guestRefreshTokenAction,
} from "@/actions/guest";

const QueryKey = {
  GuestOrders: "guest-orders",
} as const;

export function useGuestLoginMutation() {
  return useMutation({
    mutationFn: guestLoginAction,
  });
}

export function useGuestLogoutMutation() {
  return useMutation({
    mutationFn: guestLogoutAction,
  });
}

export function useGuestRefreshTokenMutation() {
  return useMutation({
    mutationFn: guestRefreshTokenAction,
  });
}

export function useGuestOrderListQuery() {
  return useQuery({
    queryKey: [QueryKey.GuestOrders],
    queryFn: guestGetOrderListAction,
  });
}

export function useGuestCreateOrdersMutation() {
  return useMutation({
    mutationFn: guestCreateOrdersAction,
  });
}

import { useMutation, useQuery } from "@tanstack/react-query";

import {
  guestCreateOrdersAction,
  guestGetOrderListAction,
  guestLoginAction,
  guestLogoutAction,
  guestRefreshTokenAction,
} from "@/actions/guest";

const QueryKeys = {
  GuestOrders: "guest-orders",
};

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

export function useGuestGetOrderListQuery() {
  return useQuery({
    queryKey: [QueryKeys.GuestOrders],
    queryFn: guestGetOrderListAction,
  });
}

export function useGuestCreateOrdersMutation() {
  return useMutation({
    mutationFn: guestCreateOrdersAction,
  });
}

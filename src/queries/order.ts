import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createOrdersAction,
  getOrderDetailAction,
  getOrderListAction,
  payGuestOrdersAction,
  updateOrderAction,
} from "@/actions/order";
import { GetOrderListQueryParams, UpdateOrderReqBody } from "@/types/order";

const QueryKey = {
  Orders: "orders",
} as const;

export function useOrderListQuery(params: GetOrderListQueryParams) {
  return useQuery({
    queryKey: [QueryKey.Orders, params],
    queryFn: async () => getOrderListAction(params),
  });
}

export function useOrderDetailQuery(orderId?: number) {
  return useQuery({
    queryKey: [QueryKey.Orders, orderId],
    queryFn: () => getOrderDetailAction(orderId!),
    enabled: orderId !== undefined && orderId !== null,
  });
}

export function useCreateOrdersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrdersAction,
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Orders] });
      }
    },
  });
}

export function useUpdateOrderMutation() {
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: number;
      body: UpdateOrderReqBody;
    }) => updateOrderAction(id, body),
  });
}

export function usePayGuestOrdersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payGuestOrdersAction,
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Orders],
          exact: true,
        });
      }
    },
  });
}

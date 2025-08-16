import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { gestOrderListAction, updateOrderAction } from "@/actions/order";
import { UpdateOrderReqBody } from "@/types/order";

const QueryKeys = {
  Orders: "orders",
};

export function useGetOrderListQuery() {
  return useQuery({
    queryKey: [QueryKeys.Orders],
    queryFn: gestOrderListAction,
  });
}

export function useUpdateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      body,
    }: {
      orderId: number;
      body: UpdateOrderReqBody;
    }) => updateOrderAction(orderId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Orders] });
    },
  });
}

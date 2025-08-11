import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDishAction,
  deleteDishAction,
  getDishDetailAction,
  getDishListAction,
  updateDishAction,
} from "@/actions/dish";
import { UpdateDishReqBody } from "@/types/dish";
import { PaginationParams } from "@/types/others";

const QueryKeys = {
  Dishes: "dishes",
};

export function useDishListQuery(params: PaginationParams) {
  return useQuery({
    queryKey: [QueryKeys.Dishes, params],
    queryFn: async () => getDishListAction(params),
  });
}

export function useDishQuery(id: number | undefined) {
  return useQuery({
    queryKey: [QueryKeys.Dishes, id],
    queryFn: () => getDishDetailAction(id!),
    enabled: id !== undefined && id !== null,
  });
}

export function useCreateDishMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDishAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Dishes],
        exact: true,
      });
    },
  });
}

export function useUpdateDishMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: UpdateDishReqBody }) =>
      updateDishAction(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Dishes],
        exact: true,
      });
    },
  });
}

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => deleteDishAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Dishes],
        exact: true,
      });
    },
  });
};

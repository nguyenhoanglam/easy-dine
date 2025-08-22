import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDishAction,
  deleteDishAction,
  getDishDetailAction,
  getDishListAction,
  getPaginatedDishListAction,
  updateDishAction,
} from "@/actions/dish";
import { UpdateDishReqBody } from "@/types/dish";
import { PaginationParams } from "@/types/others";

const QueryKey = {
  Dishes: "dishes",
} as const;

export function useDishListQuery() {
  return useQuery({
    queryKey: [QueryKey.Dishes],
    queryFn: getDishListAction,
  });
}

export function usePaginatedDishListQuery(params: PaginationParams) {
  return useQuery({
    queryKey: [QueryKey.Dishes, params],
    queryFn: async () => getPaginatedDishListAction(params),
  });
}

export function useDishQuery(id: number | undefined) {
  return useQuery({
    queryKey: [QueryKey.Dishes, id],
    queryFn: () => getDishDetailAction(id!),
    enabled: id !== undefined && id !== null,
  });
}

export function useCreateDishMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDishAction,
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Dishes] });
      }
    },
  });
}

export function useUpdateDishMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: UpdateDishReqBody }) =>
      updateDishAction(id, body),
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Dishes] });
      }
    },
  });
}

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => deleteDishAction(id),
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Dishes] });
      }
    },
  });
};

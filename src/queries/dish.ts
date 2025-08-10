import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDishAction,
  deleteDishAction,
  getDishListAction,
  updateDishAction,
} from "@/actions/dish";
import { UpdateDishReqBody } from "@/types/dish";

const QueryKeys = {
  Dishes: "dishes",
};

export function useDishListQuery() {
  console.log("fecth");
  return useQuery({
    queryKey: [QueryKeys.Dishes],
    queryFn: getDishListAction,
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

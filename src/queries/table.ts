import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTableAction,
  deleteTableAction,
  getTableDetailAction,
  getTableListAction,
  updateTableAction,
} from "@/actions/table";
import { UpdateTableReqBody } from "@/types/table";

const QueryKeys = {
  Tables: "tables",
};

export function useTableListQuery() {
  return useQuery({
    queryKey: [QueryKeys.Tables],
    queryFn: getTableListAction,
  });
}

export function useTableQuery(number: number | undefined) {
  return useQuery({
    queryKey: [QueryKeys.Tables, number],
    queryFn: () => getTableDetailAction(number!),
    enabled: number !== undefined && number !== null,
  });
}

export function useCreateTableMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTableAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Tables],
        exact: true,
      });
    },
  });
}

export function useUpdateTableMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      number,
      body,
    }: {
      number: number;
      body: UpdateTableReqBody;
    }) => updateTableAction(number, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Tables],
        exact: true,
      });
    },
  });
}

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (number: number) => deleteTableAction(number),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Tables],
        exact: true,
      });
    },
  });
};

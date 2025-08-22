import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTableAction,
  deleteTableAction,
  getTableDetailAction,
  getTableListAction,
  updateTableAction,
} from "@/actions/table";
import { UpdateTableReqBody } from "@/types/table";

const QueryKey = {
  Tables: "tables",
} as const;

export function useTableListQuery() {
  return useQuery({
    queryKey: [QueryKey.Tables],
    queryFn: getTableListAction,
  });
}

export function useTableQuery(number: number | undefined) {
  return useQuery({
    queryKey: [QueryKey.Tables, number],
    queryFn: () => getTableDetailAction(number!),
    enabled: number !== undefined && number !== null,
  });
}

export function useCreateTableMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTableAction,
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Tables],
          exact: true,
        });
      }
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
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Tables],
          exact: true,
        });
      }
    },
  });
}

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (number: number) => deleteTableAction(number),
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Tables],
          exact: true,
        });
      }
    },
  });
};

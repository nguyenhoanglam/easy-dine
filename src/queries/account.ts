import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const QueryKeys = {
  Profile: "profile",
  Accounts: "accounts",
};

import {
  changePasswordAction,
  createEmployeeAccountAction,
  deleteEmployeeAccountAction,
  getAccountListAction,
  getAccountProfileAction,
  getProfileAction,
  updateEmployeeAccountAction,
  updateProfileAction,
} from "@/actions/account";
import {
  CreateEmployeeAccountReqBody,
  UpdateEmployeeAccountReqBody,
} from "@/types/account";

export function useProfileQuery() {
  return useQuery({
    queryKey: [QueryKeys.Profile],
    queryFn: getProfileAction,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Profile],
        exact: true,
      });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: changePasswordAction,
  });
}

export function useAccountListQuery() {
  return useQuery({
    queryKey: [QueryKeys.Accounts],
    queryFn: getAccountListAction,
  });
}

export function useAccountQuery(id: number | undefined) {
  return useQuery({
    queryKey: [QueryKeys.Accounts, id],
    queryFn: async () => getAccountProfileAction(id!),
    enabled: id !== undefined && id !== null,
  });
}

export function useCreateEmployeeAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateEmployeeAccountReqBody) =>
      createEmployeeAccountAction(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Accounts],
        exact: true,
      });
    },
  });
}

export const useUpdateEmployeeAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: UpdateEmployeeAccountReqBody;
    }) => updateEmployeeAccountAction(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Accounts],
        exact: true,
      });
    },
  });
};

export const useDeleteEmployeeAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteEmployeeAccountAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Accounts],
        exact: true,
      });
    },
  });
};

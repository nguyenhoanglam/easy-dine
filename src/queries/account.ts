import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const QueryKey = {
  Profile: "profile",
  Accounts: "accounts",
  Guests: "guests",
} as const;

import {
  changePasswordAction,
  createEmployeeAccountAction,
  createGuestAccountAction,
  deleteEmployeeAccountAction,
  getAccountListAction,
  getAccountProfileAction,
  getGuestListAction,
  getProfileAction,
  updateEmployeeAccountAction,
  updateProfileAction,
} from "@/actions/account";
import {
  CreateEmployeeAccountReqBody,
  GuestListQueryParams,
  UpdateEmployeeAccountReqBody,
} from "@/types/account";

export function useProfileQuery() {
  return useQuery({
    queryKey: [QueryKey.Profile],
    queryFn: getProfileAction,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileAction,
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Profile],
          exact: true,
        });
      }
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
    queryKey: [QueryKey.Accounts],
    queryFn: getAccountListAction,
  });
}

export function useAccountQuery(id: number | undefined) {
  return useQuery({
    queryKey: [QueryKey.Accounts, id],
    queryFn: async () => getAccountProfileAction(id!),
    enabled: id !== undefined && id !== null,
  });
}

export function useCreateEmployeeAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateEmployeeAccountReqBody) =>
      createEmployeeAccountAction(body),
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Accounts],
          exact: true,
        });
      }
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
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Accounts],
          exact: true,
        });
      }
    },
  });
};

export const useDeleteEmployeeAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteEmployeeAccountAction(id),
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Accounts],
          exact: true,
        });
      }
    },
  });
};

export function useCreateGuestAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGuestAccountAction,
    onSettled: (data) => {
      if (data?.ok) {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.Guests],
          exact: true,
        });
      }
    },
  });
}

export function useGuestListQuery(params?: GuestListQueryParams) {
  return useQuery({
    queryKey: [QueryKey.Guests, params],
    queryFn: async () => getGuestListAction(params),
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  changePasswordAction,
  getProfileAction,
  updateProfileAction,
} from "@/actions/account";

export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await getProfileAction();

      if (!res.ok) {
        return null;
      }

      return res.data;
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: changePasswordAction,
  });
}

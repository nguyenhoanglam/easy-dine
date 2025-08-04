import { useMutation } from "@tanstack/react-query";

import { uploadMediaAction } from "@/actions/media";

export function useUploadImageMutation() {
  return useMutation({
    mutationFn: uploadMediaAction,
  });
}

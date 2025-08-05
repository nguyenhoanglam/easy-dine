import type { ClassValue, clsx } from "clsx";
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { HttpStatus } from "@/lib/constants";
import { HttpError, HttpResponse } from "@/types/http";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
 * Show success and error messages based on the HTTP response.
 */
export function showResponseError<T extends FieldValues>(
  response: HttpError,
  options?: {
    showToast?: boolean;
    setFormError?: UseFormSetError<T>;
  },
) {
  const { showToast = true, setFormError } = options || {};

  if (showToast) {
    toast.error(response.message, { richColors: true });
  }

  if (response.status === HttpStatus.UnprocessableEntity && setFormError) {
    response.errors?.forEach((err) => {
      setFormError(err.field as FieldPath<T>, {
        type: "server",
        message: err.message,
      });
    });
  }
}

export function showResponseSuccess(response: HttpResponse) {
  toast.success(response.message, { richColors: true });
}

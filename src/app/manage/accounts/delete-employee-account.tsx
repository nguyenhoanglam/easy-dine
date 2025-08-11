import React from "react";

import { Button } from "@/components";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { showResponseError, showResponseSuccess } from "@/lib/utils";
import { useDeleteEmployeeAccountMutation } from "@/queries/account";
import { Account } from "@/types/account";

interface Props {
  employee: Account | null;
  setEmployee: (value: Account | null) => void;
}

export default function DeleteEmployeeAccount({
  employee,
  setEmployee,
}: Props) {
  const { mutateAsync, isPending } = useDeleteEmployeeAccountMutation();

  const handleDelete = async () => {
    if (!employee) {
      return;
    }

    const response = await mutateAsync(employee.id);

    if (!response.ok) {
      showResponseError(response);
      return;
    }

    setEmployee(null);
    showResponseSuccess(response);
  };

  return (
    <AlertDialog
      open={!!employee}
      onOpenChange={(value) => {
        if (!value) {
          setEmployee(null);
        }
      }}
    >
      <AlertDialogContent onEscapeKeyDown={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản{" "}
            <strong className="text-foreground">{employee?.name}</strong> sẽ bị
            xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button.Cancel disabled={isPending}>Hủy</Button.Cancel>
          </AlertDialogCancel>
          <Button loading={isPending} onClick={handleDelete}>
            Xóa
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

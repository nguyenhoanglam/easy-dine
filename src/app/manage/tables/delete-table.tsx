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
import { useDeleteTableMutation } from "@/queries/table";
import { Table } from "@/types/table";

type Props = {
  table: Table | null;
  setTable: (value: Table | null) => void;
};

export default function DeleteTable({ table, setTable }: Props) {
  const { mutateAsync, isPending } = useDeleteTableMutation();

  const handleDelete = async () => {
    if (!table) {
      return;
    }

    const response = await mutateAsync(table.number);

    if (!response.ok) {
      showResponseError(response);
      return;
    }

    setTable(null);
    showResponseSuccess(response);
  };

  return (
    <AlertDialog
      open={!!table}
      onOpenChange={(value) => {
        if (!value) {
          setTable(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bàn ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Bàn <strong className="text-foreground">{table?.number}</strong> sẽ
            bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button loading={isPending} onClick={handleDelete}>
            Xóa
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

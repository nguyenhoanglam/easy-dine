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
import { useDeleteDishMutation } from "@/queries/dish";
import { Dish } from "@/types/dish";

type Props = {
  dish: Dish | null;
  setDish: (value: Dish | null) => void;
};

export default function DeleteDish({ dish, setDish }: Props) {
  const { mutateAsync, isPending } = useDeleteDishMutation();

  const handleDelete = async () => {
    if (!dish) {
      return;
    }

    const response = await mutateAsync(dish.id);

    if (!response.ok) {
      showResponseError(response);
      return;
    }

    setDish(null);
    showResponseSuccess(response);
  };

  return (
    <AlertDialog
      open={!!dish}
      onOpenChange={(value) => {
        if (!value) {
          setDish(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa món ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Món <strong className="text-foreground">{dish?.name}</strong> sẽ bị
            xóa vĩnh viễn
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

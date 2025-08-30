"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Role, RoleValues } from "@/lib/constants";
import { showResponseError, showResponseSuccess } from "@/lib/utils";
import {
  useAccountQuery,
  useUpdateEmployeeAccountMutation,
} from "@/queries/account";
import { useUploadImageMutation } from "@/queries/media";
import { updateEmployeeAccountSchema } from "@/schemas/account";
import { UpdateEmployeeAccountReqBody } from "@/types/account";

const DEFAULT_VALUES: UpdateEmployeeAccountReqBody = {
  name: "",
  email: "",
  avatar: null,
  changePassword: false,
  password: undefined,
  confirmPassword: undefined,
  role: Role.Employee,
};

type Props = {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditEmployeeAccount({
  id,
  setId,
  onSubmitSuccess,
}: Props) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const accountQuery = useAccountQuery(id);
  const uploadMediaMutation = useUploadImageMutation();
  const updateEmployeeAccountMutation = useUpdateEmployeeAccountMutation();

  const form = useForm<UpdateEmployeeAccountReqBody>({
    resolver: zodResolver(updateEmployeeAccountSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const avatar = form.watch("avatar");
  const name = form.watch("name");
  const changePassword = form.watch("changePassword");

  const previewAvatar = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }

    return avatar || undefined;
  }, [avatarFile, avatar]);

  useEffect(() => {
    if (accountQuery.data) {
      const response = accountQuery.data;

      if (!response.ok) {
        showResponseError(response);
        return;
      }

      const { name, email, avatar, role } = response.data;
      console.log(response.data);
      form.reset({
        name,
        email,
        avatar: avatar ?? undefined,
        changePassword: form.getValues("changePassword"),
        password: form.getValues("password"),
        confirmPassword: form.getValues("confirmPassword"),
        role: role ?? form.getValues("role"),
      });
    }
  }, [accountQuery.data, form]);

  const reset = () => {
    setId(undefined);
    setAvatarFile(null);
    form.reset(DEFAULT_VALUES);
  };

  const onSubmit = async (data: UpdateEmployeeAccountReqBody) => {
    if (updateEmployeeAccountMutation.isPending) {
      return;
    }

    const body: UpdateEmployeeAccountReqBody = data;

    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);

      const uploadAvatarResponse =
        await uploadMediaMutation.mutateAsync(formData);

      if (!uploadAvatarResponse.ok) {
        showResponseError(uploadAvatarResponse);
        return;
      }

      const avatarURL = uploadAvatarResponse.data;
      body.avatar = avatarURL;
    }

    const updateProfileResponse =
      await updateEmployeeAccountMutation.mutateAsync({ id: id!, body });

    if (!updateProfileResponse.ok) {
      showResponseError(updateProfileResponse, { setFormError: form.setError });
      return;
    }

    reset();
    onSubmitSuccess?.();
    showResponseSuccess(updateProfileResponse);
  };

  return (
    <Dialog
      open={id !== undefined}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật tài khoản</DialogTitle>
          <DialogDescription>
            Các trường tên, email, mật khẩu là bắt buộc
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-employee-form"
            onReset={reset}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className="rounded-none">
                          {name || "Avatar"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAvatarFile(file);
                            field.onChange(
                              "http://localhost:3000/" + file.name,
                            );
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="name" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Email</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="email" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Vai trò</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RoleValues.map((role) => {
                              return role !== Role.Guest ? (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ) : null;
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="changePassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Đổi mật khẩu</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              {changePassword && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="password">Mật khẩu mới</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="password"
                            className="w-full"
                            type="password"
                            autoComplete="new-password"
                            {...field}
                            value={field.value ?? ""}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              {changePassword && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="confirmPassword">
                          Xác nhận mật khẩu mới
                        </Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="confirmPassword"
                            className="w-full"
                            type="password"
                            autoComplete="new-password"
                            {...field}
                            value={field.value ?? ""}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="edit-employee-form"
            loading={form.formState.isSubmitting}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

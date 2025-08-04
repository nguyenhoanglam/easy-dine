"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePasswordMutation } from "@/hooks/account";
import {
  setLocalStorage,
  showResponseError,
  showResponseSuccess,
} from "@/lib/utils";
import { changePasswordSchema } from "@/schemas/account";
import { ChangePasswordReqBody } from "@/types/account";

export default function ChangePasswordForm() {
  const mutation = useChangePasswordMutation();

  const form = useForm<ChangePasswordReqBody>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onReset = () => {
    form.reset();
  };

  const onSubmit = async (data: ChangePasswordReqBody) => {
    if (mutation.isPending) {
      return;
    }

    const response = await mutation.mutateAsync(data);

    if (!response.ok) {
      showResponseError(response, { setFormError: form.setError });
      return;
    }

    const { accessToken, refreshToken, account } = response.data;

    setLocalStorage("access_token", accessToken);
    setLocalStorage("refresh_token", refreshToken);
    setLocalStorage("account", JSON.stringify(account));
    form.reset();
    showResponseSuccess(response);
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onReset={onReset}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        className="w-full"
                        autoComplete="current-password"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Mật khẩu mới</Label>
                      <Input
                        id="password"
                        type="password"
                        className="w-full"
                        autoComplete="new-password"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="confirmPassword">
                        Nhập lại mật khẩu mới
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="w-full"
                        autoComplete="new-password"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className=" items-center gap-2 md:ml-auto flex">
                <Button variant="outline" size="sm" type="reset">
                  Hủy
                </Button>
                <Button size="sm" type="submit">
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

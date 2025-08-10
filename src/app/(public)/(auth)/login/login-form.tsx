"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components";
import { useAuthContext } from "@/components/app-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAuthLocalStorage } from "@/helpers/storage";
import { SearchParamKey } from "@/lib/constants";
import { showResponseError, showResponseSuccess } from "@/lib/utils";
import { useLoginMutation } from "@/queries/auth";
import { loginRequestSchema } from "@/schemas/auth";
import { LoginReqBody } from "@/types/auth";

export default function LoginForm() {
  const router = useRouter();
  const { setLoggedIn } = useAuthContext();
  const loginMutation = useLoginMutation();
  const searchParams = useSearchParams();

  const clearTokens = searchParams.get(SearchParamKey.ClearTokens);

  const form = useForm<LoginReqBody>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: "admin@order.com",
      password: "111111",
    },
  });

  useEffect(() => {
    if (clearTokens === "true") {
      setLoggedIn(false);
    }
  }, [clearTokens, setLoggedIn]);

  const onSubmit = async (data: LoginReqBody) => {
    const response = await loginMutation.mutateAsync(data);

    if (!response.ok) {
      showResponseError(response, { setFormError: form.setError });
      return;
    }

    const { accessToken, refreshToken, account } = response.data;
    setAuthLocalStorage({ accessToken, refreshToken, account });
    showResponseSuccess(response);
    setLoggedIn(true);
    router.push("/manage/dashboard");
  };

  return (
    <Card className="w-full sm:w-[618px] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="w-full"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
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
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                type="submit"
                loading={loginMutation.isPending}
              >
                Đăng nhập
              </Button>
              <Button
                className="w-full"
                type="button"
                variant="outline"
                loading={loginMutation.isPending}
              >
                Đăng nhập với Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

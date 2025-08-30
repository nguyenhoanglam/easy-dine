"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components";
import { useAppStore } from "@/components/app-provider";
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
import { createSocket } from "@/lib/socket";
import {
  getGoogleOauthUrl,
  showResponseError,
  showResponseSuccess,
} from "@/lib/utils";
import { useLoginMutation } from "@/queries/auth";
import { loginRequestSchema } from "@/schemas/auth";
import { LoginReqBody } from "@/types/auth";

function Login() {
  const { setRole, setSocket } = useAppStore();
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const searchParams = useSearchParams();

  const tokenExpired = searchParams.get(SearchParamKey.Token_Expired);

  const form = useForm<LoginReqBody>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: "admin@order.com",
      password: "111111",
    },
  });

  useEffect(() => {
    if (tokenExpired === "true") {
      setRole(null);
    }
  }, [tokenExpired, setRole]);

  const onSubmit = async (data: LoginReqBody) => {
    const response = await loginMutation.mutateAsync(data);

    if (!response.ok) {
      showResponseError(response, { setFormError: form.setError });
      return;
    }

    const { accessToken, refreshToken, account } = response.data;
    setAuthLocalStorage({ accessToken, refreshToken, account });
    setRole(account.role);
    showResponseSuccess(response);
    setSocket(createSocket(accessToken));

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
              <Link href={getGoogleOauthUrl()}>
                <Button
                  className="w-full"
                  type="button"
                  variant="outline"
                  disabled={loginMutation.isPending}
                >
                  Đăng nhập với Google
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function LoginForm() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}

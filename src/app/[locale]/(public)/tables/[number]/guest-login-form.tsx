"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components";
import { useAppStore } from "@/components/app-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { createSocket } from "@/lib/socket";
import { showResponseError } from "@/lib/utils";
import { useGuestLoginMutation } from "@/queries/guest";
import { guestLoginSchema } from "@/schemas/guest";
import { setAuthLocalStorage } from "@/services/storage";
import { GuestLoginReqBody } from "@/types/guest";

function GuestLoginForm() {
  const { setRole, setSocket } = useAppStore();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tableNumber = Number(params.number);
  const token = searchParams.get("token");

  const { mutateAsync, isPending } = useGuestLoginMutation();

  const form = useForm<GuestLoginReqBody>({
    resolver: zodResolver(guestLoginSchema),
    defaultValues: {
      name: "",
      tableNumber: tableNumber || 0,
      token: token || "",
    },
  });

  useEffect(() => {
    if (!tableNumber || !token) {
      router.push("/");
    }
  }, [router, tableNumber, token]);

  const onSubmit = async (data: GuestLoginReqBody) => {
    if (isPending) return;

    const response = await mutateAsync(data);

    if (!response.ok) {
      showResponseError(response);
      return;
    }

    const { accessToken, refreshToken } = response.data;
    setAuthLocalStorage({ accessToken, refreshToken });
    setRole(response.data.guest.role);
    setSocket(createSocket(accessToken));

    router.push("/guest/menu");
  };

  return (
    <Card className="w-full sm:max-w-2xl self-center">
      <CardHeader>
        <CardTitle className="text-xl text-center">Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Tên khách hàng</Label>
                      <Input id="name" type="text" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" loading={isPending}>
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function GuestLoginFormWrapper() {
  return (
    <Suspense>
      <GuestLoginForm />
    </Suspense>
  );
}

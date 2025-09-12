"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showResponseError, showResponseSuccess } from "@/lib/utils";
import { useProfileQuery, useUpdateProfileMutation } from "@/queries/account";
import { useUploadImageMutation } from "@/queries/media";
import { updateProfileSchema } from "@/schemas/account";
import { UpdateProfileReqBody } from "@/types/account";

export default function UpdateProfileForm() {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const profileQuery = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const uploadMediaMutation = useUploadImageMutation();

  const form = useForm<UpdateProfileReqBody>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      avatar: undefined,
    },
  });

  const name = form.watch("name");
  const avatar = form.watch("avatar");

  const previewAvatar = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }

    return avatar || undefined;
  }, [avatar, avatarFile]);

  useEffect(() => {
    if (profileQuery.data) {
      const response = profileQuery.data;

      if (!response.ok) {
        showResponseError(response);
        return;
      }

      const { name, avatar } = response.data;
      form.reset({
        name,
        avatar: avatar || undefined,
      });
    }
  }, [form, profileQuery.data]);

  const reset = () => {
    form.reset();
    setAvatarFile(null);
  };

  const onSubmit = async (data: UpdateProfileReqBody) => {
    if (updateProfileMutation.isPending) {
      return;
    }

    const body: UpdateProfileReqBody = data;

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

    const updateProfileResponse = await updateProfileMutation.mutateAsync(body);

    if (!updateProfileResponse.ok) {
      showResponseError(updateProfileResponse, { setFormError: form.setError });
      return;
    }

    showResponseSuccess(updateProfileResponse);
    reset();
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onReset={reset}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className="rounded-none">
                          {name}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAvatarFile(file);
                            field.onChange(
                              `http://localhost:4000/${file.name}`,
                            );
                          }
                        }}
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed cursor-pointer"
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
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
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

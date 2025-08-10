"use server";

import { httpClient } from "@/lib/http";
import { UploadMediaResData } from "@/types/media";

const basePath = "/media";

export async function uploadMediaAction(body: FormData) {
  return httpClient.post<UploadMediaResData>(`${basePath}/upload`, body);
}

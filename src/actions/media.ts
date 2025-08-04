"use server";

import { httpClient } from "@/lib/http";
import { UploadMediaResData } from "@/types/media";

const BASE_PATH = "/media";

export async function uploadMediaAction(body: FormData) {
  return httpClient.post<UploadMediaResData>(`${BASE_PATH}/upload`, body);
}

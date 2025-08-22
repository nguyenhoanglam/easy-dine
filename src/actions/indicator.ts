"use server";

import { httpClient } from "@/lib/http";
import { createQueryString } from "@/lib/utils";
import { DashboardIndicatorQueryParams } from "@/types/indicator";

const basePath = "/indicators";

export async function getDashboardIndicatorAction(
  params: DashboardIndicatorQueryParams,
) {
  const queryParams = {
    fromDate: params.fromDate?.toISOString(),
    toDate: params.toDate?.toISOString(),
  };

  return httpClient.get(
    `${basePath}/dashboard${createQueryString(queryParams)}`,
  );
}

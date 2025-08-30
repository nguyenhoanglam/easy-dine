"use server";

import { httpClient } from "@/lib/http";
import { createQueryString } from "@/lib/utils";
import {
  DashboardIndicatorsQueryParams,
  DashboardIndicatorsResData,
} from "@/types/indicator";

const basePath = "/indicators";

export async function getDashboardIndicatorsAction(
  params: DashboardIndicatorsQueryParams,
) {
  const queryString = createQueryString({
    fromDate: params.fromDate.toISOString(),
    toDate: params.toDate.toISOString(),
  });

  return httpClient.get<DashboardIndicatorsResData>(
    `${basePath}/dashboard${queryString}`,
  );
}

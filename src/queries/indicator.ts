import { useQuery } from "@tanstack/react-query";

import { getDashboardIndicatorsAction } from "@/actions/indicator";
import { DashboardIndicatorsQueryParams } from "@/types/indicator";

const QueryKey = {
  indicators: "indicators",
} as const;

export function useDashboardIndicatorsQuery(
  params: DashboardIndicatorsQueryParams,
) {
  return useQuery({
    queryKey: [QueryKey.indicators, params],
    queryFn: async () => getDashboardIndicatorsAction(params),
  });
}

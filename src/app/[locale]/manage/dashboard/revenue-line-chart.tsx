"use client";

import { parse } from "date-fns";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatDate } from "@/lib/utils";
import { DashboardIndicatorsResData } from "@/types/indicator";

const chartConfig = {
  // Định nghĩa màu sắc và nhãn cho từng chỉ số
  revenue: {
    label: "Doanh thu",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Props = {
  data: DashboardIndicatorsResData["revenueByDate"];
};

export function RevenueLineChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent indicator="dashed" nameKey="revenue" />
              }
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (data.length < 8) {
                  return value;
                }

                if (data.length < 33) {
                  const date = parse(value, "dd/MM/yyyy", new Date());
                  return formatDate(date, "dd");
                }

                return "";
              }}
            />

            <Line
              dataKey="revenue"
              type="linear"
              stroke="var(--color-revenue)" // Sử dụng color từ chartConfig
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}

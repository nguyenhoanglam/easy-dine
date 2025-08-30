"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import { DashboardIndicatorsResData } from "@/types/indicator";

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const chartConfig = {
  successOrders: {
    label: "Đon thanh toán",
  },
} satisfies ChartConfig;

type Props = {
  data: Pick<
    DashboardIndicatorsResData["dishIndicator"][number],
    "name" | "successOrders"
  >[];
};

export function DishBarChart({ data }: Props) {
  const chartData = data
    .filter((item) => item.successOrders > 0)
    .sort((a, b) => b.successOrders - a.successOrders)
    .map((item, index) => ({
      ...item,
      fill: chartColors[index % chartColors.length],
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xếp hạng món ăn</CardTitle>
        <CardDescription>Được gọi nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 && (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 0,
              }}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <XAxis dataKey="successOrders" type="number" hide />
              <YAxis
                dataKey="name"
                axisLine={false}
                type="category"
                tickLine={false}
                tickMargin={2}
              />
              <Bar
                dataKey="successOrders"
                name={"Đơn thanh toán"}
                layout="vertical"
                radius={5}
              />
            </BarChart>
          </ChartContainer>
        )}
        {chartData.length === 0 && (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div> */}
        {/* <div className='leading-none text-muted-foreground'>
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}

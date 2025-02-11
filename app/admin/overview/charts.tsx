"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { TrendingUp, TrendingDown } from "lucide-react";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface Props {
  data: {
    month: string;
    totalSales: number;
  }[];
}

export function Charts({ data }: Props) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Convert data and sort it chronologically
  const sortedData = data
    .map(({ month, totalSales }) => {
      const [m, y] = month.split("/").map(Number);
      return {
        month: monthNames[m - 1], // e.g. "01" -> "January"
        year: y < 50 ? 2000 + y : 1900 + y, // assumes years below 50 are 2000+ (e.g. "24" -> 2024)
        totalSales,
      };
    })
    .sort(
      (a, b) =>
        a.year - b.year ||
        monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
    );

  // Calculate percentage change between the last two months
  let percentageChange: number | null = null;
  if (sortedData.length >= 2) {
    const lastSales = sortedData[sortedData.length - 1].totalSales;
    const prevSales = sortedData[sortedData.length - 2].totalSales;
    percentageChange = ((lastSales - prevSales) / prevSales) * 100;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Data</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart width={500} height={300} data={sortedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(_, idx) => {
                const item = sortedData[idx];
                // e.g. "Jul 24"
                return `${item.month.slice(0, 3)} ${String(item.year).slice(
                  -2
                )}`;
              }}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: number) => `$${value.toFixed(0)}`}
            />
            {/* Custom tooltip showing only the formatted price */}
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const price = payload[0].value as number;
                  return (
                    <div
                      style={{
                        backgroundColor: "#fff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        fontWeight: "bold",
                      }}
                    >
                      <span>{`$${price.toFixed(0)}`}</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="totalSales"
              fill={chartConfig.sales.color}
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {percentageChange !== null && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none text-center">
            {percentageChange > 0 ? (
              <p>
                Sales increased by {percentageChange.toFixed(1)}% compared to{" "}
                <TrendingUp className="h-4 w-4" />
                the previous month
              </p>
            ) : percentageChange < 0 ? (
              <>
                Sales decreased by {Math.abs(percentageChange).toFixed(1)}%{" "}
                <TrendingDown className="h-4 w-4" />
                compared to the previous month{" "}
              </>
            ) : (
              "Sales remained unchanged"
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

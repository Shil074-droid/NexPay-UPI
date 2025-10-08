'use client';

import { Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { User } from '@/lib/types';

interface UserRatioChartProps {
  users: User[];
}

export function UserRatioChart({ users }: UserRatioChartProps) {
  const customerCount = users.filter((u) => u.role === 'customer').length;
  const merchantCount = users.filter((u) => u.role === 'merchant').length;

  const chartData = [
    { name: 'Customers', value: customerCount, fill: 'hsl(var(--chart-1))' },
    { name: 'Merchants', value: merchantCount, fill: 'hsl(var(--chart-2))' },
  ];
  
  const chartConfig = {
    value: { label: 'Users' },
    Customers: { label: 'Customers', color: 'hsl(var(--chart-1))' },
    Merchants: { label: 'Merchants', color: 'hsl(var(--chart-2))' },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Merchant vs. Customer Ratio</CardTitle>
        <CardDescription>Distribution of user roles on the platform.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                 {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

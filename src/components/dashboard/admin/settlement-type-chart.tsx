'use client';

import { Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { Transaction } from '@/lib/types';

interface SettlementTypeChartProps {
  transactions: Transaction[];
}

export function SettlementTypeChart({ transactions }: SettlementTypeChartProps) {
  const instantCount = transactions.filter((tx) => tx.settlementMode === 'Instant').length;
  const pendingCount = transactions.filter((tx) => tx.settlementMode === 'Pending').length;

  const chartData = [
    { name: 'Instant', value: instantCount, fill: 'hsl(var(--chart-1))' },
    { name: 'Pending', value: pendingCount, fill: 'hsl(var(--chart-4))' },
  ];

   const chartConfig = {
    value: { label: 'Settlements' },
    Instant: { label: 'Instant', color: 'hsl(var(--chart-1))' },
    Pending: { label: 'Pending', color: 'hsl(var(--chart-4))' },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Settlement Types</CardTitle>
        <CardDescription>Breakdown of instant vs. pending settlements.</CardDescription>
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

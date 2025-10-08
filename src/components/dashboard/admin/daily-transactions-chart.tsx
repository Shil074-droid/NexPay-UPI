'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';

interface DailyTransactionsChartProps {
  transactions: Transaction[];
}

export function DailyTransactionsChart({ transactions }: DailyTransactionsChartProps) {
  const data = transactions.reduce((acc, tx) => {
    const day = format(new Date(tx.date), 'yyyy-MM-dd');
    if (!acc[day]) {
      acc[day] = { date: format(new Date(tx.date), 'MMM d'), count: 0 };
    }
    acc[day].count++;
    return acc;
  }, {} as { [key: string]: { date: string; count: number } });

  const chartData = Object.values(data).reverse();

  const chartConfig = {
    transactions: {
      label: 'Transactions',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Transaction Count</CardTitle>
        <CardDescription>Number of transactions over the last few days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis allowDecimals={false} />
            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
            <Bar dataKey="count" name="Transactions" fill="var(--color-transactions)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

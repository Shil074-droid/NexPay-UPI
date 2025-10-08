import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Transaction, User } from "@/lib/types";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

type RecentTransactionsProps = {
    transactions: Transaction[];
    currentUser: User;
};

export function RecentTransactions({ transactions, currentUser }: RecentTransactionsProps) {
  const isOutgoing = (tx: Transaction) => tx.fromUserId === currentUser.id;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>A quick look at your latest activity.</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
                <Link href="/transactions">View All</Link>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Counterparty</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
                transactions.slice(0, 5).map((tx) => (
                    <TableRow key={tx.id}>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                {isOutgoing(tx) ? (
                                    <ArrowUpRight className="h-4 w-4 text-destructive" />
                                ) : (
                                    <ArrowDownLeft className="h-4 w-4 text-green-500" />
                                )}
                                <div>
                                    <div className="font-medium">
                                        {isOutgoing(tx) ? tx.toUserName : tx.fromUserName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {isOutgoing(tx) ? 'Payment to' : 'Payment from'}
                                    </div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${isOutgoing(tx) ? 'text-destructive' : 'text-green-500'}`}>
                            {isOutgoing(tx) ? '-' : '+'}
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            {format(new Date(tx.date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <Badge variant={tx.status === 'Completed' ? 'default' : 'secondary'} className={tx.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}>
                                {tx.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                        No recent transactions.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

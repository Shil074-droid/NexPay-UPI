'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getTransactionsForUser } from '@/lib/mock-data';
import type { Transaction } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function TransactionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getTransactionsForUser(user.id).then((data) => {
        setTransactions(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Your transaction history will be downloaded shortly.',
    });
  };

  if (!user) return null;

  const isOutgoing = (tx: Transaction) => tx.fromUserId === user.id;

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground">A detailed record of all your payments.</p>
      </div>
      <Card>
        <CardHeader>
            <div className='flex justify-between items-center'>
                <CardTitle>All Transactions</CardTitle>
                <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>
            <CardDescription>
                {transactions.length} transactions found.
            </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Counterparty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Settlement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="font-medium">{format(new Date(tx.date), 'MMM d, yyyy')}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(tx.date), 'p')}</div>
                    </TableCell>
                    <TableCell className="font-medium">{isOutgoing(tx) ? tx.toUserName : tx.fromUserName}</TableCell>
                    <TableCell className={`text-right font-semibold ${isOutgoing(tx) ? 'text-destructive' : 'text-green-500'}`}>
                      {isOutgoing(tx) ? '-' : '+'}
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={tx.status === 'Completed' ? 'default' : 'secondary'} className={tx.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{tx.settlementMode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getTransactionsForUser } from '@/lib/mock-data';
import type { Transaction } from '@/lib/types';
import { BalanceCard } from '../shared/balance-card';
import { RecentTransactions } from '../shared/recent-transactions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Handshake } from 'lucide-react';
import { RequestPaymentModal } from './request-payment-modal';

export function MerchantDashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getTransactionsForUser(user.id).then((data) => {
        setTransactions(data);
        setLoading(false);
      });
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BalanceCard balance={user.balance} />
        <div className="md:col-span-2 lg:col-span-3 flex justify-end">
            <Button onClick={() => setIsModalOpen(true)}>
                <Handshake className="mr-2 h-4 w-4" /> Request a Payment
            </Button>
        </div>
      </div>
      
      {loading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <RecentTransactions transactions={transactions} currentUser={user} />
      )}
      <RequestPaymentModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}

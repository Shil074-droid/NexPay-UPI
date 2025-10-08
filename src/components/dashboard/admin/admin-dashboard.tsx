'use client';

import { useState, useEffect } from "react";
import type { Transaction, User } from "@/lib/types";
import { getAllTransactions, getAllUsers } from "@/lib/mock-data";
import { DailyTransactionsChart } from "./daily-transactions-chart";
import { UserRatioChart } from "./user-ratio-chart";
import { SettlementTypeChart } from "./settlement-type-chart";
import { StatCard } from "../shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CreditCard, Landmark, Banknote } from "lucide-react";

export function AdminDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [transactionsData, usersData] = await Promise.all([
                getAllTransactions(),
                getAllUsers(),
            ]);
            setTransactions(transactionsData);
            setUsers(usersData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const totalVolume = transactions.reduce((acc, tx) => acc + tx.amount, 0);
    const totalTransactions = transactions.length;
    const totalUsers = users.length;
    const totalMerchants = users.filter(u => u.role === 'merchant').length;
    
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                    <>
                        <Skeleton className="h-28" />
                        <Skeleton className="h-28" />
                        <Skeleton className="h-28" />
                        <Skeleton className="h-28" />
                    </>
                ) : (
                    <>
                        <StatCard 
                            title="Total Volume" 
                            value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalVolume)} 
                            icon={Banknote}
                        />
                        <StatCard 
                            title="Total Transactions" 
                            value={totalTransactions.toString()}
                            icon={CreditCard}
                        />
                        <StatCard 
                            title="Total Users" 
                            value={totalUsers.toString()}
                            icon={Users}
                        />
                        <StatCard 
                            title="Total Merchants" 
                            value={totalMerchants.toString()}
                            icon={Landmark}
                        />
                    </>
                )}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                {loading ? <Skeleton className="h-80" /> : <DailyTransactionsChart transactions={transactions} />}
                {loading ? <Skeleton className="h-80" /> : <UserRatioChart users={users} />}
            </div>
             <div className="grid gap-6">
                 {loading ? <Skeleton className="h-80" /> : <SettlementTypeChart transactions={transactions} />}
             </div>
        </div>
    );
}

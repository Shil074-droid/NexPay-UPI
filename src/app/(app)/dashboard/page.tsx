'use client';

import { useAuth } from '@/hooks/use-auth';
import { AdminDashboard } from '@/components/dashboard/admin/admin-dashboard';
import { CustomerDashboard } from '@/components/dashboard/customer/customer-dashboard';
import { MerchantDashboard } from '@/components/dashboard/merchant/merchant-dashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'customer':
        return <CustomerDashboard />;
      case 'merchant':
        return <MerchantDashboard />;
      default:
        return <div>Invalid user role.</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      </div>
      {renderDashboard()}
    </div>
  );
}

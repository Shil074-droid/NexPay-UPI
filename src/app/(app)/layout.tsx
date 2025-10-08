'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1 p-4 sm:p-6 md:p-8 bg-secondary/50">
              {children}
            </div>
            <footer className="p-4 text-center text-xs text-muted-foreground">
              <p className="font-semibold">Secure Wireless Enhanced Transaction Architecture</p>
              <p>NexPay © 2025, “Built for the future of digital trust.”</p>
            </footer>
        </main>
      </div>
    </SidebarProvider>
  );
}

import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from './user-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-gradient-to-r from-blue-500 via-sky-300 to-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden text-white hover:bg-black/20" />
        {/* Page Title could go here */}
      </div>
      <UserNav />
    </header>
  );
}

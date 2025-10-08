import { cn } from "@/lib/utils";
import { Landmark } from "lucide-react";

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <div className="bg-primary rounded-md p-1.5 flex items-center justify-center">
            <Landmark className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight">NexPay</span>
    </div>
  );
}

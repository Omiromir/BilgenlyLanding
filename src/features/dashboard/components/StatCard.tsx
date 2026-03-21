import type { LucideIcon } from "lucide-react";
import { cn } from "../../../components/ui/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  return (
    <article className="dashboard-card rounded-[28px] border p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-[var(--dashboard-text-soft)]">{title}</p>
          <p className="text-4xl font-semibold tracking-tight text-[var(--dashboard-text-strong)]">
            {value}
          </p>
          <p className="text-sm text-[var(--dashboard-brand)]">{change}</p>
        </div>

        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            iconClassName ?? "bg-slate-900 text-white"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}

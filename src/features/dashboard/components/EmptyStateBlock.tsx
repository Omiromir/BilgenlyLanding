import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../../components/ui/utils";

interface EmptyStateBlockProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export function EmptyStateBlock({
  title,
  description,
  icon: Icon = Sparkles,
  action,
  className,
}: EmptyStateBlockProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-dashed border-[var(--dashboard-border)] bg-[var(--dashboard-surface-muted)] p-6",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--dashboard-brand-soft-alt)] text-[var(--dashboard-brand)]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--dashboard-text-strong)]">{title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-[var(--dashboard-text-soft)]">
            {description}
          </p>
          {action ? <div className="pt-2">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

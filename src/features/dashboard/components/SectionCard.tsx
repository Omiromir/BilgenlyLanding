import type { ReactNode } from "react";
import { cn } from "../../../components/ui/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "dashboard-card rounded-[30px] border",
        className
      )}
    >
      <div className="border-b border-[var(--dashboard-border-soft)] px-6 py-5">
        <h2 className="text-[1.75rem] font-semibold tracking-tight text-[var(--dashboard-text-strong)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-[var(--dashboard-text-soft)]">{description}</p>
        ) : null}
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

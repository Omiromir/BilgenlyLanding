import type { ReactNode } from "react";
import { cn } from "../../../components/ui/utils";

interface CtaPanelProps {
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
  variant?: "gradient" | "surface";
}

export function CtaPanel({
  title,
  description,
  actions,
  aside,
  className,
  variant = "surface",
}: CtaPanelProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[34px] p-8 shadow-xl",
        variant === "gradient"
          ? "dashboard-hero text-white"
          : "dashboard-card border text-[var(--dashboard-text-strong)]",
        className
      )}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-semibold tracking-tight">{title}</h2>
          <p
            className={cn(
              "mt-4 text-lg leading-8",
              variant === "gradient"
                ? "text-white/86"
                : "text-[var(--dashboard-text-soft)]"
            )}
          >
            {description}
          </p>
          {actions ? <div className="mt-8 flex flex-wrap gap-4">{actions}</div> : null}
        </div>

        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
    </section>
  );
}

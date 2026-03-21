import { Link } from "react-router";
import { cn } from "../../../components/ui/utils";

interface DashboardPageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  badge?: string;
  ctaLabel?: string;
  ctaTo?: string;
  className?: string;
}

export function DashboardPageHeader({
  eyebrow,
  title,
  subtitle,
  badge,
  ctaLabel,
  ctaTo,
  className,
}: DashboardPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--dashboard-brand)]">
            {eyebrow}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--dashboard-text-strong)] md:text-5xl">
            {title}
          </h1>
          {badge ? (
            <span className="dashboard-badge inline-flex rounded-full px-3 py-1 text-sm font-medium">
              {badge}
            </span>
          ) : null}
        </div>

        <p className="max-w-3xl text-lg leading-8 text-[var(--dashboard-text-soft)]">{subtitle}</p>
      </div>

      {ctaLabel && ctaTo ? (
        <Link
          to={ctaTo}
          className="dashboard-button-secondary inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium shadow-sm transition"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

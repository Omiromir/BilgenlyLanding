import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";

interface DashboardPlaceholderPageProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaTo?: string;
}

export function DashboardPlaceholderPage({
  title,
  description,
  ctaLabel,
  ctaTo,
}: DashboardPlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--dashboard-text-strong)]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-[var(--dashboard-text-soft)]">{description}</p>
      </div>

      <section className="dashboard-card rounded-[32px] border p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--dashboard-brand-soft-alt)] text-[var(--dashboard-brand)]">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--dashboard-text-strong)]">
                Coming soon
              </h2>
              <p className="mt-2 text-base leading-7 text-[var(--dashboard-text-soft)]">
                This page is part of the new dashboard foundation. The layout,
                routing, and navigation are live now, and the detailed workflow
                UI can be added next without changing the shell structure.
              </p>
            </div>
          </div>

          {ctaLabel && ctaTo ? (
            <Link
              to={ctaTo}
              className="dashboard-button-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}

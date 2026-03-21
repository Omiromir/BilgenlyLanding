import { DashboardPageHeader } from "../../../features/dashboard/components/DashboardPageHeader";
import { EmptyStateBlock } from "../../../features/dashboard/components/EmptyStateBlock";
import { SectionCard } from "../../../features/dashboard/components/SectionCard";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";

export function ModeratorDashboardPage() {
  const meta = useDashboardPageMeta();

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title={meta?.title ?? "Moderator Dashboard"}
        subtitle={meta?.subtitle ?? ""}
        badge={meta?.badge}
      />

      <SectionCard
        title="Moderator Workspace"
        description="Moderator routing remains stable while the teacher and student dashboards evolve."
      >
        <EmptyStateBlock
          title="Moderator tools stay compatible"
          description="This route remains protected and accessible. A deeper moderator-specific interface can be added in a later phase without changing the role guard or shell."
        />
      </SectionCard>
    </div>
  );
}

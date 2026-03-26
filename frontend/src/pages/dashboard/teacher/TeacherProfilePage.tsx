import { DashboardProfilePage } from "../../../features/dashboard/components/DashboardProfilePage";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";
import { teacherProfileSummary } from "../../../features/dashboard/mock/sharedUi";

export function TeacherProfilePage() {
  const meta = useDashboardPageMeta();

  return (
    <DashboardProfilePage
      title={meta?.title ?? "My Profile"}
      subtitle={meta?.subtitle ?? ""}
      profile={teacherProfileSummary}
    />
  );
}

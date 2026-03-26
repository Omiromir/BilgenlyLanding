import { DashboardSettingsPage } from "../../../features/dashboard/components/DashboardSettingsPage";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";
import { teacherSettingsData } from "../../../features/dashboard/mock/sharedUi";

export function TeacherSettingsPage() {
  const meta = useDashboardPageMeta();

  return (
    <DashboardSettingsPage
      title={meta?.title ?? "Settings"}
      subtitle={meta?.subtitle ?? ""}
      data={teacherSettingsData}
    />
  );
}

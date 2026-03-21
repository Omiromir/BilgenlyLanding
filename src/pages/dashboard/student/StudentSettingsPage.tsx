import { DashboardSettingsPage } from "../../../features/dashboard/components/DashboardSettingsPage";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";
import { studentSettingsData } from "../../../features/dashboard/mock/sharedUi";

export function StudentSettingsPage() {
  const meta = useDashboardPageMeta();

  return (
    <DashboardSettingsPage
      title={meta?.title ?? "Settings"}
      subtitle={meta?.subtitle ?? ""}
      data={studentSettingsData}
    />
  );
}

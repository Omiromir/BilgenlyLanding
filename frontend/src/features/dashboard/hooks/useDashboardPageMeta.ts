import { matchPath, useLocation } from "react-router";
import { getDashboardRoutes } from "../config/navigation";

export function useDashboardPageMeta() {
  const location = useLocation();

  return (
    getDashboardRoutes().find((route) =>
      matchPath({ path: route.path, end: true }, location.pathname)
    ) ?? null
  );
}

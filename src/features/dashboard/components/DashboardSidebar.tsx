import { PanelLeftClose, PanelLeftOpen, Search, X } from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "../../../app/providers/AuthProvider";
import { cn } from "../../../components/ui/utils";
import { getDashboardNavigation } from "../config/navigation";
import { BilgenlyLogo } from "../../../components/shared/BilgenlyLogo";

interface DashboardSidebarProps {
  className?: string;
  onNavigate?: () => void;
  onClose?: () => void;
  onToggleCollapse?: () => void;
  showMobileClose?: boolean;
  collapsed?: boolean;
}

export function DashboardSidebar({
  className,
  onNavigate,
  onClose,
  onToggleCollapse,
  showMobileClose = false,
  collapsed = false,
}: DashboardSidebarProps) {
  const { role } = useAuth();
  const navigation = getDashboardNavigation(role);
  const primaryNavigation = navigation.filter(
    (item) => !item.path.endsWith("/settings"),
  );
  const settingsItem = navigation.find((item) =>
    item.path.endsWith("/settings"),
  );

  return (
    <aside
      className={cn(
        "dashboard-sidebar relative flex h-full w-full flex-col border-r",
        collapsed && "items-center",
        className,
      )}
    >
      {!showMobileClose ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="absolute -right-4 top-20 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-[var(--dashboard-border)] bg-white text-[var(--dashboard-text-faint)] shadow-sm transition hover:bg-[var(--dashboard-surface-muted)] hover:text-[var(--dashboard-text)] lg:inline-flex"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      ) : null}

      <div
        className={cn(
          "flex items-center justify-between border-b border-[var(--dashboard-border-soft)] px-5 py-5",
          collapsed && "w-full justify-center px-4 py-7"
        )}
      >
        <div className="flex items-center gap-3">
          <BilgenlyLogo size={collapsed ? 48 : 40} showText={!collapsed} />
        </div>

        {showMobileClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="border-b border-[var(--dashboard-border-soft)] px-4 py-4 lg:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search..."
            className="dashboard-input h-12 w-full rounded-2xl border pl-12 pr-4 text-sm outline-none transition focus:border-[var(--dashboard-brand)] focus:bg-white"
          />
        </div>
      </div>

      <nav
        className={cn(
          "flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4",
          collapsed && "w-full items-center gap-4 px-0 py-5"
        )}
      >
        {primaryNavigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path.endsWith("/overview") || path === "/dashboard/moderator"}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-[var(--dashboard-text-soft)] transition hover:bg-[var(--dashboard-surface-muted)] hover:text-[var(--dashboard-text)]",
                collapsed &&
                  "h-14 w-14 justify-center rounded-[18px] px-0 py-0 text-[var(--dashboard-text-soft)] hover:bg-[var(--dashboard-surface-muted)]",
                isActive &&
                  "dashboard-nav-active text-white hover:bg-[var(--dashboard-brand)] hover:text-white",
              )
            }
          >
            <Icon className="h-5 w-5" />
            {!collapsed ? <span>{label}</span> : null}
          </NavLink>
        ))}
      </nav>

      {settingsItem ? (
        <div
          className={cn(
            "mt-auto border-t border-[var(--dashboard-border-soft)] px-4 py-4",
            collapsed && "w-full px-0 py-5"
          )}
        >
          {(() => {
            const SettingsIcon = settingsItem.icon;

            return (
              <NavLink
                to={settingsItem.path}
                end
                onClick={onNavigate}
                title={collapsed ? settingsItem.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-[var(--dashboard-text-soft)] transition hover:bg-[var(--dashboard-surface-muted)] hover:text-[var(--dashboard-text)]",
                    collapsed &&
                      "mx-auto h-14 w-14 justify-center rounded-[18px] px-0 py-0 text-[var(--dashboard-text-soft)] hover:bg-[var(--dashboard-surface-muted)]",
                    isActive &&
                      "dashboard-nav-active text-white hover:bg-[var(--dashboard-brand)] hover:text-white",
                  )
                }
              >
                <SettingsIcon className="h-5 w-5" />
                {!collapsed ? <span>{settingsItem.label}</span> : null}
              </NavLink>
            );
          })()}
        </div>
      ) : null}
    </aside>
  );
}

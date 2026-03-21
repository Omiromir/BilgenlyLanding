import {
  Bell,
  CircleAlert,
  CircleCheckBig,
  Info,
  LogOut,
  Medal,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../../app/providers/AuthProvider";
import { cn } from "../../../components/ui/utils";
import { notificationItems } from "../mock/sharedUi";

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
}

export function DashboardHeader({ onOpenSidebar }: DashboardHeaderProps) {
  const { role, signOut } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const userMeta = useMemo(() => {
    switch (role) {
      case "teacher":
        return {
          name: "Professor Doe",
          email: "professor@bilgenly.com",
          profilePath: "/dashboard/teacher/profile",
          settingsPath: "/dashboard/teacher/settings",
        };
      case "student":
        return {
          name: "John Doe",
          email: "john.doe@bilgenly.com",
          profilePath: "/dashboard/student/profile",
          settingsPath: "/dashboard/student/settings",
        };
      case "moderator":
        return {
          name: "Moderator User",
          email: "moderator@bilgenly.com",
          profilePath: "/dashboard/moderator",
          settingsPath: "/dashboard/moderator",
        };
      default:
        return {
          name: "Bilgenly User",
          email: "user@bilgenly.com",
          profilePath: "/signin",
          settingsPath: "/signin",
        };
    }
  }, [role]);

  const unreadCount = notificationItems.filter((item) => item.unread).length;

  return (
    <header className="dashboard-topbar sticky top-0 z-20 border-b backdrop-blur">
      <div ref={headerRef} className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center justify-between gap-3 xl:flex-1">
              <button
                type="button"
                onClick={onOpenSidebar}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--dashboard-border)] bg-white text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-surface-muted)] lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="relative hidden w-full max-w-xl lg:block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="dashboard-input h-14 w-full rounded-2xl border pl-12 pr-4 text-base outline-none transition focus:border-[var(--dashboard-brand)] focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 xl:justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen((current) => !current);
                  setIsProfileOpen(false);
                }}
                className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-surface-muted)]"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[var(--dashboard-brand)]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen((current) => !current);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-[var(--dashboard-surface-muted)]"
                aria-label="Profile"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  {userMeta.name.charAt(0)}
                </div>
              </button>
            </div>
          </div>

          <div className="relative flex justify-end">
            <div
              className={cn(
                "dashboard-card fixed left-4 right-4 top-[84px] z-30 overflow-hidden rounded-[20px] border shadow-2xl shadow-slate-900/10 transition sm:absolute sm:left-auto sm:right-16 sm:top-0 sm:w-[360px] sm:max-w-[360px] sm:rounded-[24px]",
                isNotificationsOpen
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
              )}
            >
              <div className="flex items-start justify-between gap-4 border-b border-[var(--dashboard-border-soft)] px-4 py-4 sm:px-5">
                <div>
                  <h3 className="text-[1.35rem] font-semibold text-[var(--dashboard-text-strong)] sm:text-[1.75rem]">
                    Notifications
                  </h3>
                  <p className="text-sm text-[var(--dashboard-text-soft)]">{unreadCount} unread</p>
                </div>
                <button
                  type="button"
                  className="pt-1 text-sm font-medium text-[var(--dashboard-brand)] transition hover:text-[var(--dashboard-brand-strong)]"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-[min(65vh,356px)] overflow-y-auto">
                {notificationItems.map((item) => (
                  <article
                    key={`${item.title}-${item.time}`}
                    className={cn(
                      "border-b border-slate-200 px-4 py-4 last:border-b-0 sm:px-5",
                      item.unread ? "bg-[var(--dashboard-brand-soft-alt)]/60" : "bg-white",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--dashboard-brand-soft-alt)] text-[var(--dashboard-brand)]">
                        <NotificationIcon icon={item.icon} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[15px] font-semibold text-[var(--dashboard-text-strong)]">
                                {item.title}
                              </p>
                              {item.unread ? (
                                <span className="h-2 w-2 rounded-full bg-[var(--dashboard-brand)]" />
                              ) : null}
                            </div>
                            <p className="mt-1 text-[15px] leading-6 text-[var(--dashboard-text-soft)]">
                              {item.message}
                            </p>
                            <p className="mt-2 text-sm text-[var(--dashboard-text-faint)]">
                              {item.time}
                            </p>
                          </div>

                          <button
                            type="button"
                            className="text-[var(--dashboard-text-faint)] transition hover:text-[var(--dashboard-text-soft)]"
                            aria-label={`Dismiss ${item.title}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="w-full border-t border-[var(--dashboard-border-soft)] px-5 py-4 text-center text-[15px] font-semibold text-[var(--dashboard-brand)] transition hover:bg-[var(--dashboard-surface-muted)]"
              >
                View all notifications
              </button>
            </div>

            <div
              className={cn(
                "dashboard-card absolute right-0 top-0 z-30 w-full max-w-[260px] overflow-hidden rounded-[16px] border shadow-2xl shadow-slate-900/10 transition",
                isProfileOpen
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
              )}
            >
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--dashboard-brand)] text-lg font-semibold text-white">
                  {role === "teacher"
                    ? "PD"
                    : userMeta.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[1.05rem] font-semibold text-[var(--dashboard-text-strong)]">
                    {userMeta.name}
                  </p>
                  <p className="truncate text-[15px] capitalize text-[var(--dashboard-text-soft)]">
                    {role ?? "user"}
                  </p>
                  <p className="truncate pt-1 text-sm text-[var(--dashboard-text-soft)]">
                    {userMeta.email}
                  </p>
                </div>
              </div>

              <div className="border-t border-[var(--dashboard-border-soft)] py-2">
                <Link
                  to={userMeta.profilePath}
                  className="flex w-full items-center gap-3 px-4 py-3 text-[15px] font-medium text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-surface-muted)]"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
                <Link
                  to={userMeta.settingsPath}
                  className="flex w-full items-center gap-3 px-4 py-3 text-[15px] font-medium text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-surface-muted)]"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>
              <div className="border-t border-[var(--dashboard-border-soft)] py-2">
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-3 px-4 py-3 text-[15px] font-medium text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-surface-muted)]"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          </div>

          {/* <div className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-slate-50/80 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  {meta?.title ?? "Dashboard"}
                </h2>
                {meta?.badge ? (
                  <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {meta.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                {meta?.subtitle ?? "Workspace overview"}
              </p>
            </div>

            {meta?.headerCtaLabel && meta.headerCtaTo ? (
              <Link
                to={meta.headerCtaTo}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {meta.headerCtaLabel}
              </Link>
            ) : null}
          </div> */}
        </div>
      </div>
    </header>
  );
}

function NotificationIcon({
  icon,
}: {
  icon: "info" | "check" | "alert" | "badge";
}) {
  switch (icon) {
    case "check":
      return <CircleCheckBig className="h-4 w-4" />;
    case "alert":
      return <CircleAlert className="h-4 w-4 text-violet-500" />;
    case "badge":
      return <Medal className="h-4 w-4" />;
    case "info":
    default:
      return <Info className="h-4 w-4" />;
  }
}

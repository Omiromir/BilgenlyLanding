import {
  Bell,
  ChevronDown,
  Lock,
  Palette,
  Shield,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../components/ui/utils";
import { DashboardPageHeader } from "./DashboardPageHeader";
import type {
  SettingsField,
  SettingsScreenData,
  SettingsToggleItem,
} from "../mock/sharedUi";
import { Textarea } from "../../../components/ui/textarea";

type SettingsTab = "account" | "security" | "notifications" | "preferences";

interface DashboardSettingsPageProps {
  title: string;
  subtitle: string;
  data: SettingsScreenData;
}

const tabs: Array<{
  id: SettingsTab;
  label: string;
  icon: typeof User;
}> = [
  { id: "account", label: "Account", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Preferences", icon: Palette },
];

export function DashboardSettingsPage({
  title,
  subtitle,
  data,
}: DashboardSettingsPageProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  return (
    <div className="space-y-8">
      <DashboardPageHeader title={title} subtitle={subtitle} />

      <div className="grid gap-6 xl:grid-cols-[402px_minmax(0,1fr)] xl:items-start">
        <aside className="rounded-[18px] border border-slate-200 bg-white p-2 shadow-sm shadow-slate-200/40">
          <nav className="space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-semibold transition",
                      activeTab === tab.id
                      ? "dashboard-nav-active"
                      : "text-[var(--dashboard-text-strong)] hover:bg-[var(--dashboard-surface-muted)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          {activeTab === "account" ? (
            <>
              <SettingsPanel title="Account Information">
                <div className="space-y-5">
                  {data.account.fields.map((field) => (
                    <FieldRenderer key={field.label} field={field} />
                  ))}

                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="button"
                      className="dashboard-button-primary rounded-xl px-5 py-3 text-sm font-semibold transition"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="dashboard-button-secondary rounded-xl px-5 py-3 text-sm font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </SettingsPanel>

              <SettingsPanel title="Location & Time Zone">
                <div className="space-y-5">
                  {data.account.location.map((field) => (
                    <SelectLikeField
                      key={field.label}
                      label={field.label}
                      value={field.value}
                    />
                  ))}
                </div>
              </SettingsPanel>
            </>
          ) : null}

          {activeTab === "security" ? (
            <>
              <SettingsPanel title="Change Password">
                <div className="space-y-5">
                  {data.security.passwordFields.map((field) => (
                    <FieldRenderer key={field.label} field={field} password />
                  ))}
                  <button
                    type="button"
                    className="dashboard-button-primary rounded-xl px-5 py-3 text-sm font-semibold transition"
                  >
                    Update Password
                  </button>
                </div>
              </SettingsPanel>

              <SettingsPanel title="Two-Factor Authentication">
                <p className="mb-5 text-[15px] leading-6 text-slate-500">
                  Add an extra layer of security to your account by enabling
                  two-factor authentication.
                </p>
                <div className="flex items-center justify-between gap-4 rounded-[14px] bg-[var(--dashboard-surface-muted)] px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[var(--dashboard-text-strong)]">
                        {data.security.twoFactor.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {data.security.twoFactor.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="dashboard-button-secondary rounded-xl px-4 py-2.5 text-sm font-medium transition"
                  >
                    {data.security.twoFactor.actionLabel}
                  </button>
                </div>
              </SettingsPanel>

              <SettingsPanel title="Active Sessions">
                <div className="space-y-3">
                  {data.security.sessions.map((session) => (
                    <div
                      key={session.device}
                      className="flex items-center justify-between gap-4 rounded-[14px] border border-slate-200 px-4 py-4"
                    >
                      <div>
                        <p className="text-[15px] font-semibold text-[var(--dashboard-text-strong)]">
                          {session.device}
                        </p>
                        <p className="text-sm text-slate-500">
                          {session.description}
                        </p>
                      </div>

                      {session.actionLabel ? (
                        <button
                          type="button"
                          className={cn(
                            "text-sm font-medium",
                            session.destructive
                              ? "text-red-500"
                              : "text-[var(--dashboard-text-strong)]"
                          )}
                        >
                          {session.actionLabel}
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </SettingsPanel>
            </>
          ) : null}

          {activeTab === "notifications" ? (
            <>
              <SettingsPanel title="Email Notifications">
                <div className="space-y-3">
                  {data.notifications.email.map((item) => (
                    <ToggleRow key={item.label} item={item} />
                  ))}
                </div>
              </SettingsPanel>

              <SettingsPanel title="Push Notifications">
                <div className="space-y-3">
                  {data.notifications.push.map((item) => (
                    <ToggleRow key={item.label} item={item} />
                  ))}
                </div>
              </SettingsPanel>
            </>
          ) : null}

          {activeTab === "preferences" ? (
            <>
              <SettingsPanel title="Appearance">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[var(--dashboard-text-strong)]">Theme</p>
                    <div className="grid gap-3 lg:grid-cols-3">
                      {data.preferences.themes.map((theme) => (
                        <button
                          key={theme.label}
                          type="button"
                          className={cn(
                            "rounded-[14px] border p-4 text-center transition",
                            theme.selected
                              ? "border-[var(--dashboard-brand)] bg-[var(--dashboard-surface-muted)]"
                              : "border-[var(--dashboard-border-soft)] bg-white hover:bg-[var(--dashboard-surface-muted)]"
                          )}
                        >
                          <div
                            className="h-10 rounded-md opacity-20"
                            style={{ background: "var(--dashboard-gradient)" }}
                          />
                          <p className="mt-3 text-sm font-medium text-[var(--dashboard-text-strong)]">
                            {theme.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SettingsPanel>

              <SettingsPanel title="Language & Region">
                <div className="space-y-5">
                  {data.preferences.region.map((field) => (
                    <SelectLikeField
                      key={field.label}
                      label={field.label}
                      value={field.value}
                    />
                  ))}
                </div>
              </SettingsPanel>

              <SettingsPanel title="Privacy">
                <div className="space-y-4">
                  {data.preferences.privacy.map((item) => (
                    <ToggleRow key={item.label} item={item} />
                  ))}
                </div>
              </SettingsPanel>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SettingsPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 sm:p-6">
      <h2 className="text-[1.05rem] font-semibold text-[var(--dashboard-text-strong)]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function FieldRenderer({
  field,
  password = false,
}: {
  field: SettingsField;
  password?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[var(--dashboard-text-strong)]">{field.label}</span>
      {field.kind === "textarea" ? (
        <Textarea
          readOnly
          value={field.value}
          className="min-h-[106px] rounded-[14px] border-0 bg-[var(--dashboard-surface-muted)] px-4 py-4 text-[15px] leading-6 text-[var(--dashboard-text)] shadow-none focus-visible:ring-0"
        />
      ) : (
        <Input
          type={password ? "password" : "text"}
          readOnly
          value={field.value}
          placeholder={password ? "" : undefined}
          className="h-14 rounded-[14px] border-0 bg-[var(--dashboard-surface-muted)] px-4 text-[15px] text-[var(--dashboard-text)] shadow-none focus-visible:ring-0"
        />
      )}
    </label>
  );
}

function SelectLikeField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[var(--dashboard-text-strong)]">{label}</p>
      <div className="flex h-14 items-center justify-between rounded-[14px] bg-[var(--dashboard-surface-muted)] px-4 text-[15px] text-[var(--dashboard-text)]">
        <span>{value}</span>
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </div>
    </div>
  );
}

function ToggleRow({ item }: { item: SettingsToggleItem }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[14px] border border-slate-200 px-4 py-4">
      <div>
        <p className="text-[15px] font-semibold text-[var(--dashboard-text-strong)]">{item.label}</p>
        <p className="text-sm text-slate-500">{item.description}</p>
      </div>
      <div
        className={cn(
          "flex h-7 w-10 items-center rounded-full p-1 transition",
          item.enabled
            ? "justify-end bg-[var(--dashboard-brand)]"
            : "justify-start bg-[var(--dashboard-border)]"
        )}
      >
        <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
      </div>
    </div>
  );
}

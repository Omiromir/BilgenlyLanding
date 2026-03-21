import {
  BookOpen,
  CalendarDays,
  Camera,
  Clock3,
  Mail,
  MapPin,
  Medal,
  TrendingUp,
} from "lucide-react";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { cn } from "../../../components/ui/utils";
import type {
  ProfileStat,
  ProfileSummary,
} from "../mock/sharedUi";

interface DashboardProfilePageProps {
  title: string;
  subtitle: string;
  profile: ProfileSummary;
}

export function DashboardProfilePage({
  title,
  subtitle,
  profile,
}: DashboardProfilePageProps) {
  return (
    <div className="space-y-8">
      <DashboardPageHeader title={title} subtitle={subtitle} />

      <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
        <div className="relative h-[108px] bg-[linear-gradient(90deg,#3b82f6_0%,#6366f1_45%,#a855f7_74%,#7c3aed_100%)] px-4 py-4 sm:px-6">
          <button
            type="button"
            className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl bg-white/16 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur"
          >
            <Camera className="h-4 w-4" />
            Edit Cover
          </button>
        </div>

        <div className="px-5 pb-6 sm:px-6">
          <div className="-mt-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              <div className="relative h-[108px] w-[108px] shrink-0 rounded-full bg-white p-1 shadow-sm shadow-slate-300/50">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[40px] font-semibold text-[var(--dashboard-brand)]">
                  {profile.initials}
                </div>
                <button
                  type="button"
                  className="dashboard-button-primary absolute bottom-2 right-1 flex h-9 w-9 items-center justify-center rounded-full text-white"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <h2 className="text-[2rem] font-semibold tracking-tight text-[var(--dashboard-text-strong)]">
                    {profile.name}
                  </h2>
                  <p className="text-lg text-slate-500">{profile.roleLabel}</p>
                </div>

                <div className="flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:flex-wrap md:gap-x-10">
                  <InfoLine icon={Mail} text={profile.email} />
                  <InfoLine icon={CalendarDays} text={profile.joinedLabel} />
                  <InfoLine icon={MapPin} text={profile.location} />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="dashboard-button-primary inline-flex self-start rounded-xl px-5 py-3 text-sm font-semibold transition"
            >
              Edit Profile
            </button>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <h3 className="text-[1.75rem] font-semibold text-[var(--dashboard-text-strong)]">Bio</h3>
            <p className="mt-2 max-w-4xl text-[17px] leading-8 text-slate-500">
              {profile.bio}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-4">
        {profile.stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h3 className="text-[1.75rem] font-semibold text-[var(--dashboard-text-strong)]">
              Recent Activity
            </h3>
          </div>

          <div className="px-5 py-3 sm:px-6">
            {profile.activity.map((item, index) => (
              <div
                key={`${item.title}-${item.time}`}
                className={cn(
                  "flex gap-4 py-5",
                  index < profile.activity.length - 1
                    ? "border-b border-slate-200"
                    : ""
                )}
              >
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--dashboard-brand)]" />
                <div>
                  <p className="text-[15px] font-semibold text-[var(--dashboard-text-strong)]">
                    {item.title}
                  </p>
                  <p className="text-[15px] text-slate-500">{item.description}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h3 className="text-[1.75rem] font-semibold text-[var(--dashboard-text-strong)]">
              Personal Information
            </h3>
          </div>

          <div className="space-y-5 px-5 py-6 sm:px-6">
            {profile.personalInfo.map((field) => (
              <div key={field.label}>
                <p className="text-sm text-slate-500">{field.label}</p>
                <p className="mt-1 text-[15px] font-semibold text-[var(--dashboard-text-strong)]">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoLine({
  icon: Icon,
  text,
}: {
  icon: typeof Mail;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <Icon className="h-4 w-4 text-slate-400" />
      {text}
    </span>
  );
}

function StatCard({ stat }: { stat: ProfileStat }) {
  const Icon = getStatIcon(stat.icon);

  return (
    <article className="rounded-[22px] border border-slate-200 bg-white px-5 py-5 shadow-sm shadow-slate-200/40">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--dashboard-brand-soft-alt)] text-[var(--dashboard-brand)]">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-[15px] font-semibold text-[var(--dashboard-text-strong)]">{stat.label}</p>
      </div>
      <p className="mt-4 text-[2.2rem] font-semibold tracking-tight text-[var(--dashboard-text-strong)]">
        {stat.value}
      </p>
    </article>
  );
}

function getStatIcon(icon: ProfileStat["icon"]) {
  switch (icon) {
    case "badge":
      return Medal;
    case "trend":
      return TrendingUp;
    case "clock":
      return Clock3;
    case "book":
    default:
      return BookOpen;
  }
}

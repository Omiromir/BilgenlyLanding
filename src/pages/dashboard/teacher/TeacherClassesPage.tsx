import { EllipsisVertical, Search, UserPlus, Users } from "lucide-react";
import { SectionCard } from "../../../features/dashboard/components/SectionCard";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";
import {
  teacherClasses,
  teacherClassSummary,
  teacherTopStudents,
} from "../../../features/dashboard/mock/teacherWorkspace";

export function TeacherClassesPage() {
  const meta = useDashboardPageMeta();

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[3rem] font-semibold tracking-[-0.04em] text-[var(--dashboard-text-strong)]">
            {meta?.title ?? "Classes"}
          </h1>
          <p className="mt-2 text-[1.05rem] text-slate-500">
            Manage your classes and students
          </p>
        </div>

        <button
          type="button"
          className="dashboard-button-primary inline-flex items-center gap-2 rounded-[14px] px-6 py-3 text-sm font-medium transition"
        >
          <span className="text-lg leading-none">+</span>
          Create Class
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {teacherClassSummary.map((item) => (
          <article
            key={item.label}
            className="dashboard-card rounded-[24px] border p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-[2.2rem] font-semibold tracking-[-0.03em] text-[var(--dashboard-text-strong)]">
                  {item.value}
                </p>
                {item.change ? (
                  <p className="mt-2 text-sm text-[var(--dashboard-brand)]">{item.change}</p>
                ) : null}
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white ${item.iconColor}`}
              >
                <Users className="h-5 w-5" />
              </div>
            </div>
          </article>
        ))}
      </div>

      <SectionCard title="Your Classes">
        <div className="space-y-0">
          <div className="flex justify-end border-b border-slate-200 pb-6">
            <div className="relative w-full max-w-[260px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search classes..."
                className="dashboard-input h-12 w-full rounded-[14px] border border-transparent pl-12 pr-4 text-[1rem] outline-none transition focus:border-[var(--dashboard-brand)] focus:bg-white"
              />
            </div>
          </div>

          {teacherClasses.map((item, index) => (
            <article
              key={item.name}
              className={`flex flex-col gap-5 px-0 py-6 lg:flex-row lg:items-center lg:justify-between ${
                index < teacherClasses.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[1.2rem] font-semibold text-[var(--dashboard-text-strong)]">
                    {item.name}
                  </h3>
                  {item.active ? (
                    <span className="rounded-full bg-[var(--dashboard-success-soft)] px-3 py-1 text-xs font-medium text-[var(--dashboard-success)]">
                      Active
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap gap-6 text-sm text-slate-500">
                  <span>{item.students}</span>
                  <span>{item.quizzes}</span>
                  <span>{item.avgScore}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-[14px] bg-[var(--dashboard-brand-soft-alt)] px-5 py-3 text-sm font-medium text-[var(--dashboard-brand)] transition hover:bg-[var(--dashboard-brand-soft-alt)]/80"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Students
                </button>
                <button
                  type="button"
                  className="text-slate-400 transition hover:text-slate-600"
                >
                  <EllipsisVertical className="h-5 w-5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Top Performing Students">
        <div className="space-y-4">
          {teacherTopStudents.map((student) => (
            <article
              key={student.name}
              className="flex items-center justify-between rounded-[18px] border border-slate-200 px-5 py-4"
            >
              <div>
                <h3 className="font-semibold text-[var(--dashboard-text-strong)]">{student.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{student.className}</p>
              </div>
              <span className="text-lg font-semibold text-[var(--dashboard-success)]">
                {student.score}
              </span>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

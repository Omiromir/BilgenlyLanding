import {
  BookOpen,
  CalendarDays,
  EllipsisVertical,
  FileText,
  Search,
  Users,
} from "lucide-react";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";
import { teacherLibraryItems } from "../../../features/dashboard/mock/teacherWorkspace";

const statusClassName = {
  published: "bg-[var(--dashboard-success-soft)] text-[var(--dashboard-success)]",
  draft: "bg-[var(--dashboard-warning-soft)] text-[var(--dashboard-warning)]",
  archived: "bg-[var(--dashboard-brand-soft)] text-[var(--dashboard-text-soft)]",
} as const;

export function TeacherQuizLibraryPage() {
  const meta = useDashboardPageMeta();

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[3rem] font-semibold tracking-[-0.04em] text-[var(--dashboard-text-strong)]">
            {meta?.title ?? "Quiz Library"}
          </h1>
          <p className="mt-2 text-[1.05rem] text-slate-500">
            Manage all your quizzes in one place
          </p>
        </div>

        <button
          type="button"
          className="dashboard-button-primary rounded-[14px] px-6 py-3 text-sm font-medium transition"
        >
          Create New Quiz
        </button>
      </div>

      <section className="dashboard-card rounded-[24px] border p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search quizzes..."
              className="dashboard-input h-12 w-full rounded-[14px] border border-transparent pl-12 pr-4 text-[1rem] outline-none transition focus:border-[var(--dashboard-brand)] focus:bg-white"
            />
          </div>
          <select className="dashboard-input h-12 min-w-[126px] rounded-[14px] border border-transparent px-4 text-[1rem] outline-none">
            <option>All Status</option>
          </select>
          <select className="dashboard-input h-12 min-w-[156px] rounded-[14px] border border-transparent px-4 text-[1rem] outline-none">
            <option>All Categories</option>
          </select>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3 md:grid-cols-2">
        {teacherLibraryItems.map((item) => (
          <article
            key={item.title}
            className="dashboard-card rounded-[24px] border p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`inline-flex rounded-full px-4 py-1 text-xs font-medium capitalize ${statusClassName[item.status]}`}
              >
                {item.status}
              </span>
              <button
                type="button"
                className="text-slate-400 transition hover:text-slate-600"
              >
                <EllipsisVertical className="h-5 w-5" />
              </button>
            </div>

            <h2 className="mt-6 text-[1.15rem] font-semibold text-[var(--dashboard-text-strong)]">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{item.category}</p>

            <div className="mt-5 space-y-2.5 text-sm text-slate-500">
              <div className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {item.questions}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {item.students}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {item.date}
              </div>
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Avg Score</span>
                <span className="text-[1.75rem] font-semibold text-[var(--dashboard-success)]">
                  {item.averageScore}
                </span>
              </div>
              <div className="mt-4 flex gap-2.5">
                <button
                  type="button"
                  className="dashboard-button-primary flex-1 rounded-[14px] px-4 py-3 text-sm font-medium transition"
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="dashboard-button-secondary rounded-[14px] px-4 py-3 text-sm font-medium transition"
                >
                  Edit
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

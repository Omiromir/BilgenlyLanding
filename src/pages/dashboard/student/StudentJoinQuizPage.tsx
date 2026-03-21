import { BookOpen, Hash, Timer } from "lucide-react";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";
import { studentJoinAssignments } from "../../../features/dashboard/mock/studentWorkspace";

export function StudentJoinQuizPage() {
  const meta = useDashboardPageMeta();

  return (
    <div className="mx-auto max-w-[980px] space-y-6 pt-2">
      <div className="text-center">
        <h1 className="text-[3rem] font-semibold tracking-[-0.04em] text-[var(--dashboard-text-strong)]">
          {meta?.title ?? "Join a Quiz"}
        </h1>
        <p className="mt-2 text-[1.05rem] text-slate-500">
          Enter the quiz code provided by your teacher or select from assigned
          quizzes
        </p>
      </div>

      <section className="dashboard-card rounded-[28px] border p-8">
        <div className="mx-auto max-w-[420px] text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--dashboard-brand-soft-alt)] text-[var(--dashboard-brand)]">
            <Hash className="h-9 w-9" />
          </div>
          <h2 className="mt-5 text-[2rem] font-medium text-[var(--dashboard-text-strong)]">
            Enter Quiz Code
          </h2>
          <p className="mt-2 text-[1rem] text-slate-500">
            Your teacher will provide you with a unique code
          </p>

          <div className="mt-7 flex justify-center gap-2.5">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="dashboard-input h-[52px] w-[52px] rounded-[14px] border text-center text-lg font-medium text-[var(--dashboard-text-strong)] outline-none transition focus:border-[var(--dashboard-brand)] focus:bg-white"
              />
            ))}
          </div>

          <button
            type="button"
            className="dashboard-button-primary mt-6 w-full rounded-[14px] px-5 py-3.5 text-sm font-medium transition"
          >
            Join Quiz
          </button>
        </div>
      </section>

      <div className="flex items-center gap-4 py-2 text-sm text-slate-500">
        <div className="h-px flex-1 bg-slate-200" />
        or select from assigned quizzes
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="space-y-4">
        {studentJoinAssignments.map((assignment) => (
          <article
            key={assignment.title}
            className="dashboard-card rounded-[24px] border p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[1.25rem] font-semibold text-[var(--dashboard-text-strong)]">
                  {assignment.title}
                </h3>
                <p className="mt-2 text-[1rem] text-slate-500">
                  {assignment.teacher}
                </p>
              </div>
              <span className="rounded-full bg-[var(--dashboard-warning-soft)] px-4 py-1.5 text-sm font-medium text-[var(--dashboard-warning)]">
                {assignment.dueDate}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {assignment.questions}
              </span>
              <span className="inline-flex items-center gap-2">
                <Timer className="h-4 w-4" />
                {assignment.duration}
              </span>
            </div>

            <button
              type="button"
              className="dashboard-button-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[14px] px-4 py-3 text-sm font-medium transition"
            >
              Start Quiz
              <span className="text-base">›</span>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

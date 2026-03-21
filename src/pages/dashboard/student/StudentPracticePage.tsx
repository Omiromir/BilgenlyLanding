import { BookOpen, Play } from "lucide-react";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";
import {
  studentPracticeRecommendations,
  studentPracticeTopics,
} from "../../../features/dashboard/mock/studentWorkspace";

const difficultyClassName = {
  Easy: "bg-[var(--dashboard-success-soft)] text-[var(--dashboard-success)]",
  Medium: "bg-[var(--dashboard-warning-soft)] text-[var(--dashboard-warning)]",
  Hard: "bg-[var(--dashboard-danger-soft)] text-[var(--dashboard-danger)]",
} as const;

export function StudentPracticePage() {
  const meta = useDashboardPageMeta();

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[3rem] font-semibold tracking-[-0.04em] text-[var(--dashboard-text-strong)]">
          {meta?.title ?? "Practice Mode"}
        </h1>
        <p className="mt-2 text-[1.05rem] text-slate-500">
          Strengthen your skills with unlimited practice on any topic
        </p>
      </div>

      <section className="dashboard-card rounded-[24px] border">
        <div className="border-b border-[var(--dashboard-border-soft)] px-6 py-5">
          <h2 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-[var(--dashboard-text-strong)]">
            Recommended for You
          </h2>
        </div>
        <div className="grid gap-4 p-6 xl:grid-cols-3">
          {studentPracticeRecommendations.map((item) => (
            <article
              key={item.title}
              className="rounded-[18px] border border-[var(--dashboard-border-soft)] p-4"
            >
              <h3 className="text-[1.12rem] font-semibold text-[var(--dashboard-text-strong)]">
                {item.title}
              </h3>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyClassName[item.difficulty]}`}
                >
                  {item.difficulty}
                </span>
                {item.questions}
              </div>
              <p className="mt-3 text-sm text-slate-500">{item.note}</p>
              <button
                type="button"
                className="dashboard-button-primary mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[14px] px-4 py-3 text-sm font-medium transition"
              >
                <Play className="h-4 w-4" />
                Start Practice
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3 md:grid-cols-2">
        {studentPracticeTopics.map((topic) => (
          <article
            key={topic.title}
            className="dashboard-card rounded-[24px] border p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: topic.accent }}
              >
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-[var(--dashboard-success-soft)] px-3 py-1 text-xs font-medium text-[var(--dashboard-success)]">
                {topic.mastery}
              </span>
            </div>

            <h3 className="mt-6 text-[1.2rem] font-semibold text-[var(--dashboard-text-strong)]">
              {topic.title}
            </h3>

            <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
              <span>{topic.quizCount}</span>
              <span>{topic.totalQuestions}</span>
            </div>

            <div className="mt-3 h-2.5 rounded-full bg-[var(--dashboard-border)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: topic.progressWidth,
                  backgroundColor: topic.accent,
                }}
              />
            </div>

            <button
              type="button"
              className="dashboard-button-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[14px] px-4 py-3 text-sm font-medium transition"
            >
              <Play className="h-4 w-4" />
              Practice Now
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

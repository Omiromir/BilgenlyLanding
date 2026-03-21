import { BookOpen, Clock3, Plus } from "lucide-react";
import { Link } from "react-router";
import { cn } from "../../../components/ui/utils";
import { SectionCard } from "../../../features/dashboard/components/SectionCard";
import { StatCard } from "../../../features/dashboard/components/StatCard";
import {
  teacherInsights,
  teacherOverviewStats,
  teacherRecentQuizzes,
} from "../../../features/dashboard/mock/teacherOverview";

const insightToneClassName = {
  blue: "text-[var(--dashboard-brand)]",
  amber: "text-[var(--dashboard-warning)]",
  emerald: "text-[var(--dashboard-success)]",
} as const;

export function TeacherOverviewPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[3.25rem] font-semibold tracking-[-0.04em] text-[var(--dashboard-text-strong)]">
          Welcome back, Professor!
        </h1>
        <p className="mt-2 text-[1.05rem] text-slate-500">
          Here&apos;s what&apos;s happening with your classes today.
        </p>
      </div>

      <section className="dashboard-hero overflow-hidden rounded-[30px] px-10 py-11 text-white">
        <div className="flex items-center justify-between gap-8">
          <div className="max-w-[760px]">
            <h2 className="text-[2.05rem] font-semibold tracking-[-0.03em]">
              Generate a New Quiz with AI
            </h2>
            <p className="mt-4 text-[1.05rem] leading-8 text-white/90">
              Upload your lecture materials or paste text content. Our AI will
              generate comprehensive quiz questions in under a minute.
            </p>

            <Link
              to="/dashboard/teacher/generate-quiz"
              className="mt-9 inline-flex items-center gap-3 rounded-[18px] bg-white px-8 py-4 text-[1.05rem] font-medium text-[var(--dashboard-brand)] shadow-sm transition hover:bg-[var(--dashboard-surface-muted)]"
            >
              <Plus className="h-5 w-5" />
              Create Quiz from PDF
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="h-40 w-40 rounded-[28px] bg-white/12" />
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {teacherOverviewStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Recent Quizzes">
          <div className="space-y-4">
            {teacherRecentQuizzes.map((quiz) => (
              <article
                key={quiz.title}
                className="rounded-[22px] border border-slate-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[1.15rem] font-semibold text-[var(--dashboard-text-strong)]">
                      {quiz.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-5 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {quiz.questionCount}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        {quiz.className}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-[var(--dashboard-success)]">
                    {quiz.accuracy}
                  </span>
                </div>

                <div className="mt-5 flex gap-3">
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
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Topics Students Struggle With">
          <div className="space-y-4">
            {teacherInsights.map((insight) => (
              <article
                key={insight.title}
                className="rounded-[22px] border border-slate-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[1.15rem] font-semibold text-[var(--dashboard-text-strong)]">
                      {insight.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {insight.detail}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-lg font-semibold",
                      insightToneClassName[insight.tone]
                    )}
                  >
                    {insight.value}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

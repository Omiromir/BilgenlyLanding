import { BookOpen, Medal, Play, Sparkles, Timer } from "lucide-react";
import { Link } from "react-router";
import { cn } from "../../../components/ui/utils";
import { SectionCard } from "../../../features/dashboard/components/SectionCard";
import { StatCard } from "../../../features/dashboard/components/StatCard";
import {
  studentAssignments,
  studentOverviewStats,
  studentResults,
} from "../../../features/dashboard/mock/studentOverview";

const scoreToneClassName = {
  blue: "text-[var(--dashboard-brand)]",
  emerald: "text-[var(--dashboard-success)]",
} as const;

export function StudentOverviewPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[3.1rem] font-semibold tracking-[-0.04em] text-[var(--dashboard-text-strong)]">
          Welcome back, Student!
        </h1>
        <p className="mt-2 text-[1.05rem] text-slate-500">
          Keep up the great work on your learning journey.
        </p>
      </div>

      <section className="dashboard-hero overflow-hidden rounded-[30px] px-10 py-11 text-white">
        <div className="flex items-center justify-between gap-8">
          <div className="max-w-[760px]">
            <h2 className="text-[2.05rem] font-semibold tracking-[-0.03em]">
              Continue Your Learning
            </h2>
            <p className="mt-4 text-[1.05rem] leading-8 text-white/90">
              You have 3 quizzes assigned. Jump back in and keep your streak
              going!
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/dashboard/student/join-quiz"
                className="inline-flex items-center gap-3 rounded-[18px] bg-white px-7 py-4 text-[1.02rem] font-medium text-[var(--dashboard-brand)] shadow-sm transition hover:bg-[var(--dashboard-surface-muted)]"
              >
                <Sparkles className="h-5 w-5" />
                Join Quiz by Code
              </Link>
              <Link
                to="/dashboard/student/practice"
                className="inline-flex items-center gap-3 rounded-[18px] border border-white/25 bg-white/10 px-7 py-4 text-[1.02rem] font-medium text-white transition hover:bg-white/15"
              >
                <Play className="h-5 w-5" />
                Practice Mode
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="h-40 w-40 rounded-[28px] bg-white/12" />
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {studentOverviewStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Assigned Quizzes">
          <div className="space-y-4">
            {studentAssignments.map((assignment) => (
              <article
                key={assignment.title}
                className="rounded-[22px] border border-slate-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[1.15rem] font-semibold text-[var(--dashboard-text-strong)]">
                      {assignment.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-5 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {assignment.questionCount}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        {assignment.duration}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[var(--dashboard-warning)]">
                    {assignment.dueDate}
                  </span>
                </div>

                <button
                  type="button"
                  className="dashboard-button-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[14px] px-4 py-3 text-sm font-medium transition"
                >
                  <Play className="h-4 w-4" />
                  Start Quiz
                </button>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Results">
          <div className="space-y-4">
            {studentResults.map((result, index) => (
              <article
                key={result.title}
                className="flex items-start justify-between gap-4 rounded-[18px] px-3 py-4"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-[var(--dashboard-warning)]">
                    {index < 2 ? (
                      <Medal className="h-5 w-5" />
                    ) : (
                      <span className="inline-block h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-[1.12rem] font-semibold text-[var(--dashboard-text-strong)]">
                      {result.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{result.date}</p>
                  </div>
                </div>

                <span
                  className={cn(
                    "text-[1.8rem] font-semibold tracking-[-0.03em]",
                    scoreToneClassName[result.scoreTone]
                  )}
                >
                  {result.score}
                </span>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

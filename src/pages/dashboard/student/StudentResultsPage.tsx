import {
  Award,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { SectionCard } from "../../../features/dashboard/components/SectionCard";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";
import {
  studentDetailedResults,
  studentResultSummary,
  studentScoreProgress,
} from "../../../features/dashboard/mock/studentWorkspace";

const summaryIcons = [TrendingUp, CheckCircle2, Award, Clock3] as const;
const summaryColors = [
  "bg-[var(--dashboard-brand-soft-alt)] text-[var(--dashboard-brand)]",
  "bg-[var(--dashboard-brand-soft-alt)] text-[var(--dashboard-brand)]",
  "bg-[var(--dashboard-brand-soft)] text-[var(--dashboard-brand-strong)]",
  "bg-[var(--dashboard-brand-soft)] text-[var(--dashboard-brand-strong)]",
] as const;

export function StudentResultsPage() {
  const meta = useDashboardPageMeta();
  const recent = studentDetailedResults[0];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[3rem] font-semibold tracking-[-0.04em] text-[var(--dashboard-text-strong)]">
          {meta?.title ?? "My Results"}
        </h1>
        <p className="mt-2 text-[1.05rem] text-slate-500">
          Track your progress and identify areas for improvement
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {studentResultSummary.map((item, index) => {
          const Icon = summaryIcons[index];

          return (
            <article
              key={item.label}
              className="dashboard-card rounded-[24px] border p-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${summaryColors[index]}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--dashboard-text-strong)]">{item.label}</p>
                </div>
              </div>
              <p className="mt-4 text-[2.15rem] font-semibold tracking-[-0.03em] text-[var(--dashboard-text-strong)]">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-[var(--dashboard-brand)]">{item.note}</p>
            </article>
          );
        })}
      </div>

      <SectionCard title="Score Progress">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={studentScoreProgress}
              margin={{ top: 8, right: 8, left: -14, bottom: 0 }}
            >
              <CartesianGrid stroke="#E8EDF6" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#62708B", fontSize: 12 }}
                axisLine={{ stroke: "#D9E1EF" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#62708B", fontSize: 12 }}
                axisLine={{ stroke: "#D9E1EF" }}
                tickLine={false}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#5B4CF0"
                strokeWidth={2.5}
                dot={{ r: 3.5, strokeWidth: 2, fill: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-[var(--dashboard-brand)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--dashboard-brand)]" />
          Score %
        </div>
      </SectionCard>

      <SectionCard title="Recent Quiz Results">
        <article className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[1.18rem] font-semibold text-[var(--dashboard-text-strong)]">
                {recent.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{recent.date}</p>
            </div>
            <div className="text-right">
              <p className="text-[2rem] font-semibold text-[var(--dashboard-brand)]">
                {recent.score}
              </p>
              <p className="text-sm text-slate-500">{recent.correct}/20 correct</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--dashboard-brand)]" />
              Correct: {recent.correct}
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[var(--dashboard-brand-strong)]" />
              Incorrect: {recent.incorrect}
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[var(--dashboard-brand)]" />
              Time: {recent.duration}
            </div>
          </div>

          <div className="rounded-[12px] border border-[var(--dashboard-border)] bg-[var(--dashboard-brand-soft-alt)] px-4 py-3 text-sm text-[var(--dashboard-text-strong)]">
            {recent.feedback}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="dashboard-button-primary flex-1 rounded-[14px] px-4 py-3 text-sm font-medium transition"
            >
              Review Answers
            </button>
            <button
              type="button"
              className="dashboard-button-secondary rounded-[14px] px-4 py-3 text-sm font-medium transition"
            >
              Retake Quiz
            </button>
          </div>
        </article>
      </SectionCard>
    </div>
  );
}

import {
  Award,
  BarChart3,
  CircleDot,
  TrendingUp,
  Users,
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { SectionCard } from "../../../features/dashboard/components/SectionCard";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";
import {
  teacherAnalyticsSummary,
  teacherCompletionStatus,
  teacherScoreTrend,
  teacherStudentsNeedingSupport,
  teacherTopicPerformance,
} from "../../../features/dashboard/mock/teacherWorkspace";

const summaryIcons = [TrendingUp, Users, CircleDot, Award] as const;

export function TeacherAnalyticsPage() {
  const meta = useDashboardPageMeta();

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[3rem] font-semibold tracking-[-0.04em] text-[var(--dashboard-text-strong)]">
          {meta?.title ?? "Analytics"}
        </h1>
        <p className="mt-2 text-[1.05rem] text-slate-500">
          Track student performance and identify areas for improvement
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {teacherAnalyticsSummary.map((item, index) => {
          const Icon = summaryIcons[index];

          return (
            <article
              key={item.title}
              className="dashboard-card rounded-[24px] border p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <p className="mt-2 text-[2.15rem] font-semibold tracking-[-0.03em] text-[var(--dashboard-text-strong)]">
                    {item.value}
                  </p>
                  {item.change ? (
                    <p className="mt-2 text-sm text-[var(--dashboard-brand)]">{item.change}</p>
                  ) : null}
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white ${item.iconColor}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Score Trends Over Time">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={teacherScoreTrend} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                <CartesianGrid stroke="#E8EDF6" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: "#62708B", fontSize: 12 }} axisLine={{ stroke: "#D9E1EF" }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#62708B", fontSize: 12 }} axisLine={{ stroke: "#D9E1EF" }} tickLine={false} />
                <Line type="monotone" dataKey="value" stroke="#5B4CF0" strokeWidth={2.5} dot={{ r: 3.5, strokeWidth: 2, fill: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-[var(--dashboard-brand)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--dashboard-brand)]" />
            Average Score
          </div>
        </SectionCard>

        <SectionCard title="Performance by Topic">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teacherTopicPerformance} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                <CartesianGrid stroke="#E8EDF6" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: "#62708B", fontSize: 12 }} axisLine={{ stroke: "#D9E1EF" }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#62708B", fontSize: 12 }} axisLine={{ stroke: "#D9E1EF" }} tickLine={false} />
                <Bar dataKey="value" fill="#5146DF" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-[var(--dashboard-brand)]">
            <span className="h-3 w-3 bg-[var(--dashboard-brand)]" />
            Average Score
          </div>
        </SectionCard>

        <SectionCard title="Quiz Completion Status">
          <div className="flex h-[300px] items-center justify-center">
            <div className="relative h-[210px] w-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={teacherCompletionStatus}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={0}
                    outerRadius={100}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {teacherCompletionStatus.map((entry) => (
                      <Cell key={entry.label} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-28 w-28 rounded-full bg-white" />
              </div>
            </div>
          </div>
          <div className="-mt-2 text-center text-[1.02rem] font-medium text-[var(--dashboard-brand)]">
            Completed 82%
          </div>
        </SectionCard>

        <SectionCard title="Students Needing Support">
          <div className="space-y-4">
            {teacherStudentsNeedingSupport.map((student) => (
              <article
                key={student.name}
                className="rounded-[16px] border border-[var(--dashboard-border)] bg-[var(--dashboard-brand-soft)] px-5 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[1.05rem] font-semibold text-[var(--dashboard-text-strong)]">
                      {student.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{student.issue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[1.8rem] font-semibold text-[var(--dashboard-brand-strong)]">
                      {student.score}
                    </p>
                    <button
                      type="button"
                      className="mt-1 text-sm font-medium text-[var(--dashboard-brand)]"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

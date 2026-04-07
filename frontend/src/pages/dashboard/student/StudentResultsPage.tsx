import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Award,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "../../../components/icons/AppIcons";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useQuizSessions } from "../../../app/providers/QuizSessionProvider";
import { DashboardPageHeader } from "../../../features/dashboard/components/DashboardPageHeader";
import {
  DashboardButton,
  DashboardSearchField,
  dashboardIconTextRowClassName,
  dashboardPageClassName,
  dashboardStatsGridClassName,
} from "../../../features/dashboard/components/DashboardPrimitives";
import { SectionCard } from "../../../features/dashboard/components/SectionCard";
import { StatCard } from "../../../features/dashboard/components/StatCard";
import { buildQuizSessionPath, buildQuizSessionSearch } from "../../../features/quiz-session/quizRouting";
import {
  formatQuizAttemptDate,
  formatQuizAttemptDuration,
  formatQuizScore,
  getQuizSessionResultSummary,
} from "../../../features/quiz-session/quizSessionUtils";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";

const summaryIcons = [TrendingUp, CheckCircle2, Award, Clock3] as const;
const summaryColors = [
  "bg-[var(--dashboard-brand-soft-alt)] text-[var(--dashboard-brand)]",
  "bg-[var(--dashboard-brand-soft-alt)] text-[var(--dashboard-brand)]",
  "bg-[var(--dashboard-brand-soft)] text-[var(--dashboard-brand-strong)]",
  "bg-[var(--dashboard-brand-soft)] text-[var(--dashboard-brand-strong)]",
] as const;

function buildSessionLink(sessionId: string, quizId: string, assignmentId?: string) {
  return `${buildQuizSessionPath("student", quizId)}${buildQuizSessionSearch({
    sessionId,
    assignmentId,
  })}`;
}

function buildQuizLink(quizId: string, assignmentId?: string) {
  return `${buildQuizSessionPath("student", quizId)}${buildQuizSessionSearch({
    assignmentId,
  })}`;
}

export function StudentResultsPage() {
  const meta = useDashboardPageMeta();
  const { getCompletedSessionsForRole } = useQuizSessions();
  const completedSessions = getCompletedSessionsForRole("student");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const summary = useMemo(() => {
    if (!completedSessions.length) {
      return [
        {
          label: "Average Score",
          value: "--",
          note: "Complete a quiz to see your trend.",
        },
        {
          label: "Quizzes Completed",
          value: "0",
          note: "Your finished attempts will appear here.",
        },
        {
          label: "Best Score",
          value: "--",
          note: "No attempts yet.",
        },
        {
          label: "Latest Score",
          value: "--",
          note: "Start with any library or class quiz.",
        },
      ];
    }

    const percentages = completedSessions.map(
      (session) => getQuizSessionResultSummary(session).percentage,
    );
    const latestScore = percentages[0];
    const averageScore = Math.round(
      percentages.reduce((total, value) => total + value, 0) / percentages.length,
    );
    const bestScore = Math.max(...percentages);

    return [
      {
        label: "Average Score",
        value: formatQuizScore(averageScore),
        note: `${completedSessions.length} completed ${completedSessions.length === 1 ? "quiz" : "quizzes"}`,
      },
      {
        label: "Quizzes Completed",
        value: String(completedSessions.length),
        note: "Across class and self-study attempts.",
      },
      {
        label: "Best Score",
        value: formatQuizScore(bestScore),
        note:
          bestScore === 100
            ? "Perfect result unlocked."
            : "Your strongest attempt so far.",
      },
      {
        label: "Latest Score",
        value: formatQuizScore(latestScore),
        note: `Recorded ${formatQuizAttemptDate(
          completedSessions[0].finishedAt ?? completedSessions[0].updatedAt,
        )}`,
      },
    ];
  }, [completedSessions]);

  const progressData = useMemo(
    () =>
      completedSessions
        .slice(0, 6)
        .reverse()
        .map((session, index) => ({
          label: `Attempt ${index + 1}`,
          value: getQuizSessionResultSummary(session).percentage,
        })),
    [completedSessions],
  );

  const recentResults = useMemo(
    () =>
      completedSessions
        .filter((session) => {
          const query = deferredSearch.trim().toLowerCase();

          if (!query) {
            return true;
          }

          return [
            session.quiz.title,
            session.quiz.topic,
            session.assignmentContext ? "assigned quiz" : session.sourceLabel,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query);
        })
        .slice(0, 5)
        .map((session) => {
          const result = getQuizSessionResultSummary(session);

          return {
            session,
            result,
            reviewHref: buildSessionLink(
              session.id,
              session.quizId,
              session.assignmentContext?.assignmentId,
            ),
            retakeHref: buildQuizLink(
              session.quizId,
              session.assignmentContext?.assignmentId,
            ),
          };
        }),
    [completedSessions, deferredSearch],
  );

  return (
    <div className={dashboardPageClassName}>
      <DashboardPageHeader
        title={meta?.title ?? "My Results"}
        subtitle="Track real quiz attempts, review what you missed, and jump back into practice from one place."
      />

      <div className={dashboardStatsGridClassName}>
        {summary.map((item, index) => {
          const Icon = summaryIcons[index];

          return (
            <StatCard
              key={item.label}
              title={item.label}
              value={item.value}
              change={item.note}
              icon={Icon}
              iconClassName={summaryColors[index]}
            />
          );
        })}
      </div>

      <SectionCard title="Score Progress">
        {progressData.length ? (
          <>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData}
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
                    stroke="#16B59D"
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
          </>
        ) : (
          <div className="rounded-[18px] border border-dashed border-[var(--dashboard-border-soft)] bg-[var(--dashboard-surface-muted)] px-5 py-6">
            <p className="font-semibold text-[var(--dashboard-text-strong)]">
              No score data yet
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--dashboard-text-soft)]">
              Finish your first quiz and the recent score trend will appear here automatically.
            </p>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Recent Quiz Results"
        description="Search by quiz title, topic, or source to jump straight to the result you want."
        contentClassName="space-y-5"
      >
        <DashboardSearchField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search results by quiz title, topic, or source..."
          inputClassName="border-[var(--dashboard-border-soft)] bg-white"
        />

        {recentResults.length ? (
          <div className="space-y-5">
            {recentResults.map(({ session, result, reviewHref, retakeHref }) => (
              <article
                key={session.id}
                className="rounded-[22px] border border-[var(--dashboard-border-soft)] bg-white px-5 py-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[1.18rem] font-semibold text-[var(--dashboard-text-strong)]">
                      {session.quiz.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--dashboard-text-soft)]">
                      {formatQuizAttemptDate(
                        session.finishedAt ?? session.updatedAt,
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[2rem] font-semibold text-[var(--dashboard-brand)]">
                      {formatQuizScore(result.percentage)}
                    </p>
                    <p className="text-sm text-[var(--dashboard-text-soft)]">
                      {result.correctCount}/{result.totalQuestions} correct
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 text-sm text-[var(--dashboard-text-soft)] md:grid-cols-2">
                  <div className={dashboardIconTextRowClassName}>
                    <CheckCircle2 className="h-4 w-4 text-[var(--dashboard-brand)]" />
                    Correct: {result.correctCount}
                  </div>
                  <div className={dashboardIconTextRowClassName}>
                    <Award className="h-4 w-4 text-[var(--dashboard-brand-strong)]" />
                    Incorrect: {result.incorrectCount}
                  </div>
                  <div className={dashboardIconTextRowClassName}>
                    <Clock3 className="h-4 w-4 text-[var(--dashboard-brand)]" />
                    Time: {formatQuizAttemptDuration(session)}
                  </div>
                  <div className={dashboardIconTextRowClassName}>
                    <TrendingUp className="h-4 w-4 text-[var(--dashboard-brand)]" />
                    Source: {session.assignmentContext ? "Assigned quiz" : session.sourceLabel}
                  </div>
                </div>

                <div className="mt-5 rounded-[12px] border border-[var(--dashboard-border)] bg-[var(--dashboard-brand-soft-alt)] px-4 py-3 text-sm text-[var(--dashboard-text-strong)]">
                  Review feedback is saved with this attempt. Open the result to see each answer and explanation again.
                </div>

                <div className="mt-5 flex gap-3">
                  <DashboardButton asChild type="button" size="lg" className="flex-1">
                    <Link to={reviewHref}>Review Answers</Link>
                  </DashboardButton>
                  <DashboardButton asChild type="button" variant="secondary" size="lg">
                    <Link to={retakeHref}>Retake Quiz</Link>
                  </DashboardButton>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] border border-dashed border-[var(--dashboard-border-soft)] bg-[var(--dashboard-surface-muted)] px-5 py-6">
            <p className="font-semibold text-[var(--dashboard-text-strong)]">
              {search.trim() ? "No quiz results match this search" : "No completed quiz attempts yet"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--dashboard-text-soft)]">
              {search.trim()
                ? "Try a different title, topic, or source keyword to find the result you need."
                : "Start a quiz from your library or classes, finish it, and the full results history will appear here."}
            </p>
            {!search.trim() ? (
              <DashboardButton asChild type="button" size="lg" className="mt-5">
                <Link to="/dashboard/student/quiz-library">Open Quiz Library</Link>
              </DashboardButton>
            ) : null}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

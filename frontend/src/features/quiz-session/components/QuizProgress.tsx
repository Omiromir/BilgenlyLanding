import {
  DashboardBadge,
  DashboardSurface,
} from "../../dashboard/components/DashboardPrimitives";

interface QuizProgressProps {
  questionNumber: number;
  totalQuestions: number;
  answeredCount: number;
}

export function QuizProgress({
  questionNumber,
  totalQuestions,
  answeredCount,
}: QuizProgressProps) {
  const progressValue =
    totalQuestions === 0 ? 0 : Math.round((answeredCount / totalQuestions) * 100);

  return (
    <DashboardSurface radius="lg" padding="md" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--dashboard-text-soft)]">
            Quiz progress
          </p>
          <h2 className="mt-1 text-[1.35rem] font-semibold text-[var(--dashboard-text-strong)]">
            Question {questionNumber} of {totalQuestions}
          </h2>
        </div>

        <DashboardBadge tone="info" size="md">
          {answeredCount} answered
        </DashboardBadge>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[var(--dashboard-surface-muted)]">
        <div
          className="h-full rounded-full bg-[var(--dashboard-brand)] transition-[width] duration-300"
          style={{ width: `${progressValue}%` }}
        />
      </div>
    </DashboardSurface>
  );
}

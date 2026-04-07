import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileJson,
  RefreshCw,
  XCircle,
} from "../../../components/icons/AppIcons";
import { cn } from "../../../components/ui/utils";
import type { QuizLibraryVisibility } from "../../dashboard/components/quiz-library/quizLibraryTypes";
import {
  DashboardBadge,
  DashboardButton,
  DashboardSurface,
  dashboardSelectVariants,
} from "../../dashboard/components/DashboardPrimitives";
import type { QuizBuilderCopy, ValidationIssue } from "../quizBuilderTypes";

interface QuizBuilderReviewChecksProps {
  copy: QuizBuilderCopy;
  handleDownloadQuizExport: (format: "json" | "txt") => void;
  handleGenerateQuiz: () => void;
  mode: "teacher" | "student";
  publishVisibility: QuizLibraryVisibility;
  setPublishVisibility: (value: QuizLibraryVisibility) => void;
  setSelectedQuestionId: (questionId: string) => void;
  validationIssues: ValidationIssue[];
}

export function QuizBuilderReviewChecks({
  copy,
  handleDownloadQuizExport,
  handleGenerateQuiz,
  mode,
  publishVisibility,
  setPublishVisibility,
  setSelectedQuestionId,
  validationIssues,
}: QuizBuilderReviewChecksProps) {
  return (
    <DashboardSurface asChild radius="xl" padding="lg">
      <section className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-[1.45rem] font-semibold text-[var(--dashboard-text-strong)]">
              {mode === "student" ? "Practice checks" : "Validation and publishing checks"}
            </h2>
            <p className="mt-2 text-[15px] leading-7 text-[var(--dashboard-text-soft)]">
              {mode === "student"
                ? "Use this panel to catch gaps, adjust visibility, and regenerate the draft when you want a cleaner practice set."
                : "Use this panel for visibility, exports, and a final quality check while the main actions stay in the top editor bar."}
            </p>
          </div>
          <DashboardBadge
            tone={validationIssues.length === 0 ? "success" : "warning"}
            size="md"
          >
            {validationIssues.length === 0
              ? "No blocking issues"
              : `${validationIssues.length} issues to review`}
          </DashboardBadge>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-3">
            {validationIssues.length === 0 ? (
              <div className="rounded-[24px] border border-[var(--dashboard-success)] bg-[var(--dashboard-success-soft)]/55 px-5 py-5">
                <div className="flex items-center gap-3 text-[var(--dashboard-success)]">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">{copy.reviewReadyLabel}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--dashboard-text-soft)]">
                  {mode === "student"
                    ? "The set looks ready for personal practice. Start the self-test or save it to revisit later."
                    : "All questions have content and answer keys. You can still refine wording, but nothing critical is missing."}
                </p>
              </div>
            ) : (
              validationIssues.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  onClick={() => {
                    setSelectedQuestionId(issue.questionId);
                  }}
                  className={cn(
                    "w-full rounded-[22px] border px-5 py-4 text-left transition",
                    issue.tone === "danger"
                      ? "border-[var(--dashboard-danger)] bg-[var(--dashboard-danger-soft)]/45"
                      : "border-[var(--dashboard-warning)] bg-[var(--dashboard-warning-soft)]/50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {issue.tone === "danger" ? (
                      <XCircle className="h-4.5 w-4.5 text-[var(--dashboard-danger)]" />
                    ) : (
                      <AlertCircle className="h-4.5 w-4.5 text-[var(--dashboard-warning)]" />
                    )}
                    <span className="font-semibold text-[var(--dashboard-text-strong)]">
                      {issue.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--dashboard-text-soft)]">
                    {issue.detail}
                  </p>
                </button>
              ))
            )}
          </div>

          <div className="space-y-3">
            <label className="block space-y-2 rounded-[22px] border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-surface-muted)] px-4 py-4">
              <span className="text-sm font-semibold text-[var(--dashboard-text-strong)]">
                {mode === "teacher" ? "Save Quiz visibility" : "Practice set visibility"}
              </span>
              <select
                value={publishVisibility}
                onChange={(event) =>
                  setPublishVisibility(event.target.value as QuizLibraryVisibility)
                }
                className={cn(
                  dashboardSelectVariants({ size: "md" }),
                  "w-full border-[var(--dashboard-border-soft)] bg-white",
                )}
              >
                <option value="private">Private</option>
                <option value="public">Public Library</option>
              </select>
              <p className="text-sm leading-6 text-[var(--dashboard-text-soft)]">
                {mode === "teacher"
                  ? "Private quizzes stay in your owner views. Public quizzes also appear in the shared library."
                  : "Private practice sets stay in your personal library. Public ones also appear in shared discovery."}
              </p>
            </label>

            {mode === "teacher" ? (
              <>
                <DashboardButton
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => handleDownloadQuizExport("json")}
                >
                  <FileJson className="h-4.5 w-4.5" />
                  Export as JSON
                </DashboardButton>
                <DashboardButton
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => handleDownloadQuizExport("txt")}
                >
                  <Download className="h-4.5 w-4.5" />
                  Export as Text
                </DashboardButton>
              </>
            ) : null}

            <DashboardButton
              type="button"
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handleGenerateQuiz}
            >
              <RefreshCw className="h-4.5 w-4.5" />
              Regenerate
            </DashboardButton>
          </div>
        </div>
      </section>
    </DashboardSurface>
  );
}

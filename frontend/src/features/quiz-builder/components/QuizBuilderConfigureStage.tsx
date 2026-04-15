import { AlertCircle } from "../../../components/icons/AppIcons";
import { cn } from "../../../components/ui/utils";
import {
  DashboardButton,
  DashboardSurface,
  dashboardInputVariants,
  dashboardInsetBlockClassName,
  dashboardSelectVariants,
  dashboardTextareaVariants,
} from "../../dashboard/components/DashboardPrimitives";
import { QUIZ_BUILDER_LIMITS, clampText } from "../quizBuilderLimits";
import { questionTypeOptions } from "../quizBuilderCopy";
import type { ParsedSource, QuestionType, QuizBuilderCopy } from "../quizBuilderTypes";

interface QuizBuilderConfigureStageProps {
  canGenerate: boolean;
  contextValue: string;
  copy: QuizBuilderCopy;
  focus: string;
  handleGenerateQuiz: () => void;
  handleReplaceSource: () => void;
  instructions: string;
  mode: "teacher" | "student";
  parsedSource: ParsedSource | null;
  questionCount: number;
  questionTypes: QuestionType[];
  quizTitle: string;
  setContextValue: (value: string) => void;
  setFocus: (value: string) => void;
  setInstructions: (value: string) => void;
  setQuestionCount: (value: number) => void;
  setQuizTitle: (value: string) => void;
  toggleQuestionType: (value: QuestionType) => void;
}

export function QuizBuilderConfigureStage({
  canGenerate,
  contextValue,
  copy,
  focus,
  handleGenerateQuiz,
  handleReplaceSource,
  instructions,
  mode,
  parsedSource,
  questionCount,
  questionTypes,
  quizTitle,
  setContextValue,
  setFocus,
  setInstructions,
  setQuestionCount,
  setQuizTitle,
  toggleQuestionType,
}: QuizBuilderConfigureStageProps) {
  return (
    <DashboardSurface asChild radius="xl" padding="lg">
      <section className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-[1.45rem] font-semibold text-[var(--dashboard-text-strong)]">
              Review source and configure quiz
            </h2>
            <p className="mt-2 text-[15px] leading-7 text-[var(--dashboard-text-soft)]">
              {copy.configureDescription}
            </p>
          </div>
          <DashboardButton
            type="button"
            variant="ghost"
            size="lg"
            onClick={handleReplaceSource}
          >
            Replace source
          </DashboardButton>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className={dashboardInsetBlockClassName}>
            <p className="text-sm text-[var(--dashboard-text-soft)]">Source</p>
            <p className="mt-2 font-semibold text-[var(--dashboard-text-strong)]">
              {parsedSource?.label}
            </p>
          </div>
          <div className={dashboardInsetBlockClassName}>
            <p className="text-sm text-[var(--dashboard-text-soft)]">Estimated length</p>
            <p className="mt-2 font-semibold text-[var(--dashboard-text-strong)]">
              {parsedSource?.lengthLabel}
            </p>
          </div>
          <div className={dashboardInsetBlockClassName}>
            <p className="text-sm text-[var(--dashboard-text-soft)]">Coverage</p>
            <p className="mt-2 font-semibold text-[var(--dashboard-text-strong)]">
              {parsedSource?.pageEstimate}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="w-full rounded-[24px] border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-surface-muted)] px-5 py-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold text-[var(--dashboard-text-strong)]">
                Extracted text preview
              </h3>
              <span className="text-sm text-[var(--dashboard-text-soft)]">
                {parsedSource?.characterCount} characters
              </span>
            </div>
            <p className="mt-4 overflow-hidden break-words whitespace-pre-wrap text-[15px] leading-7 text-[var(--dashboard-text-soft)] [overflow-wrap:anywhere]">
              {parsedSource?.extractedText}
            </p>
          </div>

          {parsedSource?.warning ? (
            <div className="max-w-[560px] rounded-[24px] border border-[var(--dashboard-warning)] bg-[var(--dashboard-warning-soft)]/60 px-5 py-5">
              <div className="flex items-center gap-3 text-[var(--dashboard-warning)]">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">Some content may need a quick review</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--dashboard-text-soft)]">
                {parsedSource.warning}
              </p>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--dashboard-text-strong)]">
              {mode === "student" ? "Quiz title (optional)" : "Quiz title"}
            </span>
            <input
              value={quizTitle}
              onChange={(event) =>
                setQuizTitle(
                  clampText(event.target.value, QUIZ_BUILDER_LIMITS.quizTitle),
                )
              }
              maxLength={QUIZ_BUILDER_LIMITS.quizTitle}
              placeholder={
                mode === "student"
                  ? "Auto-generate from my study topic"
                  : "Cell Structure Review Quiz"
              }
              className={dashboardInputVariants({ size: "lg" })}
            />
            <p className="text-xs text-[var(--dashboard-text-faint)]">
              {quizTitle.length}/{QUIZ_BUILDER_LIMITS.quizTitle}
            </p>
          </label>
          {mode === "student" ? (
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--dashboard-text-strong)]">
                {copy.contextLabel}
              </span>
              <select
                value={contextValue}
                onChange={(event) => setContextValue(event.target.value)}
                className={cn(dashboardSelectVariants({ size: "md" }), "w-full")}
              >
                {copy.contextOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--dashboard-text-strong)]">
              Number of questions
            </span>
            <select
              value={questionCount}
              onChange={(event) => setQuestionCount(Number(event.target.value))}
              className={cn(dashboardSelectVariants({ size: "md" }), "w-full")}
            >
              {[5, 8, 10, 12, 15].map((value) => (
                <option key={value} value={value}>
                  {value} questions
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--dashboard-text-strong)]">
              Topic focus
            </span>
            <input
              value={focus}
              onChange={(event) =>
                setFocus(
                  clampText(event.target.value, QUIZ_BUILDER_LIMITS.topicFocus),
                )
              }
              maxLength={QUIZ_BUILDER_LIMITS.topicFocus}
              placeholder="Protein structure"
              className={dashboardInputVariants({ size: "md" })}
            />
            <p className="text-xs text-[var(--dashboard-text-faint)]">
              {focus.length}/{QUIZ_BUILDER_LIMITS.topicFocus}
            </p>
          </label>
        </div>

        {mode === "teacher" ? (
          <>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[var(--dashboard-text-strong)]">
                Question type mix
              </p>
              <div className="flex flex-wrap gap-3">
                {questionTypeOptions.map((type) => {
                  const checked = questionTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleQuestionType(type)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition",
                        checked
                          ? "border-[var(--dashboard-brand)] bg-[var(--dashboard-brand-soft-alt)] text-[var(--dashboard-brand)]"
                          : "border-[var(--dashboard-border)] text-[var(--dashboard-text-soft)] hover:bg-[var(--dashboard-surface-muted)]",
                      )}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--dashboard-text-strong)]">
                Additional instructions
              </span>
              <textarea
                value={instructions}
                onChange={(event) =>
                  setInstructions(
                    clampText(
                      event.target.value,
                      QUIZ_BUILDER_LIMITS.instructions,
                    ),
                  )
                }
                maxLength={QUIZ_BUILDER_LIMITS.instructions}
                className={dashboardTextareaVariants({ size: "md" })}
              />
              <p className="text-xs text-[var(--dashboard-text-faint)]">
                {instructions.length}/{QUIZ_BUILDER_LIMITS.instructions}
              </p>
            </label>
          </>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <DashboardButton
            type="button"
            size="xl"
            onClick={handleGenerateQuiz}
            disabled={!canGenerate}
            className="min-w-[220px]"
          >
            {mode === "student" ? "Generate Practice Quiz" : "Generate Quiz"}
          </DashboardButton>
          <p className="text-sm text-[var(--dashboard-text-soft)]">
            {mode === "student"
              ? "You will be able to start practicing right away after generation."
              : "The draft will stay editable before export or test run."}
          </p>
        </div>
      </section>
    </DashboardSurface>
  );
}

import { CheckCircle2, ChevronRight } from "../../../components/icons/AppIcons";
import { cn } from "../../../components/ui/utils";
import { quizSteps } from "../quizBuilderCopy";

interface QuizBuilderStepperProps {
  currentStepIndex: number;
}

export function QuizBuilderStepper({
  currentStepIndex,
}: QuizBuilderStepperProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {quizSteps.map((item, index) => {
        const isActive = index === currentStepIndex;
        const isComplete = index < currentStepIndex;

        return (
          <div key={item.key} className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
                  isActive && "bg-[var(--dashboard-brand)] text-white",
                  isComplete &&
                    "bg-[var(--dashboard-success-soft)] text-[var(--dashboard-success)]",
                  !isActive &&
                    !isComplete &&
                    "bg-[var(--dashboard-surface-muted)] text-[var(--dashboard-text-soft)]",
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-4.5 w-4.5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "text-[1.02rem]",
                  isActive && "font-medium text-[var(--dashboard-brand)]",
                  isComplete && "font-medium text-[var(--dashboard-success)]",
                  !isActive &&
                    !isComplete &&
                    "text-[var(--dashboard-text-soft)]",
                )}
              >
                {item.label}
              </span>
            </div>
            {index < quizSteps.length - 1 ? (
              <ChevronRight className="h-5 w-5 text-[var(--dashboard-text-faint)]" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

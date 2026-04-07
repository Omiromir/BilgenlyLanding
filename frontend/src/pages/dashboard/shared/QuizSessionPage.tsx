import { useMemo } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { useQuizLibrary } from "../../../app/providers/QuizLibraryProvider";
import { useQuizSessions } from "../../../app/providers/QuizSessionProvider";
import { useTeacherClasses } from "../../../app/providers/TeacherClassesProvider";
import {
  getAssignmentLevelStatus,
  toAssignmentConstraintSource,
} from "../../../features/assignments/assignmentConstraints";
import { useAssignmentConstraints } from "../../../features/assignments/useAssignmentConstraints";
import {
  DashboardButton,
  DashboardSurface,
  dashboardPageNarrowClassName,
} from "../../../features/dashboard/components/DashboardPrimitives";
import { QuizPlayer } from "../../../features/quiz-session/components/QuizPlayer";
import { QuizResultsSummary } from "../../../features/quiz-session/components/QuizResultsSummary";
import { QuizReviewList } from "../../../features/quiz-session/components/QuizReviewList";
import { QuizStartScreen } from "../../../features/quiz-session/components/QuizStartScreen";
import {
  buildQuizSessionPath,
  buildQuizSessionSearch,
  type QuizLaunchNavigationState,
} from "../../../features/quiz-session/quizRouting";

interface QuizSessionPageProps {
  viewerRole: "teacher" | "student";
}

function resolveAssignmentContext(
  assignmentId: string | null,
  classes: ReturnType<typeof useTeacherClasses>["classes"],
) {
  if (!assignmentId) {
    return undefined;
  }

  for (const teacherClass of classes) {
    const assignment = teacherClass.assignedQuizzes.find(
      (candidate) => candidate.id === assignmentId,
    );

    if (!assignment) {
      continue;
    }

    return {
      assignmentId: assignment.assignmentId,
      classId: teacherClass.id,
      className: teacherClass.name,
      classSubject: teacherClass.subject,
      assignedAt: assignment.assignedAt,
      deadline: assignment.deadline,
      maxAttempts: assignment.maxAttempts,
      allowLateSubmissions: assignment.allowLateSubmissions,
      assignedBy: assignment.assignedBy,
      assignedByName: assignment.assignedByName,
      visibility: assignment.visibility,
      status: getAssignmentLevelStatus(assignment),
    } as const;
  }

  return undefined;
}

export function QuizSessionPage({ viewerRole }: QuizSessionPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const { classes } = useTeacherClasses();
  const { getQuizById } = useQuizLibrary();
  const {
    createSession,
    getLatestCompletedSession,
    getLatestInProgressSession,
    getSessionById,
    sessions,
  } = useQuizSessions();
  const navigationState = (location.state as QuizLaunchNavigationState | null) ?? null;
  const assignmentId = searchParams.get("assignment");
  const sessionId = searchParams.get("session");
  const quiz = quizId ? getQuizById(quizId) : undefined;
  const assignmentContext = useMemo(
    () => resolveAssignmentContext(assignmentId, classes),
    [assignmentId, classes],
  );
  const latestInProgressSession = quiz
    ? getLatestInProgressSession(quiz.id, viewerRole, assignmentId)
    : undefined;
  const latestCompletedSession = quiz
    ? getLatestCompletedSession(quiz.id, viewerRole, assignmentId)
    : undefined;
  const assignmentConstraints = useAssignmentConstraints({
    assignment: assignmentContext
      ? toAssignmentConstraintSource(assignmentContext)
      : null,
    sessions,
    viewerRole,
    refreshIntervalMs: 1000,
  });
  const activeSession =
    sessionId && quiz
      ? (() => {
          const matchingSession = getSessionById(sessionId);

          if (
            !matchingSession ||
            matchingSession.quizId !== quiz.id ||
            matchingSession.viewerRole !== viewerRole
          ) {
            return undefined;
          }

          return matchingSession;
        })()
      : undefined;
  const resolvedBackLink = useMemo(() => {
    if (navigationState?.returnToPath && navigationState.returnToLabel) {
      return {
        path: navigationState.returnToPath,
        label: navigationState.returnToLabel,
        state: navigationState.returnToState,
      };
    }

    if (viewerRole === "student" && assignmentContext) {
      return {
        path: "/dashboard/student/classes",
        label: "Back to classes",
        state: undefined,
      };
    }

    return {
      path:
        viewerRole === "teacher"
          ? "/dashboard/teacher/quiz-library"
          : "/dashboard/student/quiz-library",
      label:
        viewerRole === "teacher"
          ? "Back to quiz library"
          : "Back to quiz library",
      state: undefined,
    };
  }, [assignmentContext, navigationState, viewerRole]);

  if (!quiz) {
    return (
      <div className={dashboardPageNarrowClassName}>
        <DashboardSurface radius="xl" padding="lg" className="space-y-4">
          <h1 className="text-[2rem] font-semibold text-[var(--dashboard-text-strong)]">
            Quiz not found
          </h1>
          <p className="text-sm leading-7 text-[var(--dashboard-text-soft)]">
            This quiz is no longer available in your current library context.
          </p>
          <DashboardButton asChild type="button" size="lg">
            <Link to={resolvedBackLink.path} state={resolvedBackLink.state}>
              {resolvedBackLink.label}
            </Link>
          </DashboardButton>
        </DashboardSurface>
      </div>
    );
  }

  const launchSourceType =
    navigationState?.launchSourceType ?? (assignmentContext ? "assigned" : "quiz-library");
  const launchSourceLabel =
    navigationState?.launchSourceLabel ??
    (assignmentContext ? `${assignmentContext.className} assignment` : quiz.sourceLabel);

  const openSession = (nextSessionId?: string) => {
    navigate(
      `${buildQuizSessionPath(viewerRole, quiz.id)}${buildQuizSessionSearch({
        sessionId: nextSessionId,
        assignmentId,
      })}`,
      {
        replace: false,
        state: navigationState ?? undefined,
      },
    );
  };

  const handleStart = () => {
    if (assignmentConstraints && !assignmentConstraints.canStart) {
      if (assignmentConstraints.canResume && latestInProgressSession) {
        openSession(latestInProgressSession.id);
      }

      return;
    }

    const nextSession = createSession(quiz, {
      viewerRole,
      sourceType: launchSourceType,
      sourceLabel: launchSourceLabel,
      assignmentContext,
    });

    openSession(nextSession.id);
  };

  const handleResume = () => {
    if (!latestInProgressSession) {
      return;
    }

    openSession(latestInProgressSession.id);
  };

  const handleReviewLatest = () => {
    if (!latestCompletedSession) {
      return;
    }

    openSession(latestCompletedSession.id);
  };

  return (
    <div
      className={
        activeSession?.status === "in-progress"
          ? "mx-auto max-w-[1360px] space-y-6"
          : dashboardPageNarrowClassName
      }
    >
      {activeSession?.status === "completed" ? (
        <div className="space-y-6">
          <QuizResultsSummary
            session={activeSession}
            onRetake={assignmentConstraints?.canStart ? handleStart : undefined}
            returnLink={resolvedBackLink}
            secondaryLink={
              viewerRole === "student"
                ? {
                    path: "/dashboard/student/results",
                    label: "Open My Results",
                  }
                : undefined
            }
          />
          <QuizReviewList session={activeSession} />
        </div>
      ) : activeSession?.status === "in-progress" ? (
        <div className="space-y-4">
          <DashboardButton asChild type="button" size="lg" variant="ghost">
            <Link to={resolvedBackLink.path} state={resolvedBackLink.state}>
              Save and exit
            </Link>
          </DashboardButton>
          <QuizPlayer sessionId={activeSession.id} />
        </div>
      ) : (
        <QuizStartScreen
          quiz={quiz}
          assignmentContext={assignmentContext}
          assignmentConstraints={assignmentConstraints}
          latestInProgressSession={latestInProgressSession}
          latestCompletedSession={latestCompletedSession}
          onStart={assignmentConstraints?.canStart === false ? undefined : handleStart}
          onResume={latestInProgressSession ? handleResume : undefined}
          onReviewLatest={latestCompletedSession ? handleReviewLatest : undefined}
          backLink={resolvedBackLink}
        />
      )}
    </div>
  );
}

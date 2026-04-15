import type { QuizSessionSourceType } from "./quizSessionTypes";

export interface QuizLaunchNavigationState {
  launchSourceType?: QuizSessionSourceType;
  launchSourceLabel?: string;
  returnToPath?: string;
  returnToLabel?: string;
  returnToState?: unknown;
}

export function buildQuizSessionPath(
  viewerRole: "teacher" | "student",
  quizId: string,
) {
  return `/dashboard/${viewerRole}/quizzes/${quizId}`;
}

export function buildQuizSessionSearch({
  sessionId,
  assignmentId,
}: {
  sessionId?: string;
  assignmentId?: string | null;
}) {
  const params = new URLSearchParams();

  if (sessionId) {
    params.set("session", sessionId);
  }

  if (assignmentId) {
    params.set("assignment", assignmentId);
  }

  const serialized = params.toString();

  return serialized ? `?${serialized}` : "";
}

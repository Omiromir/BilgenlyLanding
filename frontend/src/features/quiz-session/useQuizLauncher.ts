import { useNavigate } from "react-router";
import { useQuizSessions } from "../../app/providers/QuizSessionProvider";
import {
  buildQuizSessionPath,
  buildQuizSessionSearch,
  type QuizLaunchNavigationState,
} from "./quizRouting";

interface OpenQuizOptions {
  quizId: string;
  viewerRole: "teacher" | "student";
  assignmentId?: string | null;
  preferredSession?: "in-progress" | "completed";
  navigationState?: QuizLaunchNavigationState;
}

export function useQuizLauncher() {
  const navigate = useNavigate();
  const { getLatestCompletedSession, getLatestInProgressSession } =
    useQuizSessions();

  return {
    openQuiz: ({
      quizId,
      viewerRole,
      assignmentId,
      preferredSession,
      navigationState,
    }: OpenQuizOptions) => {
      const matchingSession =
        preferredSession === "completed"
          ? getLatestCompletedSession(quizId, viewerRole, assignmentId)
          : preferredSession === "in-progress"
            ? getLatestInProgressSession(quizId, viewerRole, assignmentId)
            : undefined;
      const path = buildQuizSessionPath(viewerRole, quizId);
      const search = buildQuizSessionSearch({
        sessionId: matchingSession?.id,
        assignmentId,
      });

      navigate(`${path}${search}`, {
        state: navigationState,
      });
    },
  };
}

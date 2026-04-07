import type {
  ClassInvitationNotification,
  ClassInvitationNotificationInput,
  ClassInvitationNotificationStatus,
  DashboardNotification,
  QuizFollowUpKind,
  QuizFollowUpNotification,
  QuizFollowUpNotificationInput,
} from "./notificationTypes";

const notificationDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function createDashboardNotificationId() {
  return `notification-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildClassInvitationNotification(
  input: ClassInvitationNotificationInput,
  options?: {
    existingId?: string;
    createdAt?: string;
    updatedAt?: string;
    read?: boolean;
    status?: ClassInvitationNotificationStatus;
  },
): ClassInvitationNotification {
  const timestamp = options?.updatedAt ?? new Date().toISOString();
  const status = options?.status ?? "pending";
  const message =
    status === "accepted"
      ? `You accepted ${input.senderName}'s invitation to join ${input.relatedClassName}.`
      : status === "declined"
        ? `You declined ${input.senderName}'s invitation to join ${input.relatedClassName}.`
        : status === "removed"
          ? `${input.senderName}'s invitation to join ${input.relatedClassName} is no longer active.`
          : `${input.senderName} invited you to join ${input.relatedClassName}.`;

  return {
    id: options?.existingId ?? createDashboardNotificationId(),
    type: "class_invitation",
    recipientUserId: input.recipientUserId,
    recipientEmail: input.recipientEmail,
    title: `Class invitation: ${input.relatedClassName}`,
    message,
    createdAt: options?.createdAt ?? timestamp,
    updatedAt: timestamp,
    read: options?.read ?? false,
    actionType: "class_invitation",
    relatedClassId: input.relatedClassId,
    relatedClassName: input.relatedClassName,
    senderName: input.senderName,
    senderEmail: input.senderEmail,
    studentId: input.studentId,
    studentName: input.studentName,
    studentEmail: input.studentEmail,
    status,
  };
}

function getQuizFollowUpCopy(kind: QuizFollowUpKind) {
  switch (kind) {
    case "reassign_quiz":
      return {
        titlePrefix: "Quiz Reassigned",
        messagePrefix: "Your teacher asked you to take another attempt on",
      };
    case "follow_up_practice":
      return {
        titlePrefix: "Follow-up Practice",
        messagePrefix: "Your teacher scheduled follow-up practice for",
      };
    case "needs_review":
    default:
      return {
        titlePrefix: "Needs Review",
        messagePrefix: "Your teacher wants you to review",
      };
  }
}

export function buildQuizFollowUpNotification(
  input: QuizFollowUpNotificationInput,
  options?: {
    existingId?: string;
    createdAt?: string;
    updatedAt?: string;
    read?: boolean;
  },
): QuizFollowUpNotification {
  const timestamp = options?.updatedAt ?? new Date().toISOString();
  const copy = getQuizFollowUpCopy(input.followUpKind);

  return {
    id: options?.existingId ?? createDashboardNotificationId(),
    type: "quiz_follow_up",
    recipientUserId: input.recipientUserId,
    recipientEmail: input.recipientEmail,
    title: `${copy.titlePrefix}: ${input.quizTitle}`,
    message: `${copy.messagePrefix} ${input.quizTitle} in ${input.relatedClassName}. Open your class workspace to continue.`,
    createdAt: options?.createdAt ?? timestamp,
    updatedAt: timestamp,
    read: options?.read ?? false,
    actionType: "open_assigned_quiz",
    relatedClassId: input.relatedClassId,
    relatedClassName: input.relatedClassName,
    senderName: input.senderName,
    senderEmail: input.senderEmail,
    studentId: input.studentId,
    studentName: input.studentName,
    studentEmail: input.studentEmail,
    status: "sent",
    quizId: input.quizId,
    quizTitle: input.quizTitle,
    assignmentId: input.assignmentId,
    followUpKind: input.followUpKind,
  };
}

export function sortDashboardNotifications(
  notifications: DashboardNotification[],
) {
  return [...notifications].sort((left, right) => {
    return (
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    );
  });
}

export function formatDashboardNotificationDateTime(date: string) {
  const resolvedDate = new Date(date);

  if (Number.isNaN(resolvedDate.getTime())) {
    return "Invalid date";
  }

  return notificationDateTimeFormatter.format(resolvedDate);
}

export function getNotificationStatusLabel(notification: DashboardNotification) {
  if (notification.type === "quiz_follow_up") {
    return "Sent";
  }

  switch (notification.status) {
    case "accepted":
      return "Accepted";
    case "declined":
      return "Declined";
    case "removed":
      return "Removed";
    case "pending":
    default:
      return "Pending";
  }
}

export function getNotificationStatusTone(notification: DashboardNotification) {
  if (notification.type === "quiz_follow_up") {
    return "info" as const;
  }

  switch (notification.status) {
    case "accepted":
      return "success" as const;
    case "declined":
      return "danger" as const;
    case "removed":
      return "neutral" as const;
    case "pending":
    default:
      return "warning" as const;
  }
}

export function getQuizFollowUpLabel(kind: QuizFollowUpKind) {
  switch (kind) {
    case "reassign_quiz":
      return "Reassigned";
    case "follow_up_practice":
      return "Practice";
    case "needs_review":
    default:
      return "Review";
  }
}

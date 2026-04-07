import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import {
  CalendarDays,
  CheckCircle2,
  TrendingUp,
  Users,
} from "../../../components/icons/AppIcons";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { cn } from "../../../components/ui/utils";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useNotifications } from "../../../app/providers/NotificationsProvider";
import { useQuizSessions } from "../../../app/providers/QuizSessionProvider";
import { useTeacherClasses } from "../../../app/providers/TeacherClassesProvider";
import {
  AttemptsBadge,
  DeadlineBadge,
} from "../../../features/assignments/AssignmentControls";
import { DashboardPageHeader } from "../../../features/dashboard/components/DashboardPageHeader";
import {
  DashboardBadge,
  DashboardButton,
  DashboardSearchField,
  DashboardSurface,
  dashboardPageClassName,
  dashboardSelectVariants,
} from "../../../features/dashboard/components/DashboardPrimitives";
import { EmptyStateBlock } from "../../../features/dashboard/components/EmptyStateBlock";
import { SectionCard } from "../../../features/dashboard/components/SectionCard";
import {
  ActionMenu,
  ClassQuizAnalyticsCard,
  InterventionPanel,
  QuestionAnalyticsPanel,
  QuizSummaryPanel,
  ScoreDistributionPanel,
  StudentQuizInsightsPanel,
  StudentQuizResultRow,
} from "../../../features/dashboard/components/teacher-analytics/TeacherQuizAnalyticsComponents";
import {
  buildTeacherAssignedQuizAnalytics,
  DEFAULT_INTERVENTION_THRESHOLD,
  type TeacherStudentQuizResultRowData,
} from "../../../features/dashboard/components/teacher-analytics/teacherQuizAnalyticsUtils";
import { getNotificationRecipientUserIdByEmail } from "../../../features/dashboard/mock/mockUsers";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function escapeCsvValue(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function matchesScoreRange(
  row: TeacherStudentQuizResultRowData,
  scoreRange: string,
) {
  if (scoreRange === "all") {
    return true;
  }

  if (scoreRange === "missing") {
    return row.latestScore === null;
  }

  if (row.latestScore === null) {
    return false;
  }

  if (scoreRange === "85-100") {
    return row.latestScore >= 85;
  }

  if (scoreRange === "70-84") {
    return row.latestScore >= 70 && row.latestScore <= 84;
  }

  return row.latestScore < 70;
}

export function TeacherAnalyticsPage() {
  const meta = useDashboardPageMeta();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { classes } = useTeacherClasses();
  const { sharedAssignedSessions } = useQuizSessions();
  const { sendQuizFollowUpNotification } = useNotifications();
  const [studentSearch, setStudentSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed" | "in_progress" | "expired" | "attempts_exhausted"
  >("all");
  const [scoreRange, setScoreRange] = useState<
    "all" | "85-100" | "70-84" | "below-70" | "missing"
  >("all");
  const [analyticsView, setAnalyticsView] = useState<
    "summary" | "questions" | "distribution" | "interventions"
  >("summary");
  const [selectedStudentRowId, setSelectedStudentRowId] = useState<string | null>(null);

  const classOptions = useMemo(
    () =>
      classes.filter((teacherClass) => teacherClass.assignedQuizzes.length > 0),
    [classes],
  );
  const requestedClassId = searchParams.get("classId");
  const requestedAssignmentId = searchParams.get("assignmentId");
  const selectedClass =
    classOptions.find((teacherClass) => teacherClass.id === requestedClassId) ??
    classOptions[0] ??
    null;
  const selectedAssignment =
    selectedClass?.assignedQuizzes.find(
      (assignment) => assignment.assignmentId === requestedAssignmentId,
    ) ??
    selectedClass?.assignedQuizzes[0] ??
    null;

  useEffect(() => {
    if (!selectedClass || !selectedAssignment) {
      return;
    }

    if (
      requestedClassId === selectedClass.id &&
      requestedAssignmentId === selectedAssignment.assignmentId
    ) {
      return;
    }

    setSearchParams({
      classId: selectedClass.id,
      assignmentId: selectedAssignment.assignmentId,
    });
  }, [
    requestedAssignmentId,
    requestedClassId,
    selectedAssignment,
    selectedClass,
    setSearchParams,
  ]);

  const analytics = useMemo(() => {
    if (!selectedClass || !selectedAssignment) {
      return null;
    }

    return buildTeacherAssignedQuizAnalytics(
      selectedClass,
      selectedAssignment,
      sharedAssignedSessions,
      DEFAULT_INTERVENTION_THRESHOLD,
    );
  }, [selectedAssignment, selectedClass, sharedAssignedSessions]);

  const filteredRows = useMemo(() => {
    if (!analytics) {
      return [];
    }

    const query = studentSearch.trim().toLowerCase();

    return analytics.rows.filter((row) => {
      const matchesSearch = !query
        ? true
        : [row.student.fullName, row.student.email].join(" ").toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" ? true : row.status === statusFilter;

      return matchesSearch && matchesStatus && matchesScoreRange(row, scoreRange);
    });
  }, [analytics, scoreRange, statusFilter, studentSearch]);

  useEffect(() => {
    if (!filteredRows.length) {
      setSelectedStudentRowId(null);
      return;
    }

    if (selectedStudentRowId && filteredRows.some((row) => row.rowId === selectedStudentRowId)) {
      return;
    }

    setSelectedStudentRowId(filteredRows[0].rowId);
  }, [filteredRows, selectedStudentRowId]);

  const selectedRow =
    analytics?.rows.find((row) => row.rowId === selectedStudentRowId) ?? null;

  const handleClassChange = (classId: string) => {
    const nextClass = classOptions.find((teacherClass) => teacherClass.id === classId);

    if (!nextClass?.assignedQuizzes.length) {
      return;
    }

    setSearchParams({
      classId: nextClass.id,
      assignmentId: nextClass.assignedQuizzes[0].assignmentId,
    });
  };

  const handleAssignmentChange = (assignmentId: string) => {
    if (!selectedClass) {
      return;
    }

    setSearchParams({
      classId: selectedClass.id,
      assignmentId,
    });
  };

  const handleTeacherFollowUp = (
    row: TeacherStudentQuizResultRowData,
    followUpKind: "needs_review" | "reassign_quiz" | "follow_up_practice",
  ) => {
    if (!selectedClass || !selectedAssignment || !currentUser) {
      return;
    }

    sendQuizFollowUpNotification({
      recipientUserId:
        row.student.linkedUserId ?? getNotificationRecipientUserIdByEmail(row.student.email),
      recipientEmail: row.student.email,
      relatedClassId: selectedClass.id,
      relatedClassName: selectedClass.name,
      senderName: currentUser.fullName,
      senderEmail: currentUser.email,
      studentId: row.student.id,
      studentName: row.student.fullName,
      studentEmail: row.student.email,
      quizId: selectedAssignment.quizId,
      quizTitle: selectedAssignment.title,
      assignmentId: selectedAssignment.id,
      followUpKind,
    });

    toast.success(`Follow-up sent to ${row.student.fullName}.`);
  };

  const handleExportCsv = () => {
    if (!analytics || !selectedClass || !selectedAssignment || !filteredRows.length) {
      return;
    }

    const csv = [
      [
        "Class",
        "Quiz",
        "Student",
        "Email",
        "Status",
        "Attempts Used",
        "Latest Score",
        "Best Score",
        "Average Score",
        "Correct",
        "Incorrect",
        "Completion Timestamp",
        "Missed Deadline",
        "Weak Topics",
        "Flags",
      ].join(","),
      ...filteredRows.map((row) =>
        [
          escapeCsvValue(selectedClass.name),
          escapeCsvValue(selectedAssignment.title),
          escapeCsvValue(row.student.fullName),
          escapeCsvValue(row.student.email),
          escapeCsvValue(row.status),
          escapeCsvValue(row.attemptsUsed),
          escapeCsvValue(row.latestScore ?? "--"),
          escapeCsvValue(row.bestScore ?? "--"),
          escapeCsvValue(row.averageScore ?? "--"),
          escapeCsvValue(row.correctCount),
          escapeCsvValue(row.incorrectCount),
          escapeCsvValue(row.completionTimestamp ?? "--"),
          escapeCsvValue(row.missedDeadline ? "Yes" : "No"),
          escapeCsvValue(row.weakTopics.join(" | ") || "--"),
          escapeCsvValue(row.flags.join(" | ") || "--"),
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `bilgenly-${selectedClass.name}-${selectedAssignment.title}-results.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!classOptions.length || !selectedClass || !selectedAssignment || !analytics) {
    return (
      <div className={dashboardPageClassName}>
        <DashboardPageHeader
          title={meta?.title ?? "Analytics"}
          subtitle="Track assigned-quiz results, class-level progress, and follow-up needs in one place."
        />

        <EmptyStateBlock
          title="Assign a quiz before reviewing results"
          description="Once a class has at least one assigned quiz, this dashboard will switch from setup to post-quiz analytics automatically."
          icon={Users}
          className="border-dashed"
        />
      </div>
    );
  }

  return (
    <div className={dashboardPageClassName}>
      <DashboardPageHeader
        title={meta?.title ?? "Analytics"}
        subtitle="Review assigned quiz outcomes, move from class trends into individual answers, and send follow-up actions without leaving the dashboard."
        actions={
          <DashboardButton type="button" size="lg" variant="secondary" onClick={handleExportCsv}>
            <CalendarDays className="h-4 w-4" />
            Export current view
          </DashboardButton>
        }
      />

      <SectionCard
        title="Results Workspace"
        description=""
        contentClassName="space-y-5"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="min-w-0 space-y-2">
            <span className="text-sm font-medium text-[var(--dashboard-text-strong)]">
              Class
            </span>
            <select
              value={selectedClass.id}
              onChange={(event) => handleClassChange(event.target.value)}
              className={cn(
                dashboardSelectVariants({ size: "md" }),
                "w-full border-[var(--dashboard-border-soft)] bg-white",
              )}
            >
              {classOptions.map((teacherClass) => (
                <option key={teacherClass.id} value={teacherClass.id}>
                  {teacherClass.name}
                </option>
              ))}
            </select>
          </label>

          <label className="min-w-0 space-y-2">
            <span className="text-sm font-medium text-[var(--dashboard-text-strong)]">
              Assigned quiz
            </span>
            <select
              value={selectedAssignment.assignmentId}
              onChange={(event) => handleAssignmentChange(event.target.value)}
              className={cn(
                dashboardSelectVariants({ size: "md" }),
                "w-full border-[var(--dashboard-border-soft)] bg-white",
              )}
            >
              {selectedClass.assignedQuizzes.map((assignment) => (
                <option key={assignment.assignmentId} value={assignment.assignmentId}>
                  {assignment.title}
                </option>
              ))}
            </select>
          </label>

          <label className="min-w-0 space-y-2">
            <span className="text-sm font-medium text-[var(--dashboard-text-strong)]">
              Status
            </span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "all"
                    | "active"
                    | "completed"
                    | "in_progress"
                    | "expired"
                    | "attempts_exhausted",
                )
              }
              className={cn(
                dashboardSelectVariants({ size: "md" }),
                "w-full border-[var(--dashboard-border-soft)] bg-white",
              )}
            >
              <option value="all">All statuses</option>
              <option value="active">Available</option>
              <option value="completed">Finished</option>
              <option value="in_progress">In progress</option>
              <option value="expired">Expired</option>
              <option value="attempts_exhausted">Attempts exhausted</option>
            </select>
          </label>

          <label className="min-w-0 space-y-2">
            <span className="text-sm font-medium text-[var(--dashboard-text-strong)]">
              Score range
            </span>
            <select
              value={scoreRange}
              onChange={(event) =>
                setScoreRange(
                  event.target.value as "all" | "85-100" | "70-84" | "below-70" | "missing",
                )
              }
              className={cn(
                dashboardSelectVariants({ size: "md" }),
                "w-full border-[var(--dashboard-border-soft)] bg-white",
              )}
            >
              <option value="all">All scores</option>
              <option value="85-100">85-100</option>
              <option value="70-84">70-84</option>
              <option value="below-70">Below 70</option>
              <option value="missing">No score yet</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DashboardBadge tone="info">{filteredRows.length} visible students</DashboardBadge>
          <DashboardBadge tone="neutral">
            {selectedAssignment.questionCount} questions
          </DashboardBadge>
          <DashboardBadge tone="neutral">
            Assigned {shortDateFormatter.format(new Date(selectedAssignment.assignedAt))}
          </DashboardBadge>
          <DeadlineBadge
            deadline={selectedAssignment.deadline}
            expired={selectedAssignment.status === "expired"}
          />
          <AttemptsBadge maxAttempts={selectedAssignment.maxAttempts} />
        </div>
      </SectionCard>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ClassQuizAnalyticsCard
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          helper={`${analytics.completedStudentsCount} of ${analytics.assignedStudentsCount} joined students finished the assignment.`}
          icon={CheckCircle2}
          tone="success"
        />
        <ClassQuizAnalyticsCard
          title="Average Score"
          value={analytics.averageScore === null ? "--" : `${analytics.averageScore}%`}
          helper="Based on each student's latest completed attempt."
          icon={TrendingUp}
          tone="brand"
        />
        <ClassQuizAnalyticsCard
          title="Needs Attention"
          value={String(analytics.interventionStudents.length)}
          helper={`${analytics.exhaustedAttemptsStudentsCount} exhausted attempts or fell below ${DEFAULT_INTERVENTION_THRESHOLD}%.`}
          icon={Users}
          tone="warning"
        />
        <ClassQuizAnalyticsCard
          title="Missed Deadline"
          value={String(analytics.missedDeadlineStudentsCount)}
          helper={
            analytics.missedDeadlineStudentsCount
              ? `${analytics.expirationRate}% of the class`
              : "No missed deadlines yet."
          }
          icon={CalendarDays}
          tone="accent"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">
        <div className="space-y-6">
          <SectionCard
            title="Student Results"
            description="Keep the roster visible, search inside the table, and take the next action without leaving this viewport."
            contentClassName="space-y-4"
          >
            {!filteredRows.length ? (
              <EmptyStateBlock
                title="No students match these filters"
                description="Adjust the student search, status, or score range to bring the assigned roster back into view."
                icon={Users}
                className="border-dashed"
              />
            ) : (
              <div className="space-y-4">
                <DashboardSearchField
                  value={studentSearch}
                  onChange={(event) => setStudentSearch(event.target.value)}
                  placeholder="Search student name or email..."
                  inputClassName="border-[var(--dashboard-border-soft)] bg-white"
                />
                <div className="overflow-hidden rounded-[18px] border border-[var(--dashboard-border-soft)] bg-white">
                  <div className="max-h-[430px] overflow-auto">
                    <Table className="min-w-[940px]">
                      <TableHeader className="sticky top-0 z-10 bg-[var(--dashboard-surface-muted)]">
                        <TableRow className="border-[var(--dashboard-border-soft)] hover:bg-[var(--dashboard-surface-muted)]">
                          <TableHead className="px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--dashboard-text-faint)]">
                            Student
                          </TableHead>
                          <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--dashboard-text-faint)]">
                            Status
                          </TableHead>
                          <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--dashboard-text-faint)]">
                            Score
                          </TableHead>
                          <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--dashboard-text-faint)]">
                            Accuracy
                          </TableHead>
                          <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--dashboard-text-faint)]">
                            Weak topics
                          </TableHead>
                          <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--dashboard-text-faint)]">
                            Completed
                          </TableHead>
                          <TableHead className="px-4 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--dashboard-text-faint)]">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRows.map((row) => (
                          <StudentQuizResultRow
                            key={row.rowId}
                            row={row}
                            isSelected={row.rowId === selectedStudentRowId}
                            onSelect={() => setSelectedStudentRowId(row.rowId)}
                            actionMenu={
                              <ActionMenu
                                studentName={row.student.fullName}
                                onViewDetails={() => setSelectedStudentRowId(row.rowId)}
                                onNotifyStudent={() =>
                                  handleTeacherFollowUp(row, "needs_review")
                                }
                                onReassignQuiz={() =>
                                  handleTeacherFollowUp(row, "reassign_quiz")
                                }
                                onScheduleFollowUp={() =>
                                  handleTeacherFollowUp(row, "follow_up_practice")
                                }
                              />
                            }
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Actionable Analytics"
            description="Switch between class summary, question friction, score spread, and intervention queue without pushing the student panel off screen."
            contentClassName="space-y-4"
          >
            <Tabs
              value={analyticsView}
              onValueChange={(value) =>
                setAnalyticsView(
                  value as "summary" | "questions" | "distribution" | "interventions",
                )
              }
              className="space-y-4"
            >
              <TabsList className="grid h-auto w-full grid-cols-2 rounded-[18px] bg-[var(--dashboard-surface-muted)] p-1 md:grid-cols-4">
                <TabsTrigger value="summary" className="rounded-[14px]">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="questions" className="rounded-[14px]">
                  Questions
                </TabsTrigger>
                <TabsTrigger value="distribution" className="rounded-[14px]">
                  Distribution
                </TabsTrigger>
                <TabsTrigger value="interventions" className="rounded-[14px]">
                  Intervention
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <QuizSummaryPanel
                  assignment={selectedAssignment}
                  analytics={analytics}
                  onExportCsv={handleExportCsv}
                />
              </TabsContent>

              <TabsContent value="questions">
                <div className="max-h-[420px] overflow-y-auto pr-1">
                  <QuestionAnalyticsPanel questions={analytics.questionAnalytics} />
                </div>
              </TabsContent>

              <TabsContent value="distribution">
                <ScoreDistributionPanel analytics={analytics} />
              </TabsContent>

              <TabsContent value="interventions">
                <InterventionPanel analytics={analytics} />
              </TabsContent>
            </Tabs>
          </SectionCard>
        </div>

        <StudentQuizInsightsPanel
          assignment={selectedAssignment}
          row={selectedRow}
          onNotifyStudent={
            selectedRow
              ? () => handleTeacherFollowUp(selectedRow, "needs_review")
              : undefined
          }
          onReassignQuiz={
            selectedRow
              ? () => handleTeacherFollowUp(selectedRow, "reassign_quiz")
              : undefined
          }
          onScheduleFollowUp={
            selectedRow
              ? () => handleTeacherFollowUp(selectedRow, "follow_up_practice")
              : undefined
          }
        />
      </div>
    </div>
  );
}

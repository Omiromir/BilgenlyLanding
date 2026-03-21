export interface StudentJoinAssignment {
  title: string;
  teacher: string;
  questions: string;
  duration: string;
  dueDate: string;
}

export interface StudentPracticeRecommendation {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questions: string;
  note: string;
}

export interface StudentPracticeTopic {
  title: string;
  quizCount: string;
  totalQuestions: string;
  mastery: string;
  accent: string;
  progressWidth: string;
}

export interface StudentDetailedResult {
  title: string;
  category: string;
  score: string;
  date: string;
  duration: string;
  correct: string;
  incorrect: string;
  feedback: string;
}

export interface StudentResultSummary {
  label: string;
  value: string;
  note: string;
}

export interface StudentScorePoint {
  label: string;
  value: number;
}

export interface StudentBadgeItem {
  name: string;
  detail: string;
  earnedAt?: string;
  progress?: string;
  accent?: string;
}

export interface StudentLeaderboardItem {
  name: string;
  points?: string;
  score: string;
  rank: string;
}

export interface StudentBadgeSummary {
  label: string;
  value: string;
}

export interface StudentSettingsGroup {
  title: string;
  description: string;
}

export const studentJoinAssignments: StudentJoinAssignment[] = [
  {
    title: "JavaScript Fundamentals",
    teacher: "Prof. Anderson · CS101",
    questions: "15 questions",
    duration: "30 min",
    dueDate: "Due Mar 18, 2026",
  },
  {
    title: "React Hooks Deep Dive",
    teacher: "Prof. Chen · CS202",
    questions: "20 questions",
    duration: "45 min",
    dueDate: "Due Mar 20, 2026",
  },
];

export const studentPracticeRecommendations: StudentPracticeRecommendation[] = [
  {
    title: "Async/Await Practice",
    difficulty: "Medium",
    questions: "15 questions",
    note: "Low mastery in this topic",
  },
  {
    title: "React Hooks Challenge",
    difficulty: "Hard",
    questions: "20 questions",
    note: "Complete your learning path",
  },
  {
    title: "Array Methods Mastery",
    difficulty: "Easy",
    questions: "10 questions",
    note: "Reinforce fundamentals",
  },
];

export const studentPracticeTopics: StudentPracticeTopic[] = [
  {
    title: "JavaScript Basics",
    quizCount: "12 practice quizzes",
    totalQuestions: "180 questions",
    mastery: "85% mastery",
    accent: "#F7B500",
    progressWidth: "85%",
  },
  {
    title: "React Fundamentals",
    quizCount: "8 practice quizzes",
    totalQuestions: "120 questions",
    mastery: "72% mastery",
    accent: "#3B82F6",
    progressWidth: "72%",
  },
  {
    title: "CSS & Styling",
    quizCount: "6 practice quizzes",
    totalQuestions: "90 questions",
    mastery: "90% mastery",
    accent: "#EC4899",
    progressWidth: "90%",
  },
  {
    title: "Python Programming",
    quizCount: "10 practice quizzes",
    totalQuestions: "150 questions",
    mastery: "68% mastery",
    accent: "#15C949",
    progressWidth: "68%",
  },
  {
    title: "Data Structures",
    quizCount: "7 practice quizzes",
    totalQuestions: "105 questions",
    mastery: "55% mastery",
    accent: "#A855F7",
    progressWidth: "55%",
  },
  {
    title: "SQL & Databases",
    quizCount: "9 practice quizzes",
    totalQuestions: "135 questions",
    mastery: "78% mastery",
    accent: "#F97316",
    progressWidth: "78%",
  },
];

export const studentDetailedResults: StudentDetailedResult[] = [
  {
    title: "Python Data Structures",
    category: "Programming Basics",
    score: "88%",
    date: "Mar 12, 2026",
    duration: "35 min",
    correct: "18",
    incorrect: "2",
    feedback: "Feedback: Great understanding of list operations!",
  },
];

export const studentResultSummary: StudentResultSummary[] = [
  {
    label: "Average Score",
    value: "88%",
    note: "+5% vs last month",
  },
  {
    label: "Quizzes Completed",
    value: "24",
    note: "This semester",
  },
  {
    label: "Perfect Scores",
    value: "4",
    note: "100% accuracy",
  },
  {
    label: "Avg Time",
    value: "36 min",
    note: "Per quiz",
  },
];

export const studentScoreProgress: StudentScorePoint[] = [
  { label: "Week 1", value: 75 },
  { label: "Week 2", value: 78 },
  { label: "Week 3", value: 82 },
  { label: "Week 4", value: 86 },
  { label: "Week 5", value: 88 },
  { label: "Week 6", value: 89 },
];

export const studentBadges: StudentBadgeItem[] = [
  {
    name: "Quick Learner",
    detail: "Complete 5 quizzes in one week",
    earnedAt: "Earned on Mar 10, 2026",
    accent: "#FACC15",
  },
  {
    name: "Perfect Score",
    detail: "Achieve 100% on any quiz",
    earnedAt: "Earned on Mar 8, 2026",
    accent: "#FB7185",
  },
  {
    name: "Week Streak",
    detail: "Practice every day for 7 days",
    earnedAt: "Earned on Mar 12, 2026",
    accent: "#FB923C",
  },
  {
    name: "Topic Master",
    detail: "Achieve 90% mastery in any topic",
    progress: "85/90",
    accent: "#F59E0B",
  },
  {
    name: "Speed Demon",
    detail: "Complete a quiz in under 15 minutes",
    progress: "18/15",
    accent: "#F97316",
  },
  {
    name: "Marathon Runner",
    detail: "Complete 50 quizzes total",
    progress: "24/50",
    accent: "#F59E0B",
  },
];

export const studentBadgeSummary: StudentBadgeSummary[] = [
  { label: "Average Score", value: "88%" },
  { label: "Quizzes Done", value: "24" },
  { label: "Badges Earned", value: "12" },
];

export const studentLeaderboard: StudentLeaderboardItem[] = [
  {
    name: "Emma Johnson",
    score: "94%",
    rank: "#1",
  },
  {
    name: "You",
    score: "88%",
    rank: "#3",
  },
  {
    name: "Liam Chen",
    score: "86%",
    rank: "#4",
  },
];

export const studentSettingsGroups: StudentSettingsGroup[] = [
  {
    title: "Study reminders",
    description:
      "Future controls for quiz reminders, streak nudges, and practice prompts.",
  },
  {
    title: "Learning preferences",
    description:
      "Future options for difficulty guidance, preferred topics, and accessibility choices.",
  },
];

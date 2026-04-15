export const QUIZ_BUILDER_LIMITS = {
  pastedText: 12000,
  quizTitle: 120,
  topicFocus: 80,
  instructions: 600,
  questionText: 500,
  optionText: 160,
  explanation: 700,
  search: 120,
} as const;

export function clampText(value: string, maxLength: number) {
  return value.slice(0, maxLength);
}

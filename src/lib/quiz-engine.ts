import type {
  Question,
  QuizFilters,
  QuizSession,
  SessionScore,
  StudyState,
} from '@/types/quiz'

export const STUDY_STATE_VERSION = 1

export const EMPTY_STUDY_STATE: StudyState = {
  version: STUDY_STATE_VERSION,
  activeSession: null,
  completedSessions: [],
}

function shuffleIds(ids: string[], seedOffset = 0): string[] {
  const copy = [...ids]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = (i * 17 + seedOffset) % (i + 1)
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}

export function filterQuestions(questions: Question[], filters?: QuizFilters): Question[] {
  if (!filters) {
    return questions
  }

  return questions.filter((q) => {
    const levelOk = !filters.levels?.length || filters.levels.includes(q.level)
    const topicOk = !filters.topics?.length || filters.topics.includes(q.topic)
    const difficultyOk =
      !filters.difficulties?.length || filters.difficulties.includes(q.difficulty)

    return levelOk && topicOk && difficultyOk
  })
}

export function createSession(
  questions: Question[],
  size: number,
  filters?: QuizFilters,
): QuizSession {
  const filtered = filterQuestions(questions, filters)
  const selectedIds = shuffleIds(
    filtered.map((q) => q.id),
    size,
  ).slice(0, Math.max(1, Math.min(size, filtered.length)))

  return {
    id: `session-${Date.now()}`,
    questionIds: selectedIds,
    currentIndex: 0,
    answers: {},
    completed: false,
    startedAt: new Date().toISOString(),
  }
}

export function getCurrentQuestionId(session: QuizSession): string | undefined {
  return session.questionIds[session.currentIndex]
}

export function submitAnswer(
  session: QuizSession,
  questionId: string,
  selectedIndex: number,
  questionsById: Record<string, Question>,
): QuizSession {
  const question = questionsById[questionId]
  if (!question) {
    return session
  }

  return {
    ...session,
    answers: {
      ...session.answers,
      [questionId]: {
        selectedIndex,
        isCorrect: selectedIndex === question.correctIndex,
        answeredAt: new Date().toISOString(),
      },
    },
  }
}

export function advanceSession(session: QuizSession): QuizSession {
  const next = session.currentIndex + 1
  if (next >= session.questionIds.length) {
    return {
      ...session,
      currentIndex: session.questionIds.length - 1,
      completed: true,
      finishedAt: new Date().toISOString(),
    }
  }

  return {
    ...session,
    currentIndex: next,
  }
}

export function scoreSession(session: QuizSession): SessionScore {
  const answers = Object.values(session.answers)
  const correct = answers.filter((a) => a.isCorrect).length
  const answered = answers.length
  const incorrect = answered - correct
  const total = session.questionIds.length

  return {
    correct,
    incorrect,
    answered,
    total,
    percent: total > 0 ? Math.round((correct / total) * 100) : 0,
  }
}

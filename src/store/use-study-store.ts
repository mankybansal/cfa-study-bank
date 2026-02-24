import { create } from 'zustand'
import { QUESTION_BANK, QUESTION_BY_ID } from '@/data/questionBank'
import {
  advanceSession,
  createSession,
  EMPTY_STUDY_STATE,
  getCurrentQuestionId,
  scoreSession,
  submitAnswer,
} from '@/lib/quiz-engine'
import { loadState, saveState } from '@/lib/storage'
import type {
  AnsweredQuestionRecord,
  Difficulty,
  Question,
  QuizFilters,
  QuizSession,
  SessionScore,
} from '@/types/quiz'

type CreateSessionInput = {
  size: number
  filters?: QuizFilters
}

type StudyStore = {
  questions: Question[]
  questionsById: Record<string, Question>
  activeSession: QuizSession | null
  completedSessions: QuizSession[]
  createNewSession: (input: CreateSessionInput) => void
  submitCurrentAnswer: (choiceIndex: number) => void
  moveNext: () => void
  resetProgress: () => void
  getActiveScore: () => SessionScore
  getTopicAccuracy: () => Array<{ topic: string; answered: number; correct: number; percent: number }>
  getAnsweredDifficulties: () => Array<{ difficulty: Difficulty; answered: number }>
  getAnsweredHistory: () => Array<AnsweredQuestionRecord & { question: Question }>
  getSessionTrend: () => Array<{ label: string; percent: number; answered: number; total: number }>
}

const persisted = loadState()

export const useStudyStore = create<StudyStore>((set, get) => ({
  questions: QUESTION_BANK,
  questionsById: QUESTION_BY_ID,
  activeSession: persisted.activeSession,
  completedSessions: persisted.completedSessions,
  createNewSession: ({ size, filters }) => {
    const nextSession = createSession(QUESTION_BANK, size, filters)

    set((state) => {
      const next = {
        ...state,
        activeSession: nextSession,
      }
      saveState({
        version: 1,
        activeSession: next.activeSession,
        completedSessions: next.completedSessions,
      })
      return next
    })
  },
  submitCurrentAnswer: (choiceIndex) => {
    const state = get()
    if (!state.activeSession) {
      return
    }

    const questionId = getCurrentQuestionId(state.activeSession)
    if (!questionId) {
      return
    }

    const updatedSession = submitAnswer(
      state.activeSession,
      questionId,
      choiceIndex,
      state.questionsById,
    )

    set((s) => {
      const next = {
        ...s,
        activeSession: updatedSession,
      }
      saveState({
        version: 1,
        activeSession: next.activeSession,
        completedSessions: next.completedSessions,
      })
      return next
    })
  },
  moveNext: () => {
    const state = get()
    if (!state.activeSession) {
      return
    }

    const nextSession = advanceSession(state.activeSession)
    if (!nextSession.completed) {
      set((s) => {
        const next = {
          ...s,
          activeSession: nextSession,
        }
        saveState({
          version: 1,
          activeSession: next.activeSession,
          completedSessions: next.completedSessions,
        })
        return next
      })
      return
    }

    set((s) => {
      const next = {
        ...s,
        activeSession: null,
        completedSessions: [nextSession, ...s.completedSessions].slice(0, 30),
      }
      saveState({
        version: 1,
        activeSession: next.activeSession,
        completedSessions: next.completedSessions,
      })
      return next
    })
  },
  resetProgress: () => {
    set(() => {
      saveState(EMPTY_STUDY_STATE)
      return {
        activeSession: null,
        completedSessions: [],
      }
    })
  },
  getActiveScore: () => {
    const state = get()
    if (!state.activeSession) {
      return {
        correct: 0,
        incorrect: 0,
        answered: 0,
        total: 0,
        percent: 0,
      }
    }
    return scoreSession(state.activeSession)
  },
  getTopicAccuracy: () => {
    const state = get()
    const answersByTopic = new Map<string, { answered: number; correct: number }>()
    const sessions = state.activeSession
      ? [state.activeSession, ...state.completedSessions]
      : state.completedSessions

    for (const session of sessions) {
      for (const [questionId, answer] of Object.entries(session.answers)) {
        const question = state.questionsById[questionId]
        if (!question) {
          continue
        }

        const bucket = answersByTopic.get(question.topic) ?? { answered: 0, correct: 0 }
        bucket.answered += 1
        if (answer.isCorrect) {
          bucket.correct += 1
        }
        answersByTopic.set(question.topic, bucket)
      }
    }

    return [...answersByTopic.entries()]
      .map(([topic, val]) => ({
        topic,
        answered: val.answered,
        correct: val.correct,
        percent: val.answered > 0 ? Math.round((val.correct / val.answered) * 100) : 0,
      }))
      .sort((a, b) => b.answered - a.answered)
      .slice(0, 8)
  },
  getAnsweredDifficulties: () => {
    const state = get()
    const counts = new Map<Difficulty, number>()
    const sessions = state.activeSession
      ? [state.activeSession, ...state.completedSessions]
      : state.completedSessions

    for (const session of sessions) {
      for (const questionId of Object.keys(session.answers)) {
        const question = state.questionsById[questionId]
        if (!question) {
          continue
        }

        counts.set(question.difficulty, (counts.get(question.difficulty) ?? 0) + 1)
      }
    }

    return ['easy', 'medium', 'hard'].map((difficulty) => ({
      difficulty: difficulty as Difficulty,
      answered: counts.get(difficulty as Difficulty) ?? 0,
    }))
  },
  getAnsweredHistory: () => {
    const state = get()
    const sessions = state.activeSession
      ? [state.activeSession, ...state.completedSessions]
      : state.completedSessions
    const records: Array<AnsweredQuestionRecord & { question: Question }> = []

    for (const session of sessions) {
      for (const [questionId, answer] of Object.entries(session.answers)) {
        const question = state.questionsById[questionId]
        if (!question) {
          continue
        }

        const questionIndex = session.questionIds.indexOf(questionId)
        records.push({
          questionId,
          sessionId: session.id,
          questionIndex,
          totalQuestions: session.questionIds.length,
          answeredAt: answer.answeredAt,
          selectedIndex: answer.selectedIndex,
          isCorrect: answer.isCorrect,
          question,
        })
      }
    }

    return records.sort((a, b) => Date.parse(b.answeredAt) - Date.parse(a.answeredAt))
  },
  getSessionTrend: () => {
    const state = get()
    return [...state.completedSessions]
      .map((session, idx) => {
        const score = scoreSession(session)
        return {
          label: `S${state.completedSessions.length - idx}`,
          percent: score.percent,
          answered: score.answered,
          total: score.total,
        }
      })
      .reverse()
      .slice(-12)
  },
}))

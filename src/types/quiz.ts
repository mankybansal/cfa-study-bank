export type CFALevel = 'L1' | 'L2' | 'L3'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  level: CFALevel
  topic: string
  difficulty: Difficulty
  stem: string
  choices: [string, string, string, string]
  correctIndex: number
  explanation: string
  tags: string[]
  sources: Array<{
    title: string
    url: string
    note: string
  }>
  plot?: {
    kind?: 'line' | 'scatter' | 'bar'
    title: string
    xLabel: string
    yLabel: string
    points: Array<{ x: number; y: number; label?: string }>
  }
}

export interface SessionAnswer {
  selectedIndex: number
  isCorrect: boolean
  answeredAt: string
}

export interface QuizSession {
  id: string
  questionIds: string[]
  currentIndex: number
  answers: Record<string, SessionAnswer>
  completed: boolean
  startedAt: string
  finishedAt?: string
}

export interface SessionScore {
  correct: number
  incorrect: number
  answered: number
  total: number
  percent: number
}

export interface QuizFilters {
  levels?: CFALevel[]
  topics?: string[]
  difficulties?: Difficulty[]
}

export interface StudyState {
  version: number
  activeSession: QuizSession | null
  completedSessions: QuizSession[]
}

export interface AnsweredQuestionRecord {
  questionId: string
  sessionId: string
  questionIndex: number
  totalQuestions: number
  answeredAt: string
  selectedIndex: number
  isCorrect: boolean
}

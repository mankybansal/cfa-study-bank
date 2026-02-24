import { describe, expect, it } from 'vitest'
import { generateQuestionBank } from '@/data/questionBank'
import {
  advanceSession,
  createSession,
  getCurrentQuestionId,
  scoreSession,
  submitAnswer,
} from '@/lib/quiz-engine'

describe('quiz-engine', () => {
  it('creates a filtered session with requested size', () => {
    const questions = generateQuestionBank(120)
    const session = createSession(questions, 20, { levels: ['L2'] })

    expect(session.questionIds).toHaveLength(20)
    expect(
      session.questionIds.every((id) => id.startsWith('L2-')),
    ).toBeTruthy()
    expect(session.completed).toBeFalsy()
  })

  it('submits answers and calculates score', () => {
    const questions = generateQuestionBank(30)
    const byId = Object.fromEntries(questions.map((q) => [q.id, q]))
    const session = createSession(questions, 10)
    const q1 = session.questionIds[0]
    const q2 = session.questionIds[1]

    const first = submitAnswer(session, q1, byId[q1].correctIndex, byId)
    const second = submitAnswer(first, q2, (byId[q2].correctIndex + 1) % 4, byId)

    const score = scoreSession(second)
    expect(score.correct).toBe(1)
    expect(score.incorrect).toBe(1)
    expect(score.answered).toBe(2)
    expect(score.total).toBe(10)
  })

  it('completes session after advancing beyond last question', () => {
    const questions = generateQuestionBank(20)
    let session = createSession(questions, 3)

    session = advanceSession(session)
    expect(session.completed).toBeFalsy()
    session = advanceSession(session)
    expect(session.completed).toBeFalsy()
    session = advanceSession(session)

    expect(session.completed).toBeTruthy()
    expect(getCurrentQuestionId(session)).toBe(session.questionIds[2])
    expect(session.finishedAt).toBeTruthy()
  })
})

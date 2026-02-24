import { describe, expect, it } from 'vitest'
import { QUESTION_BANK } from '@/data/questionBank'

describe('question bank', () => {
  it('contains at least 1000 unique questions', () => {
    expect(QUESTION_BANK.length).toBeGreaterThanOrEqual(1000)
    const ids = new Set(QUESTION_BANK.map((q) => q.id))
    expect(ids.size).toBe(QUESTION_BANK.length)
  })

  it('ensures four choices with a valid correct index', () => {
    for (const question of QUESTION_BANK) {
      expect(question.choices).toHaveLength(4)
      expect(question.correctIndex).toBeGreaterThanOrEqual(0)
      expect(question.correctIndex).toBeLessThan(4)
    }
  })
})

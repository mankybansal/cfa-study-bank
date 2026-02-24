import { describe, expect, it } from 'vitest'
import { QUESTION_BANK } from '@/data/questionBank'

describe('question bank', () => {
  it('contains at least 2500 unique questions', () => {
    expect(QUESTION_BANK.length).toBeGreaterThanOrEqual(2500)
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

  it('keeps answer-key distribution reasonably balanced', () => {
    const counts = [0, 0, 0, 0]
    for (const question of QUESTION_BANK) {
      counts[question.correctIndex] += 1
    }

    const total = QUESTION_BANK.length
    for (const count of counts) {
      const pct = (count / total) * 100
      expect(pct).toBeGreaterThan(18)
      expect(pct).toBeLessThan(32)
    }
  })

  it('includes substantial visual questions', () => {
    const withPlot = QUESTION_BANK.filter((q) => q.plot !== undefined).length
    expect(withPlot / QUESTION_BANK.length).toBeGreaterThan(0.3)
  })

  it('reduces immediate sequential repetition by topic', () => {
    let longestRun = 1
    let currentRun = 1

    for (let i = 1; i < QUESTION_BANK.length; i += 1) {
      if (QUESTION_BANK[i].topic === QUESTION_BANK[i - 1].topic) {
        currentRun += 1
        longestRun = Math.max(longestRun, currentRun)
      } else {
        currentRun = 1
      }
    }

    expect(longestRun).toBeLessThan(4)
  })
})

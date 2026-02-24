import { beforeEach, describe, expect, it } from 'vitest'
import { EMPTY_STUDY_STATE } from '@/lib/quiz-engine'
import { clearState, loadState, saveState, STORAGE_KEY } from '@/lib/storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns empty state when storage is empty', () => {
    expect(loadState()).toEqual(EMPTY_STUDY_STATE)
  })

  it('persists and loads study state', () => {
    saveState({
      version: 1,
      activeSession: null,
      completedSessions: [
        {
          id: 's-1',
          questionIds: ['q-1'],
          currentIndex: 0,
          answers: {
            'q-1': {
              selectedIndex: 0,
              isCorrect: true,
              answeredAt: '2026-02-24T00:00:00.000Z',
            },
          },
          completed: true,
          startedAt: '2026-02-24T00:00:00.000Z',
          finishedAt: '2026-02-24T00:10:00.000Z',
        },
      ],
    })

    const loaded = loadState()
    expect(loaded.completedSessions).toHaveLength(1)
    expect(loaded.completedSessions[0].id).toBe('s-1')
  })

  it('clears storage key', () => {
    localStorage.setItem(STORAGE_KEY, '{"version":1}')
    clearState()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})

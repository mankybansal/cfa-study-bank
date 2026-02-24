import { EMPTY_STUDY_STATE, STUDY_STATE_VERSION } from '@/lib/quiz-engine'
import type { StudyState } from '@/types/quiz'

const STORAGE_KEY = 'cfa-study-bank-state'

export function loadState(): StudyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return EMPTY_STUDY_STATE
    }

    const parsed = JSON.parse(raw) as Partial<StudyState>
    if (parsed.version !== STUDY_STATE_VERSION) {
      return EMPTY_STUDY_STATE
    }

    return {
      version: STUDY_STATE_VERSION,
      activeSession: parsed.activeSession ?? null,
      completedSessions: parsed.completedSessions ?? [],
    }
  } catch {
    return EMPTY_STUDY_STATE
  }
}

export function saveState(state: StudyState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export { STORAGE_KEY }

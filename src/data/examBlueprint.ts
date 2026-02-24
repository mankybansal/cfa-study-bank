import type { CFALevel } from '@/types/quiz'

export type TopicWeightBand = {
  topic: string
  low: number
  high: number
}

export type LevelBlueprint = {
  level: CFALevel
  officialLabel: string
  totalQuestions: number
  totalMinutes: number
  structure: string
  topicWeights: TopicWeightBand[]
}

export const EXAM_BLUEPRINTS: Record<CFALevel, LevelBlueprint> = {
  L1: {
    level: 'L1',
    officialLabel: 'Level I',
    totalQuestions: 180,
    totalMinutes: 270,
    structure: 'Two 135-minute sessions, 90 standalone MCQs each.',
    topicWeights: [
      { topic: 'Ethical and Professional Standards', low: 15, high: 20 },
      { topic: 'Quantitative Methods', low: 6, high: 9 },
      { topic: 'Economics', low: 6, high: 9 },
      { topic: 'Financial Statement Analysis', low: 11, high: 14 },
      { topic: 'Corporate Issuers', low: 6, high: 9 },
      { topic: 'Equity Investments', low: 11, high: 14 },
      { topic: 'Fixed Income', low: 11, high: 14 },
      { topic: 'Derivatives', low: 5, high: 8 },
      { topic: 'Alternative Investments', low: 7, high: 10 },
      { topic: 'Portfolio Management', low: 8, high: 12 },
    ],
  },
  L2: {
    level: 'L2',
    officialLabel: 'Level II',
    totalQuestions: 88,
    totalMinutes: 264,
    structure: 'Two 132-minute sessions, each with vignette-based item sets.',
    topicWeights: [
      { topic: 'Ethical and Professional Standards', low: 10, high: 15 },
      { topic: 'Quantitative Methods', low: 5, high: 10 },
      { topic: 'Economics', low: 5, high: 10 },
      { topic: 'Financial Statement Analysis', low: 10, high: 15 },
      { topic: 'Corporate Issuers', low: 5, high: 10 },
      { topic: 'Equity Investments', low: 10, high: 15 },
      { topic: 'Fixed Income', low: 10, high: 15 },
      { topic: 'Derivatives', low: 5, high: 10 },
      { topic: 'Alternative Investments', low: 5, high: 10 },
      { topic: 'Portfolio Management', low: 10, high: 15 },
    ],
  },
  L3: {
    level: 'L3',
    officialLabel: 'Level III',
    totalQuestions: 44,
    totalMinutes: 264,
    structure: 'Two 132-minute sessions with vignette-based constructed response and item sets.',
    topicWeights: [
      { topic: 'Portfolio Management and Wealth Planning', low: 35, high: 40 },
      { topic: 'Asset Allocation', low: 15, high: 20 },
      { topic: 'Performance Measurement', low: 5, high: 10 },
      { topic: 'Derivatives and Risk Management', low: 10, high: 15 },
      { topic: 'Ethical and Professional Standards', low: 10, high: 15 },
      { topic: 'Fixed Income and Liability Management', low: 10, high: 15 },
      { topic: 'Equity and Alternative Investments', low: 5, high: 10 },
    ],
  },
}

export function examPreset(level: CFALevel): { size: number; minutes: number } {
  const blueprint = EXAM_BLUEPRINTS[level]
  return {
    size: blueprint.totalQuestions,
    minutes: blueprint.totalMinutes,
  }
}

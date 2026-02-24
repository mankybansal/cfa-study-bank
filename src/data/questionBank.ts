import type { CFALevel, Difficulty, Question } from '@/types/quiz'

type TopicConcept = {
  topic: string
  concept: string
  correct: string
  wrong: [string, string, string]
}

type CalcTemplate = {
  key: string
  level: CFALevel
  topic: string
  difficulty: Difficulty
  build: (seed: number) => {
    stem: string
    choices: [string, string, string, string]
    correctIndex: number
    explanation: string
    tags: string[]
  }
}

const LEVEL_TOPIC_CONCEPTS: Record<CFALevel, TopicConcept[]> = {
  L1: [
    {
      topic: 'Ethical and Professional Standards',
      concept: 'duty to clients',
      correct: 'Client interests must be placed ahead of member and employer interests.',
      wrong: [
        'Client interests may be subordinated when disclosed in writing.',
        'Employer interests always override fiduciary duty to clients.',
        'Suitability is optional for long-horizon client mandates.',
      ],
    },
    {
      topic: 'Economics',
      concept: 'price elasticity of demand',
      correct:
        'Demand is elastic when quantity demanded changes by a greater percentage than price.',
      wrong: [
        'Elastic demand implies no change in quantity when price changes.',
        'Elasticity is relevant only for luxury goods.',
        'Elastic demand guarantees higher revenue after price increases.',
      ],
    },
    {
      topic: 'Financial Statement Analysis',
      concept: 'inventory accounting under inflation',
      correct: 'Under rising prices, FIFO typically reports lower cost of goods sold than LIFO.',
      wrong: [
        'Under rising prices, FIFO always reports higher cost of goods sold than LIFO.',
        'Inventory method choice never affects gross margin.',
        'IFRS requires LIFO for inflationary environments.',
      ],
    },
    {
      topic: 'Equity Investments',
      concept: 'valuation multiples interpretation',
      correct: 'A P/E ratio must be assessed alongside growth expectations, risk, and accounting quality.',
      wrong: [
        'A low P/E always indicates undervaluation.',
        'Multiples automatically control for all leverage differences.',
        'Comparable multiples should avoid peer groups in the same industry.',
      ],
    },
    {
      topic: 'Alternative Investments',
      concept: 'real estate cap rate intuition',
      correct: 'For a given NOI, a higher cap rate implies a lower property valuation.',
      wrong: [
        'For a given NOI, a higher cap rate implies a higher property valuation.',
        'Cap rates have no relation to expected return.',
        'NOI includes principal repayment and interest expense.',
      ],
    },
  ],
  L2: [
    {
      topic: 'Ethical and Professional Standards',
      concept: 'mosaic theory',
      correct: 'Mosaic theory permits conclusions from immaterial nonpublic and public information.',
      wrong: [
        'Any nonpublic information use violates standards regardless of materiality.',
        'Material nonpublic information is acceptable if cited in a report.',
        'Research may only use public disclosures and no other data.',
      ],
    },
    {
      topic: 'Financial Statement Analysis',
      concept: 'equity method accounting',
      correct: 'Under the equity method, the investor recognizes its share of investee earnings.',
      wrong: [
        'Under the equity method, dividends are recorded as revenue only.',
        'Equity method requires full consolidation of investee liabilities.',
        'Ownership percentage does not affect accounting treatment.',
      ],
    },
    {
      topic: 'Equity Investments',
      concept: 'residual income model',
      correct: 'Residual income equals net income minus the equity charge on beginning book value.',
      wrong: [
        'Residual income equals free cash flow to equity by definition.',
        'Residual income models ignore required return assumptions.',
        'Residual income valuation cannot be used when dividends are low.',
      ],
    },
    {
      topic: 'Fixed Income',
      concept: 'term structure interpretation',
      correct: 'A steep yield curve can reflect expected higher short rates and/or term premia.',
      wrong: [
        'A steep curve always indicates near-term recession with falling short rates.',
        'Yield curves only embed current inflation and nothing else.',
        'Term structure has no link to expected future policy rates.',
      ],
    },
    {
      topic: 'Portfolio Management',
      concept: 'tracking error and active risk',
      correct: 'Tracking error measures volatility of active returns versus a benchmark.',
      wrong: [
        'Tracking error measures only absolute portfolio volatility.',
        'Tracking error is identical to market beta.',
        'Tracking error applies only to passive index funds.',
      ],
    },
  ],
  L3: [
    {
      topic: 'Ethical and Professional Standards',
      concept: 'soft-dollar arrangements',
      correct:
        'Soft-dollar benefits should primarily support research or execution that benefits clients.',
      wrong: [
        'Soft dollars can fund any overhead if annually disclosed.',
        'Soft-dollar research cannot be used in investment decisions.',
        'Soft-dollar arrangements are prohibited even for eligible research services.',
      ],
    },
    {
      topic: 'Asset Allocation',
      concept: 'strategic versus tactical allocation',
      correct:
        'Strategic allocation sets policy weights based on objectives, constraints, and liabilities.',
      wrong: [
        'Strategic allocation is replaced each month by tactical views.',
        'Strategic allocation ignores liability and spending needs.',
        'Tactical allocation defines permanent benchmark policy weights.',
      ],
    },
    {
      topic: 'Performance Measurement',
      concept: 'attribution interpretation',
      correct: 'Attribution decomposes active return into allocation, selection, and interaction effects.',
      wrong: [
        'Attribution reports absolute return only, not benchmark-relative effects.',
        'Attribution is not applicable to multi-asset portfolios.',
        'Attribution assumes manager skill cannot affect outcomes.',
      ],
    },
    {
      topic: 'Derivatives and Risk Management',
      concept: 'currency hedge trade-offs',
      correct:
        'Strategic hedge ratios balance risk reduction benefits with carry and opportunity costs.',
      wrong: [
        'Full hedging always maximizes expected return in every mandate.',
        'Hedge ratios are independent of investment horizon and liabilities.',
        'Currency overlays cannot be implemented with forwards.',
      ],
    },
    {
      topic: 'Portfolio Construction',
      concept: 'liability-driven investing',
      correct: 'LDI aims to align asset cash-flow and duration traits with liability characteristics.',
      wrong: [
        'LDI seeks highest nominal yield regardless of liability profile.',
        'LDI assumes liabilities are insensitive to interest-rate changes.',
        'LDI is relevant only for high-turnover equity mandates.',
      ],
    },
  ],
}

const STEM_TEMPLATES = [
  'A candidate is evaluating {concept}. Which statement is most accurate?',
  'In a vignette focused on {topic}, which statement best describes {concept}?',
  'An analyst is reviewing {concept}. Which conclusion is most appropriate?',
]

function numeric(seed: number, min: number, max: number): number {
  const val = ((seed * 9301 + 49297) % 233280) / 233280
  return min + (max - min) * val
}

function numericInt(seed: number, min: number, max: number): number {
  return Math.floor(numeric(seed, min, max + 1))
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function orderedChoices(correct: number, deltas: [number, number, number], suffix = ''): {
  choices: [string, string, string, string]
  correctIndex: number
} {
  const values = [correct, correct + deltas[0], correct + deltas[1], correct + deltas[2]]
  const decorated = values.map((v) => `${round(v, 2).toFixed(2)}${suffix}`)
  const sorted = [...decorated].sort((a, b) => Number(a.replace('%', '')) - Number(b.replace('%', '')))
  const correctChoice = `${round(correct, 2).toFixed(2)}${suffix}`
  return {
    choices: sorted as [string, string, string, string],
    correctIndex: sorted.indexOf(correctChoice),
  }
}

const CALC_TEMPLATES: CalcTemplate[] = [
  {
    key: 'hpr',
    level: 'L1',
    topic: 'Quantitative Methods',
    difficulty: 'easy',
    build: (seed) => {
      const buy = numericInt(seed, 20, 80)
      const sell = buy + numericInt(seed + 1, -12, 14)
      const dividend = numericInt(seed + 2, 0, 4)
      const shares = numericInt(seed + 3, 50, 200)
      const hpr = ((sell * shares - buy * shares + dividend * shares) / (buy * shares)) * 100
      const { choices, correctIndex } = orderedChoices(hpr, [2.5, -2.1, 4.2], '%')
      return {
        stem: `An investor buys ${shares} shares at $${buy.toFixed(2)}, sells at $${sell.toFixed(2)}, and receives a dividend of $${dividend.toFixed(2)} per share. The holding period return is closest to:`,
        choices,
        correctIndex,
        explanation: `HPR = (ending value - beginning value + income) / beginning value = ${round(hpr, 2).toFixed(2)}%.`,
        tags: ['returns', 'hpr', 'calculation'],
      }
    },
  },
  {
    key: 'pv',
    level: 'L1',
    topic: 'Quantitative Methods',
    difficulty: 'medium',
    build: (seed) => {
      const fv = numericInt(seed, 5_000, 20_000)
      const r = numericInt(seed + 1, 4, 12) / 100
      const n = numericInt(seed + 2, 2, 8)
      const pv = fv / (1 + r) ** n
      const { choices, correctIndex } = orderedChoices(pv, [350, -280, 620])
      return {
        stem: `A cash flow of $${fv.toFixed(2)} is expected in ${n} years. Using an annual discount rate of ${(r * 100).toFixed(1)}%, the present value is closest to:`,
        choices,
        correctIndex,
        explanation: `PV = FV / (1 + r)^n = ${fv.toFixed(2)} / (1 + ${(r * 100).toFixed(1)}%)^${n} = $${round(pv, 2).toFixed(2)}.`,
        tags: ['time-value', 'discounting', 'calculation'],
      }
    },
  },
  {
    key: 'mean-std',
    level: 'L1',
    topic: 'Quantitative Methods',
    difficulty: 'medium',
    build: (seed) => {
      const x1 = numericInt(seed, -4, 6)
      const x2 = numericInt(seed + 1, -2, 8)
      const x3 = numericInt(seed + 2, 0, 10)
      const x4 = numericInt(seed + 3, 1, 12)
      const values = [x1, x2, x3, x4]
      const mean = values.reduce((s, x) => s + x, 0) / values.length
      const variance =
        values.reduce((s, x) => s + (x - mean) ** 2, 0) / (values.length - 1)
      const sd = Math.sqrt(variance)
      const { choices, correctIndex } = orderedChoices(sd, [0.55, -0.48, 0.92])
      return {
        stem: `Given returns of ${values.map((x) => `${x}%`).join(', ')}, the sample standard deviation is closest to:`,
        choices,
        correctIndex,
        explanation: `Sample variance uses n-1 in the denominator; sample standard deviation is sqrt(variance) = ${round(sd, 2).toFixed(2)}%.`,
        tags: ['statistics', 'standard-deviation', 'calculation'],
      }
    },
  },
  {
    key: 'correlation',
    level: 'L2',
    topic: 'Quantitative Methods',
    difficulty: 'medium',
    build: (seed) => {
      const sdA = numericInt(seed, 8, 24) / 100
      const sdB = numericInt(seed + 1, 10, 28) / 100
      const rho = numericInt(seed + 2, -4, 8) / 10
      const cov = sdA * sdB * rho
      const { choices, correctIndex } = orderedChoices(rho, [0.2, -0.25, 0.35])
      return {
        stem: `Asset A has standard deviation ${(sdA * 100).toFixed(1)}%, Asset B has standard deviation ${(sdB * 100).toFixed(1)}%, and covariance ${round(cov, 4).toFixed(4)}. The correlation is closest to:`,
        choices,
        correctIndex,
        explanation: `Correlation = covariance / (sigma_A * sigma_B) = ${round(rho, 2).toFixed(2)}.`,
        tags: ['statistics', 'correlation', 'calculation'],
      }
    },
  },
  {
    key: 'capm',
    level: 'L2',
    topic: 'Portfolio Management',
    difficulty: 'easy',
    build: (seed) => {
      const rf = numericInt(seed, 2, 5) / 100
      const rm = numericInt(seed + 1, 7, 13) / 100
      const beta = numericInt(seed + 2, 60, 160) / 100
      const req = (rf + beta * (rm - rf)) * 100
      const { choices, correctIndex } = orderedChoices(req, [1.2, -1.1, 2.4], '%')
      return {
        stem: `Using CAPM with risk-free rate ${(rf * 100).toFixed(1)}%, expected market return ${(rm * 100).toFixed(1)}%, and beta ${beta.toFixed(2)}, the required return is closest to:`,
        choices,
        correctIndex,
        explanation: `Required return = Rf + beta(Rm - Rf) = ${round(req, 2).toFixed(2)}%.`,
        tags: ['capm', 'required-return', 'calculation'],
      }
    },
  },
  {
    key: 'duration-convexity',
    level: 'L2',
    topic: 'Fixed Income',
    difficulty: 'hard',
    build: (seed) => {
      const md = numericInt(seed, 3, 9)
      const convexity = numericInt(seed + 1, 20, 90)
      const y = numericInt(seed + 2, 25, 75) / 10000
      const pct = (-md * y + 0.5 * convexity * y * y) * 100
      const { choices, correctIndex } = orderedChoices(pct, [0.35, -0.4, 0.6], '%')
      return {
        stem: `A bond has modified duration ${md.toFixed(2)} and convexity ${convexity.toFixed(2)}. If yield rises by ${(y * 10000).toFixed(0)} bps, the estimated percentage price change is closest to:`,
        choices,
        correctIndex,
        explanation: `DeltaP/P ≈ -Duration*DeltaY + 0.5*Convexity*(DeltaY)^2 = ${round(pct, 2).toFixed(2)}%.`,
        tags: ['fixed-income', 'duration', 'convexity', 'calculation'],
      }
    },
  },
  {
    key: 'forward-price',
    level: 'L2',
    topic: 'Derivatives',
    difficulty: 'medium',
    build: (seed) => {
      const spot = numericInt(seed, 70, 180)
      const r = numericInt(seed + 1, 2, 8) / 100
      const q = numericInt(seed + 2, 0, 4) / 100
      const t = numericInt(seed + 3, 6, 18) / 12
      const fwd = spot * (1 + (r - q) * t)
      const { choices, correctIndex } = orderedChoices(fwd, [2.4, -1.8, 4.1])
      return {
        stem: `A stock index is at ${spot.toFixed(2)}. The annual financing rate is ${(r * 100).toFixed(1)}%, dividend yield ${(q * 100).toFixed(1)}%, and time to maturity ${t.toFixed(2)} years. The no-arbitrage forward price is closest to:`,
        choices,
        correctIndex,
        explanation: `F0 ≈ S0 * [1 + (r - q) * T] = ${round(fwd, 2).toFixed(2)}.`,
        tags: ['forwards', 'cost-of-carry', 'calculation'],
      }
    },
  },
  {
    key: 'information-ratio',
    level: 'L3',
    topic: 'Performance Measurement',
    difficulty: 'easy',
    build: (seed) => {
      const active = numericInt(seed, -1, 6) / 100
      const te = numericInt(seed + 1, 2, 9) / 100
      const ir = active / te
      const { choices, correctIndex } = orderedChoices(ir, [0.16, -0.14, 0.27])
      return {
        stem: `A manager has annual active return ${(active * 100).toFixed(1)}% and tracking error ${(te * 100).toFixed(1)}%. The information ratio is closest to:`,
        choices,
        correctIndex,
        explanation: `IR = active return / tracking error = ${round(ir, 2).toFixed(2)}.`,
        tags: ['performance', 'information-ratio', 'calculation'],
      }
    },
  },
  {
    key: 'hedge-ratio',
    level: 'L3',
    topic: 'Derivatives and Risk Management',
    difficulty: 'hard',
    build: (seed) => {
      const betaP = numericInt(seed, 70, 130) / 100
      const valueP = numericInt(seed + 1, 20, 80) * 1_000_000
      const futurePrice = numericInt(seed + 2, 3000, 6000)
      const multiplier = 50
      const betaF = 1
      const contracts = (betaP * valueP) / (futurePrice * multiplier * betaF)
      const rounded = Math.round(contracts)
      const choices = [rounded - 20, rounded - 10, rounded, rounded + 15]
      return {
        stem: `A portfolio with beta ${betaP.toFixed(2)} and value $${valueP.toLocaleString()} is hedged using an equity index futures contract priced at ${futurePrice} with multiplier ${multiplier}. Ignoring basis risk, the number of contracts to short is closest to:`,
        choices: choices.map((x) => `${x}`) as [string, string, string, string],
        correctIndex: 2,
        explanation: `Contracts ≈ (beta_P * value_P) / (futures price * multiplier * beta_F) = ${round(contracts, 2)} ≈ ${rounded}.`,
        tags: ['hedging', 'futures', 'calculation'],
      }
    },
  },
]

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function buildConceptStem(topic: string, concept: string, variant: number): string {
  const template = STEM_TEMPLATES[variant % STEM_TEMPLATES.length]
  return template.replace('{topic}', topic).replace('{concept}', concept)
}

function buildConceptQuestion(level: CFALevel, item: TopicConcept, variant: number): Question {
  const all = [item.correct, ...item.wrong]
  const idx = variant % 4
  ;[all[0], all[idx]] = [all[idx], all[0]]

  return {
    id: `concept-${level}-${slugify(item.topic)}-${slugify(item.concept)}-${variant}`,
    level,
    topic: item.topic,
    difficulty: (['easy', 'medium', 'hard'] as Difficulty[])[variant % 3],
    stem: buildConceptStem(item.topic, item.concept, variant),
    choices: all as [string, string, string, string],
    correctIndex: idx,
    explanation: `Correct because ${item.correct.toLowerCase()} This is consistent with CFA curriculum expectations for ${item.topic.toLowerCase()}.`,
    tags: [level, item.topic, item.concept, 'conceptual'],
  }
}

function buildCalcQuestion(template: CalcTemplate, seed: number): Question {
  const q = template.build(seed)
  return {
    id: `calc-${template.level}-${template.key}-${seed}`,
    level: template.level,
    topic: template.topic,
    difficulty: template.difficulty,
    stem: q.stem,
    choices: q.choices,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    tags: [template.level, template.topic, ...q.tags],
  }
}

export function generateQuestionBank(target = 1000): Question[] {
  const output: Question[] = []

  let calcSeed = 1
  while (output.length < Math.floor(target * 0.62)) {
    for (const template of CALC_TEMPLATES) {
      output.push(buildCalcQuestion(template, calcSeed))
      calcSeed += 1
      if (output.length >= Math.floor(target * 0.62)) {
        break
      }
    }
  }

  let conceptVariant = 0
  const levels: CFALevel[] = ['L1', 'L2', 'L3']
  while (output.length < target) {
    for (const level of levels) {
      for (const item of LEVEL_TOPIC_CONCEPTS[level]) {
        output.push(buildConceptQuestion(level, item, conceptVariant))
        conceptVariant += 1
        if (output.length >= target) {
          break
        }
      }
      if (output.length >= target) {
        break
      }
    }
  }

  return output
}

export const QUESTION_BANK = generateQuestionBank(1000)
export const QUESTION_BY_ID = Object.fromEntries(QUESTION_BANK.map((q) => [q.id, q]))

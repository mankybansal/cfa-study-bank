import type { CFALevel, Difficulty, Question } from '@/types/quiz'

type TopicConcept = {
  topic: string
  concept: string
  correct: string
  wrong: [string, string, string]
}

type ValueFormat = {
  style: 'number' | 'percent' | 'currency' | 'integer'
  decimals?: number
  suffix?: string
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
    plot?: {
      kind?: 'line' | 'scatter' | 'bar'
      title: string
      xLabel: string
      yLabel: string
      points: Array<{ x: number; y: number; label?: string }>
    }
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
      topic: 'Quantitative Methods',
      concept: 'time value of money',
      correct: 'A higher discount rate lowers present value for positive future cash flows.',
      wrong: [
        'A higher discount rate increases present value for all cash flows.',
        'Present value is independent of discount rate.',
        'Discounting is relevant only for perpetuities.',
      ],
    },
    {
      topic: 'Economics',
      concept: 'elastic demand',
      correct: 'Demand is elastic when quantity changes proportionally more than price.',
      wrong: [
        'Demand is elastic when quantity does not respond to price.',
        'Elastic demand means price increases always raise revenue.',
        'Elasticity applies only in perfectly competitive markets.',
      ],
    },
    {
      topic: 'Financial Statement Analysis',
      concept: 'inventory inflation effects',
      correct: 'Under rising prices, FIFO tends to report lower cost of goods sold than LIFO.',
      wrong: [
        'Under rising prices, FIFO always has higher cost of goods sold.',
        'Inventory methods never affect gross margin.',
        'IFRS requires LIFO in inflationary periods.',
      ],
    },
    {
      topic: 'Corporate Issuers',
      concept: 'NPV rule',
      correct: 'A project with positive NPV is expected to increase shareholder value.',
      wrong: [
        'Projects should always be ranked by payback period only.',
        'IRR is always superior to NPV for mutually exclusive projects.',
        'Cost of capital assumptions are irrelevant to capital budgeting.',
      ],
    },
    {
      topic: 'Equity Investments',
      concept: 'P/E interpretation',
      correct: 'P/E comparisons must account for growth, risk, and accounting quality differences.',
      wrong: [
        'Lower P/E always implies undervaluation.',
        'Multiples fully neutralize capital structure differences.',
        'P/E comparisons are invalid within industries.',
      ],
    },
    {
      topic: 'Fixed Income',
      concept: 'duration intuition',
      correct: 'For small yield changes, higher duration implies larger bond price sensitivity.',
      wrong: [
        'Duration measures only credit risk.',
        'Higher duration means lower interest rate sensitivity.',
        'Duration is unaffected by coupon level.',
      ],
    },
    {
      topic: 'Derivatives',
      concept: 'futures pricing',
      correct: 'No-arbitrage futures pricing reflects spot, carry costs, and carry benefits.',
      wrong: [
        'Futures price equals expected spot in all conditions.',
        'Carry costs are irrelevant to futures pricing.',
        'Convenience yield always raises fair futures price.',
      ],
    },
    {
      topic: 'Alternative Investments',
      concept: 'cap rate valuation',
      correct: 'For a fixed NOI, higher cap rates imply lower property values.',
      wrong: [
        'For a fixed NOI, higher cap rates imply higher value.',
        'Cap rates are unrelated to expected return.',
        'NOI includes debt principal repayments.',
      ],
    },
    {
      topic: 'Portfolio Management',
      concept: 'diversification',
      correct: 'Diversification reduces idiosyncratic risk but cannot remove systematic risk.',
      wrong: [
        'Diversification removes all risk.',
        'Diversification increases unsystematic risk.',
        'Systematic risk disappears in large single-sector portfolios.',
      ],
    },
  ],
  L2: [
    {
      topic: 'Ethical and Professional Standards',
      concept: 'mosaic theory',
      correct: 'Mosaic theory permits conclusions from immaterial nonpublic and public information.',
      wrong: [
        'Any nonpublic information use violates standards.',
        'Material nonpublic info can be used if the source is unnamed.',
        'Only public filings may be used in research.',
      ],
    },
    {
      topic: 'Quantitative Methods',
      concept: 'serial correlation',
      correct: 'Serial correlation in residuals can distort standard errors and test statistics.',
      wrong: [
        'Serial correlation improves inference accuracy.',
        'Serial correlation affects only dependent variable scaling.',
        'Time-series models do not require residual diagnostics.',
      ],
    },
    {
      topic: 'Economics',
      concept: 'currency translation effects',
      correct: 'A stronger reporting currency often reduces translated foreign revenues.',
      wrong: [
        'Reporting currency strength always boosts translated exports.',
        'Translation effects do not affect reported earnings.',
        'Translation is unrelated to reporting currency.',
      ],
    },
    {
      topic: 'Financial Statement Analysis',
      concept: 'equity method',
      correct: 'Equity method income includes the investor share of investee net income.',
      wrong: [
        'Equity method income equals dividends received only.',
        'Equity method requires full liability consolidation.',
        'Ownership share does not affect accounting method.',
      ],
    },
    {
      topic: 'Corporate Issuers',
      concept: 'leverage impact',
      correct: 'Higher leverage can magnify equity return volatility through financial risk.',
      wrong: [
        'Leverage always lowers equity risk.',
        'Capital structure has no effect on cost of equity.',
        'Debt financing eliminates default risk.',
      ],
    },
    {
      topic: 'Equity Investments',
      concept: 'residual income',
      correct: 'Residual income equals net income minus equity charge on beginning book value.',
      wrong: [
        'Residual income equals FCFE.',
        'Residual income ignores required return.',
        'Residual income cannot be used for low-dividend firms.',
      ],
    },
    {
      topic: 'Fixed Income',
      concept: 'yield curve shape',
      correct: 'Steep curves can reflect expected higher short rates and term premium effects.',
      wrong: [
        'Steep curves always imply immediate rate cuts.',
        'Yield curves depend only on inflation.',
        'Term structure carries no information about future rates.',
      ],
    },
    {
      topic: 'Derivatives',
      concept: 'delta',
      correct: 'Delta approximates option value sensitivity to a small underlying price change.',
      wrong: [
        'Delta measures only time decay.',
        'Gamma is first derivative with respect to spot.',
        'Vega measures only interest-rate sensitivity.',
      ],
    },
    {
      topic: 'Alternative Investments',
      concept: 'buyout strategy',
      correct: 'Buyout strategies often use leverage and operational improvement in mature firms.',
      wrong: [
        'Buyouts target only distressed debt restructuring.',
        'Buyouts avoid operational changes after acquisition.',
        'Private equity returns are observable continuously in public markets.',
      ],
    },
    {
      topic: 'Portfolio Management',
      concept: 'information ratio',
      correct: 'Information ratio evaluates active return per unit of active risk.',
      wrong: [
        'Information ratio divides by total volatility.',
        'Tracking error is equivalent to portfolio beta.',
        'Benchmark selection is irrelevant to active risk.',
      ],
    },
  ],
  L3: [
    {
      topic: 'Ethical and Professional Standards',
      concept: 'soft-dollar standards',
      correct: 'Soft-dollar arrangements should primarily provide client-benefiting research/execution.',
      wrong: [
        'Soft dollars can fund all operational overhead if disclosed.',
        'Soft dollars cannot be used for research decisions.',
        'Soft-dollar arrangements are prohibited in every case.',
      ],
    },
    {
      topic: 'Behavioral Finance',
      concept: 'loss aversion',
      correct: 'Loss aversion can cause investors to hold losing positions too long.',
      wrong: [
        'Loss aversion accelerates realization of losses.',
        'Loss aversion is irrelevant in portfolio construction.',
        'Loss aversion affects institutions but not individuals.',
      ],
    },
    {
      topic: 'Capital Market Expectations',
      concept: 'scenario analysis',
      correct: 'Scenario analysis evaluates coherent multi-factor portfolio outcomes.',
      wrong: [
        'Scenario analysis replaces base-case forecasting entirely.',
        'Scenarios should vary one factor while fixing all others.',
        'Scenario analysis is only useful for equities.',
      ],
    },
    {
      topic: 'Asset Allocation',
      concept: 'strategic asset allocation',
      correct: 'Strategic allocation sets long-term policy weights based on objectives and constraints.',
      wrong: [
        'Strategic allocation changes daily with tactical signals.',
        'Strategic allocation ignores liabilities.',
        'Tactical allocation defines permanent policy weights.',
      ],
    },
    {
      topic: 'Fixed Income Portfolio Management',
      concept: 'liability-driven investing',
      correct: 'LDI seeks asset cash-flow and duration alignment with liabilities.',
      wrong: [
        'LDI maximizes yield without liability matching.',
        'LDI assumes liabilities are rate-insensitive.',
        'LDI applies only to equity-only mandates.',
      ],
    },
    {
      topic: 'Equity Portfolio Management',
      concept: 'portable alpha',
      correct: 'Portable alpha separates beta exposure from alpha sources with overlays.',
      wrong: [
        'Portable alpha removes need for benchmarks.',
        'Portable alpha cannot use derivatives.',
        'Portable alpha guarantees positive active return.',
      ],
    },
    {
      topic: 'Derivatives and Currency Management',
      concept: 'currency hedge ratio',
      correct: 'Strategic hedge ratio balances risk reduction against carry/opportunity costs.',
      wrong: [
        'Full hedging always maximizes return.',
        'Hedging choices are independent of time horizon.',
        'Currency overlay cannot use forwards.',
      ],
    },
    {
      topic: 'Alternative Investments',
      concept: 'illiquidity premium',
      correct: 'Less liquid alternatives often require a return premium and lockup tolerance.',
      wrong: [
        'Illiquidity lowers required return.',
        'Liquidity risk disappears with quarterly valuation.',
        'Liquidity constraints are irrelevant to endowments.',
      ],
    },
    {
      topic: 'Risk Management',
      concept: 'stress testing',
      correct: 'Stress testing explores tail outcomes beyond normal distribution assumptions.',
      wrong: [
        'Stress testing is unnecessary when volatility is low.',
        'Stress testing should use only one historical day.',
        'Stress testing replaces scenario analysis.',
      ],
    },
    {
      topic: 'Performance Measurement',
      concept: 'attribution effects',
      correct: 'Attribution decomposes active return into allocation, selection, and interaction.',
      wrong: [
        'Attribution reports only absolute return.',
        'Attribution is not useful for multi-asset portfolios.',
        'Attribution assumes manager decisions cannot add value.',
      ],
    },
  ],
}

const STEM_TEMPLATES = [
  'A candidate evaluates {concept}. Which statement is most accurate?',
  'In a vignette on {topic}, which statement best describes {concept}?',
  'An analyst reviews {concept}. Which conclusion is most appropriate?',
]

function hashSeed(seed: string | number): number {
  const input = String(seed)
  let hash = 2166136261 >>> 0
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seededShuffle<T>(input: T[], seed: string | number): T[] {
  const arr = [...input]
  let state = hashSeed(seed)
  for (let i = arr.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const j = state % (i + 1)
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

function numeric(seed: number, min: number, max: number): number {
  const value = ((seed * 9301 + 49297) % 233280) / 233280
  return min + (max - min) * value
}

function numericInt(seed: number, min: number, max: number): number {
  return Math.floor(numeric(seed, min, max + 1))
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function formatValue(value: number, format: ValueFormat): string {
  const decimals = format.decimals ?? (format.style === 'integer' ? 0 : 2)
  const suffix = format.suffix ? ` ${format.suffix}` : ''

  if (format.style === 'currency') {
    const sign = value < 0 ? '-' : ''
    const abs = Math.abs(value)
    const text = abs.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    return `${sign}$${text}${suffix}`
  }

  if (format.style === 'percent') {
    return `${round(value, decimals).toFixed(decimals)}%${suffix}`
  }

  if (format.style === 'integer') {
    return `${Math.round(value).toLocaleString('en-US')}${suffix}`
  }

  const text = round(value, decimals).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${text}${suffix}`
}

function buildChoiceSet(
  correct: number,
  deltas: [number, number, number],
  seed: string | number,
  format: ValueFormat,
): { choices: [string, string, string, string]; correctIndex: number } {
  const raw = [correct, correct + deltas[0], correct + deltas[1], correct + deltas[2]]

  for (let i = 1; i < raw.length; i += 1) {
    let guard = 0
    while (raw.slice(0, i).some((v) => Math.abs(v - raw[i]) < 0.00001) && guard < 10) {
      raw[i] += (i + 1) * 0.173
      guard += 1
    }
  }

  let options = raw.map((value, idx) => ({ value, text: formatValue(value, format), isCorrect: idx === 0 }))
  let attempts = 0
  while (new Set(options.map((opt) => opt.text)).size < 4 && attempts < 10) {
    for (let i = 1; i < raw.length; i += 1) {
      raw[i] += (i + 1) * 0.119
    }
    options = raw.map((value, idx) => ({ value, text: formatValue(value, format), isCorrect: idx === 0 }))
    attempts += 1
  }

  const shuffled = seededShuffle(options, `choice-${seed}`)
  return {
    choices: shuffled.map((opt) => opt.text) as [string, string, string, string],
    correctIndex: shuffled.findIndex((opt) => opt.isCorrect),
  }
}

const CALC_TEMPLATES: CalcTemplate[] = [
  {
    key: 'hpr',
    level: 'L1',
    topic: 'Quantitative Methods',
    difficulty: 'easy',
    build: (seed) => {
      const buy = numericInt(seed, 24, 85)
      const sell = buy + numericInt(seed + 1, -12, 16)
      const dividend = numericInt(seed + 2, 0, 4)
      const shares = numericInt(seed + 3, 50, 300)
      const hpr = ((sell - buy + dividend) / buy) * 100
      const { choices, correctIndex } = buildChoiceSet(hpr, [2.6, -2.1, 4.4], seed, {
        style: 'percent',
        decimals: 2,
      })

      return {
        stem: `An investor buys ${shares} shares at $${buy.toFixed(2)}, sells at $${sell.toFixed(2)}, and receives $${dividend.toFixed(2)} dividend per share. Using \\(HPR=\\frac{P_1-P_0+D_1}{P_0}\\), holding period return is closest to:`,
        choices,
        correctIndex,
        explanation: `Apply \\(HPR=\\frac{P_1-P_0+D_1}{P_0}\\). Result: ${round(hpr, 2).toFixed(2)}%.`,
        tags: ['returns', 'calculation'],
        plot: {
          kind: 'line',
          title: 'Price Path',
          xLabel: 'Time',
          yLabel: 'Price',
          points: [
            { x: 0, y: buy, label: 'Buy' },
            { x: 1, y: sell, label: 'Sell' },
          ],
        },
      }
    },
  },
  {
    key: 'pv',
    level: 'L1',
    topic: 'Quantitative Methods',
    difficulty: 'medium',
    build: (seed) => {
      const fv = numericInt(seed, 6000, 30000)
      const r = numericInt(seed + 1, 4, 12) / 100
      const n = numericInt(seed + 2, 2, 10)
      const pv = fv / (1 + r) ** n
      const { choices, correctIndex } = buildChoiceSet(pv, [320, -290, 610], seed, {
        style: 'currency',
        decimals: 2,
      })

      return {
        stem: `A cash flow of $${fv.toLocaleString()} is expected in ${n} years. At ${(r * 100).toFixed(1)}% annual discount rate, using \\(PV=\\frac{FV}{(1+r)^n}\\), present value is closest to:`,
        choices,
        correctIndex,
        explanation: `Compute with \\(PV=\\frac{FV}{(1+r)^n}\\). Present value is $${round(pv, 2).toFixed(2)}.`,
        tags: ['tvm', 'discounting', 'calculation'],
        plot: {
          kind: 'line',
          title: 'Discount Curve',
          xLabel: 'Years',
          yLabel: 'Present Value',
          points: Array.from({ length: n }, (_, idx) => {
            const year = idx + 1
            return { x: year, y: fv / (1 + r) ** year }
          }),
        },
      }
    },
  },
  {
    key: 'sample-sd',
    level: 'L1',
    topic: 'Quantitative Methods',
    difficulty: 'medium',
    build: (seed) => {
      const values = [
        numericInt(seed, -4, 8),
        numericInt(seed + 1, -3, 9),
        numericInt(seed + 2, -1, 11),
        numericInt(seed + 3, 0, 12),
      ]
      const mean = values.reduce((sum, x) => sum + x, 0) / values.length
      const variance = values.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (values.length - 1)
      const sd = Math.sqrt(variance)
      const { choices, correctIndex } = buildChoiceSet(sd, [0.57, -0.46, 0.95], seed, {
        style: 'percent',
        decimals: 2,
      })

      return {
        stem: `Given returns ${values.map((v) => `${v}%`).join(', ')}, the sample standard deviation is closest to:`,
        choices,
        correctIndex,
        explanation: `Sample standard deviation uses the \\(n-1\\) denominator. Value: ${round(sd, 2).toFixed(2)}%.`,
        tags: ['statistics', 'standard-deviation', 'calculation'],
        plot: {
          kind: 'bar',
          title: 'Observed Returns',
          xLabel: 'Observation',
          yLabel: 'Return %',
          points: values.map((value, idx) => ({ x: idx + 1, y: value })),
        },
      }
    },
  },
  {
    key: 'bayes',
    level: 'L1',
    topic: 'Quantitative Methods',
    difficulty: 'hard',
    build: (seed) => {
      const prior = numericInt(seed, 10, 45) / 100
      const sensitivity = numericInt(seed + 1, 70, 95) / 100
      const falsePositive = numericInt(seed + 2, 5, 25) / 100
      const posterior = (sensitivity * prior) / (sensitivity * prior + falsePositive * (1 - prior))
      const { choices, correctIndex } = buildChoiceSet(posterior * 100, [6, -5, 11], seed, {
        style: 'percent',
        decimals: 2,
      })

      return {
        stem: `Event prior probability is ${(prior * 100).toFixed(1)}%. Signal sensitivity is ${(sensitivity * 100).toFixed(1)}% and false-positive rate is ${(falsePositive * 100).toFixed(1)}%. Given a positive signal, posterior event probability is closest to:`,
        choices,
        correctIndex,
        explanation: `Using Bayes theorem, posterior probability is ${round(posterior * 100, 2).toFixed(2)}%.`,
        tags: ['probability', 'bayes', 'calculation'],
        plot: {
          kind: 'bar',
          title: 'Probability Comparison',
          xLabel: 'Measure',
          yLabel: 'Probability %',
          points: [
            { x: 1, y: prior * 100 },
            { x: 2, y: sensitivity * 100 },
            { x: 3, y: posterior * 100 },
          ],
        },
      }
    },
  },
  {
    key: 'correlation',
    level: 'L2',
    topic: 'Quantitative Methods',
    difficulty: 'medium',
    build: (seed) => {
      const sdA = numericInt(seed, 7, 26) / 100
      const sdB = numericInt(seed + 1, 8, 28) / 100
      const rho = numericInt(seed + 2, -5, 9) / 10
      const covariance = sdA * sdB * rho
      const { choices, correctIndex } = buildChoiceSet(rho, [0.2, -0.3, 0.35], seed, {
        style: 'number',
        decimals: 2,
      })

      const scatterX = [-2, -1, 0, 1, 2, 3]
      const scatter = scatterX.map((x, idx) => ({
        x,
        y: rho * x + numeric(seed + idx + 3, -0.45, 0.45),
      }))

      return {
        stem: `Asset A sigma ${(sdA * 100).toFixed(1)}%, Asset B sigma ${(sdB * 100).toFixed(1)}%, and covariance ${round(covariance, 4).toFixed(4)}. Correlation is closest to:`,
        choices,
        correctIndex,
        explanation: `Use \\(\\rho=\\frac{Cov(A,B)}{\\sigma_A\\sigma_B}\\). Correlation is ${round(rho, 2).toFixed(2)}.`,
        tags: ['statistics', 'correlation', 'calculation'],
        plot: {
          kind: 'scatter',
          title: 'Return Scatter',
          xLabel: 'Asset A standardized returns',
          yLabel: 'Asset B standardized returns',
          points: scatter,
        },
      }
    },
  },
  {
    key: 'regression-slope',
    level: 'L2',
    topic: 'Quantitative Methods',
    difficulty: 'hard',
    build: (seed) => {
      const covariance = numericInt(seed, 18, 75) / 100
      const varianceX = numericInt(seed + 1, 20, 95) / 100
      const slope = covariance / varianceX
      const { choices, correctIndex } = buildChoiceSet(slope, [0.32, -0.29, 0.51], seed, {
        style: 'number',
        decimals: 2,
      })

      return {
        stem: `In a simple regression, \\(Cov(X,Y)=${covariance.toFixed(2)}\\) and \\(Var(X)=${varianceX.toFixed(2)}\\). Estimated slope coefficient is closest to:`,
        choices,
        correctIndex,
        explanation: `Slope estimate is \\(b_1=\\frac{Cov(X,Y)}{Var(X)}\\) = ${round(slope, 2).toFixed(2)}.`,
        tags: ['regression', 'slope', 'calculation'],
        plot: {
          kind: 'line',
          title: 'Linear Fit',
          xLabel: 'X',
          yLabel: 'Y',
          points: [
            { x: -2, y: slope * -2 },
            { x: 0, y: 0 },
            { x: 2, y: slope * 2 },
            { x: 4, y: slope * 4 },
          ],
        },
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
      const required = (rf + beta * (rm - rf)) * 100
      const { choices, correctIndex } = buildChoiceSet(required, [1.2, -1.1, 2.1], seed, {
        style: 'percent',
        decimals: 2,
      })

      return {
        stem: `Using CAPM with \\(R_f=${(rf * 100).toFixed(1)}\\%\\), \\(R_m=${(rm * 100).toFixed(1)}\\%\\), and \\(\\beta=${beta.toFixed(2)}\\), required return is closest to:`,
        choices,
        correctIndex,
        explanation: `Apply \\(E(R_i)=R_f+\\beta_i(R_m-R_f)\\). Required return is ${round(required, 2).toFixed(2)}%.`,
        tags: ['capm', 'required-return', 'calculation'],
        plot: {
          kind: 'line',
          title: 'Security Market Line',
          xLabel: 'Beta',
          yLabel: 'Expected return %',
          points: [
            { x: 0, y: rf * 100 },
            { x: 1, y: rm * 100 },
            { x: beta, y: required },
          ],
        },
      }
    },
  },
  {
    key: 'duration-convexity',
    level: 'L2',
    topic: 'Fixed Income',
    difficulty: 'hard',
    build: (seed) => {
      const duration = numericInt(seed, 3, 10)
      const convexity = numericInt(seed + 1, 20, 90)
      const deltaY = numericInt(seed + 2, 20, 85) / 10000
      const pctChange = (-duration * deltaY + 0.5 * convexity * deltaY * deltaY) * 100
      const { choices, correctIndex } = buildChoiceSet(pctChange, [0.35, -0.45, 0.61], seed, {
        style: 'percent',
        decimals: 2,
      })

      const shifts = [-100, -50, 0, 50, 100]
      const curvePoints = shifts.map((shift) => {
        const y = shift / 10000
        return {
          x: shift,
          y: (-duration * y + 0.5 * convexity * y * y) * 100,
        }
      })

      return {
        stem: `Bond modified duration is ${duration.toFixed(2)} and convexity is ${convexity.toFixed(2)}. If yield rises ${(deltaY * 10000).toFixed(0)} bps, using \\(\\frac{\\Delta P}{P}\\approx -D\\Delta y+\\tfrac12 C(\\Delta y)^2\\), estimated price change is closest to:`,
        choices,
        correctIndex,
        explanation: `Applying the duration-convexity approximation gives ${round(pctChange, 2).toFixed(2)}%.`,
        tags: ['duration', 'convexity', 'calculation'],
        plot: {
          kind: 'line',
          title: 'Price Change vs Yield Shift',
          xLabel: 'Yield shift (bps)',
          yLabel: 'Estimated price change %',
          points: curvePoints,
        },
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
      const forward = spot * (1 + (r - q) * t)
      const { choices, correctIndex } = buildChoiceSet(forward, [2.4, -2.0, 4.5], seed, {
        style: 'number',
        decimals: 2,
        suffix: 'index pts',
      })

      const terms = [0.25, 0.5, 1, 1.5]
      const points = terms.map((term) => ({ x: term, y: spot * (1 + (r - q) * term) }))

      return {
        stem: `Index spot is ${spot.toFixed(2)}, financing rate ${(r * 100).toFixed(1)}%, dividend yield ${(q * 100).toFixed(1)}%, and maturity ${t.toFixed(2)} years. No-arbitrage forward price is closest to:`,
        choices,
        correctIndex,
        explanation: `Use \\(F_0\\approx S_0[1+(r-q)T]\\). Forward price is ${round(forward, 2).toFixed(2)} index points.`,
        tags: ['forwards', 'cost-of-carry', 'calculation'],
        plot: {
          kind: 'line',
          title: 'Forward Price Term Profile',
          xLabel: 'Maturity (years)',
          yLabel: 'Forward price',
          points,
        },
      }
    },
  },
  {
    key: 'option-payoff',
    level: 'L2',
    topic: 'Derivatives',
    difficulty: 'medium',
    build: (seed) => {
      const strike = numericInt(seed, 90, 130)
      const spot = strike + numericInt(seed + 1, -20, 24)
      const premium = numericInt(seed + 2, 2, 12)
      const payoff = Math.max(spot - strike, 0) - premium
      const { choices, correctIndex } = buildChoiceSet(payoff, [2, -3, 5], seed, {
        style: 'currency',
        decimals: 2,
        suffix: 'per share',
      })

      const xValues = [strike - 20, strike - 10, strike, strike + 10, strike + 20]
      const points = xValues.map((x) => ({ x, y: Math.max(x - strike, 0) - premium }))

      return {
        stem: `A call option has strike ${strike}, premium ${premium}, and underlying expires at ${spot}. Profit per share for a long call is closest to:`,
        choices,
        correctIndex,
        explanation: `Long call payoff is \\(\\max(S_T-K,0)-premium\\). Profit is ${round(payoff, 2).toFixed(2)} per share.`,
        tags: ['options', 'payoff', 'calculation'],
        plot: {
          kind: 'line',
          title: 'Long Call Profit Diagram',
          xLabel: 'Underlying price at expiry',
          yLabel: 'Profit per share',
          points,
        },
      }
    },
  },
  {
    key: 'sharpe',
    level: 'L1',
    topic: 'Portfolio Management',
    difficulty: 'easy',
    build: (seed) => {
      const rp = numericInt(seed, 6, 14) / 100
      const rf = numericInt(seed + 1, 1, 5) / 100
      const sigma = numericInt(seed + 2, 8, 24) / 100
      const sharpe = (rp - rf) / sigma
      const { choices, correctIndex } = buildChoiceSet(sharpe, [0.15, -0.12, 0.27], seed, {
        style: 'number',
        decimals: 2,
      })

      return {
        stem: `Portfolio return is ${(rp * 100).toFixed(1)}%, risk-free rate is ${(rf * 100).toFixed(1)}%, and volatility is ${(sigma * 100).toFixed(1)}%. Sharpe ratio is closest to:`,
        choices,
        correctIndex,
        explanation: `Sharpe ratio is \\(\\frac{R_p-R_f}{\\sigma_p}\\) = ${round(sharpe, 2).toFixed(2)}.`,
        tags: ['sharpe-ratio', 'calculation'],
        plot: {
          kind: 'bar',
          title: 'Sharpe Inputs',
          xLabel: 'Input',
          yLabel: 'Percent',
          points: [
            { x: 1, y: rp * 100, label: 'Rp' },
            { x: 2, y: rf * 100, label: 'Rf' },
            { x: 3, y: sigma * 100, label: 'Sigma' },
          ],
        },
      }
    },
  },
  {
    key: 'current-yield',
    level: 'L1',
    topic: 'Fixed Income',
    difficulty: 'easy',
    build: (seed) => {
      const couponRate = numericInt(seed, 3, 8) / 100
      const par = 1000
      const price = numericInt(seed + 1, 920, 1080)
      const coupon = par * couponRate
      const currentYield = (coupon / price) * 100
      const { choices, correctIndex } = buildChoiceSet(currentYield, [0.7, -0.5, 1.1], seed, {
        style: 'percent',
        decimals: 2,
      })

      return {
        stem: `A bond has par value $1,000, annual coupon rate ${(couponRate * 100).toFixed(1)}%, and market price $${price}. Current yield is closest to:`,
        choices,
        correctIndex,
        explanation: `Current yield is \\(\\frac{annual\\ coupon}{price}\\) = ${round(currentYield, 2).toFixed(2)}%.`,
        tags: ['bond-yield', 'calculation'],
      }
    },
  },
  {
    key: 'information-ratio',
    level: 'L3',
    topic: 'Performance Measurement',
    difficulty: 'easy',
    build: (seed) => {
      const active = numericInt(seed, -1, 7) / 100
      const trackingError = numericInt(seed + 1, 2, 9) / 100
      const ir = active / trackingError
      const { choices, correctIndex } = buildChoiceSet(ir, [0.16, -0.13, 0.28], seed, {
        style: 'number',
        decimals: 2,
      })

      return {
        stem: `A manager has active return ${(active * 100).toFixed(1)}% and tracking error ${(trackingError * 100).toFixed(1)}%. Information ratio is closest to:`,
        choices,
        correctIndex,
        explanation: `Information ratio is \\(\\frac{active\\ return}{tracking\\ error}\\) = ${round(ir, 2).toFixed(2)}.`,
        tags: ['information-ratio', 'calculation'],
        plot: {
          kind: 'bar',
          title: 'Active Return vs Tracking Error',
          xLabel: 'Measure',
          yLabel: 'Percent',
          points: [
            { x: 1, y: active * 100 },
            { x: 2, y: trackingError * 100 },
          ],
        },
      }
    },
  },
  {
    key: 'put-call-parity',
    level: 'L2',
    topic: 'Derivatives',
    difficulty: 'hard',
    build: (seed) => {
      const spot = numericInt(seed, 85, 155)
      const put = numericInt(seed + 1, 3, 17)
      const strike = numericInt(seed + 2, 85, 155)
      const r = numericInt(seed + 3, 1, 6) / 100
      const t = numericInt(seed + 4, 3, 12) / 12
      const pvStrike = strike / (1 + r * t)
      const call = put + spot - pvStrike
      const { choices, correctIndex } = buildChoiceSet(call, [1.8, -2.2, 3.1], seed, {
        style: 'currency',
        decimals: 2,
      })

      return {
        stem: `A stock is priced at $${spot}. A put with strike ${strike} costs $${put}. Risk-free rate is ${(r * 100).toFixed(1)}% and maturity is ${t.toFixed(2)} years. Using put-call parity, call value is closest to:`,
        choices,
        correctIndex,
        explanation: `Use \\(C = P + S_0 - PV(K)\\). Estimated call value is $${round(call, 2).toFixed(2)}.`,
        tags: ['options', 'put-call-parity', 'calculation'],
      }
    },
  },
  {
    key: 'futures-hedge',
    level: 'L3',
    topic: 'Derivatives and Currency Management',
    difficulty: 'hard',
    build: (seed) => {
      const beta = numeric(seed, 0.7, 1.4)
      const portfolio = numeric(seed + 1, 20, 85) * 1_000_000
      const futuresPrice = numericInt(seed + 2, 3000, 6000)
      const multiplier = 50
      const contracts = (beta * portfolio) / (futuresPrice * multiplier)
      const rounded = Math.round(contracts)
      const { choices, correctIndex } = buildChoiceSet(rounded, [12, -9, 26], seed, {
        style: 'integer',
        suffix: 'contracts',
      })

      return {
        stem: `A portfolio has beta ${beta.toFixed(2)} and value $${Math.round(portfolio).toLocaleString()}. Index futures are priced at ${futuresPrice} with multiplier ${multiplier}. Contracts to short are closest to:`,
        choices,
        correctIndex,
        explanation: `Use \\(N^*=\\frac{\\beta_P V_P}{futures\\ price\\times multiplier}\\). Result is approximately ${rounded} contracts.`,
        tags: ['hedging', 'futures', 'calculation'],
      }
    },
  },
  {
    key: 'treynor',
    level: 'L3',
    topic: 'Performance Measurement',
    difficulty: 'medium',
    build: (seed) => {
      const rp = numericInt(seed, 5, 14) / 100
      const rf = numericInt(seed + 1, 2, 5) / 100
      const beta = numericInt(seed + 2, 60, 150) / 100
      const treynor = ((rp - rf) / beta) * 100
      const { choices, correctIndex } = buildChoiceSet(treynor, [0.4, -0.35, 0.75], seed, {
        style: 'percent',
        decimals: 2,
      })

      return {
        stem: `Portfolio return ${(rp * 100).toFixed(1)}%, risk-free rate ${(rf * 100).toFixed(1)}%, and beta ${beta.toFixed(2)}. Treynor measure is closest to:`,
        choices,
        correctIndex,
        explanation: `Treynor is \\(\\frac{R_p-R_f}{\\beta_p}\\). Value: ${round(treynor, 2).toFixed(2)}%.`,
        tags: ['treynor', 'performance', 'calculation'],
      }
    },
  },
  {
    key: 'inventory-turnover',
    level: 'L1',
    topic: 'Financial Statement Analysis',
    difficulty: 'medium',
    build: (seed) => {
      const cogs = numericInt(seed, 4_500_000, 16_000_000)
      const invBegin = numericInt(seed + 1, 350_000, 1_200_000)
      const invEnd = numericInt(seed + 2, 350_000, 1_200_000)
      const avgInv = (invBegin + invEnd) / 2
      const turnover = cogs / avgInv
      const { choices, correctIndex } = buildChoiceSet(turnover, [0.7, -0.55, 1.15], seed, {
        style: 'number',
        decimals: 2,
        suffix: 'x',
      })

      return {
        stem: `A company reports COGS of $${cogs.toLocaleString()}, beginning inventory of $${invBegin.toLocaleString()}, and ending inventory of $${invEnd.toLocaleString()}. Inventory turnover is closest to:`,
        choices,
        correctIndex,
        explanation: `Inventory turnover is \\(\\frac{COGS}{average\\ inventory}\\) = ${round(turnover, 2).toFixed(2)}x.`,
        tags: ['financial-statements', 'ratio-analysis', 'calculation'],
      }
    },
  },
  {
    key: 'residual-income-value',
    level: 'L2',
    topic: 'Equity Investments',
    difficulty: 'hard',
    build: (seed) => {
      const b0 = numericInt(seed, 20, 80)
      const ri1 = numericInt(seed + 1, 2, 8)
      const r = numericInt(seed + 2, 8, 14) / 100
      const g = numericInt(seed + 3, 1, 4) / 100
      const value = b0 + ri1 / (r - g)
      const { choices, correctIndex } = buildChoiceSet(value, [3.8, -4.2, 6.1], seed, {
        style: 'currency',
        decimals: 2,
      })

      return {
        stem: `A stock has current book value per share $${b0.toFixed(2)}. Next-year residual income is $${ri1.toFixed(2)} and is expected to grow at ${(g * 100).toFixed(1)}% perpetually. Cost of equity is ${(r * 100).toFixed(1)}%. Intrinsic value is closest to:`,
        choices,
        correctIndex,
        explanation: `Using continuing residual income, \\(V_0=B_0+\\frac{RI_1}{r-g}\\). Estimated value is $${round(value, 2).toFixed(2)}.`,
        tags: ['equity-valuation', 'residual-income', 'calculation'],
      }
    },
  },
  {
    key: 'currency-hedge-ratio',
    level: 'L3',
    topic: 'Derivatives and Currency Management',
    difficulty: 'hard',
    build: (seed) => {
      const rho = numeric(seed, 0.2, 0.95)
      const sigmaSpot = numeric(seed + 1, 5, 14)
      const sigmaFwd = numeric(seed + 2, 4, 13)
      const h = (rho * sigmaSpot) / sigmaFwd
      const { choices, correctIndex } = buildChoiceSet(h, [0.16, -0.14, 0.28], seed, {
        style: 'number',
        decimals: 2,
      })

      return {
        stem: `Correlation between spot and forward changes is ${rho.toFixed(2)}. Spot volatility is ${sigmaSpot.toFixed(2)}%, forward volatility is ${sigmaFwd.toFixed(2)}%. Minimum-variance hedge ratio is closest to:`,
        choices,
        correctIndex,
        explanation: `Use \\(h^*=\\rho\\frac{\\sigma_S}{\\sigma_F}\\). Hedge ratio is ${round(h, 2).toFixed(2)}.`,
        tags: ['currency-management', 'hedge-ratio', 'calculation'],
        plot: {
          kind: 'scatter',
          title: 'Spot vs Forward Changes',
          xLabel: 'Spot change',
          yLabel: 'Forward change',
          points: [
            { x: -2, y: -2 * h + numeric(seed + 5, -0.4, 0.4) },
            { x: -1, y: -1 * h + numeric(seed + 6, -0.4, 0.4) },
            { x: 0, y: numeric(seed + 7, -0.3, 0.3) },
            { x: 1, y: h + numeric(seed + 8, -0.4, 0.4) },
            { x: 2, y: 2 * h + numeric(seed + 9, -0.4, 0.4) },
          ],
        },
      }
    },
  },
  {
    key: 'graph-interp',
    level: 'L2',
    topic: 'Quantitative Methods',
    difficulty: 'medium',
    build: (seed) => {
      const slope = numeric(seed, -1.5, 1.8)
      const intercept = numeric(seed + 1, -2, 3)
      const x = numericInt(seed + 2, -3, 6)
      const y = intercept + slope * x
      const { choices, correctIndex } = buildChoiceSet(y, [1.2, -1.1, 2.2], seed, {
        style: 'number',
        decimals: 2,
      })

      return {
        stem: `A regression line shown in the plot has intercept ${intercept.toFixed(2)} and slope ${slope.toFixed(2)}. At \\(x=${x.toFixed(0)}\\), fitted \\(y\\)-value is closest to:`,
        choices,
        correctIndex,
        explanation: `From \\(y = a + bx\\), fitted value is ${round(y, 2).toFixed(2)}.`,
        tags: ['graph-interpretation', 'regression', 'calculation'],
        plot: {
          kind: 'line',
          title: 'Regression Line',
          xLabel: 'x',
          yLabel: 'y',
          points: [
            { x: -2, y: intercept + slope * -2 },
            { x: 0, y: intercept },
            { x: 2, y: intercept + slope * 2 },
            { x: 4, y: intercept + slope * 4 },
          ],
        },
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
  const options = [item.correct, ...item.wrong]
  const correctIndex = variant % 4
  ;[options[0], options[correctIndex]] = [options[correctIndex], options[0]]

  return {
    id: `concept-${level}-${slugify(item.topic)}-${slugify(item.concept)}-${variant}`,
    level,
    topic: item.topic,
    difficulty: (['easy', 'medium', 'hard'] as Difficulty[])[variant % 3],
    stem: buildConceptStem(item.topic, item.concept, variant),
    choices: options as [string, string, string, string],
    correctIndex,
    explanation: `Correct because ${item.correct.toLowerCase()} This aligns with CFA curriculum expectations for ${item.topic.toLowerCase()}.`,
    tags: [level, item.topic, item.concept, 'conceptual'],
  }
}

function buildCalcQuestion(template: CalcTemplate, seed: number): Question {
  const built = template.build(seed)
  return {
    id: `calc-${template.level}-${template.key}-${seed}`,
    level: template.level,
    topic: template.topic,
    difficulty: template.difficulty,
    stem: built.stem,
    choices: built.choices,
    correctIndex: built.correctIndex,
    explanation: built.explanation,
    tags: [template.level, template.topic, ...built.tags],
    plot: built.plot,
  }
}

function mixQuestionOrder(questions: Question[]): Question[] {
  const pool = seededShuffle(questions, 'mixed-question-order')
  const mixed: Question[] = []

  while (pool.length > 0) {
    const previous = mixed[mixed.length - 1]
    if (!previous) {
      mixed.push(pool.shift() as Question)
      continue
    }

    let pick = pool.findIndex(
      (q) =>
        q.topic !== previous.topic &&
        q.level !== previous.level &&
        q.id.split('-')[2] !== previous.id.split('-')[2],
    )

    if (pick === -1) {
      pick = pool.findIndex((q) => q.topic !== previous.topic)
    }

    if (pick === -1) {
      pick = 0
    }

    mixed.push(pool.splice(pick, 1)[0])
  }

  return mixed
}

export function generateQuestionBank(target = 2500): Question[] {
  const output: Question[] = []
  const calcTarget = Math.floor(target * 0.72)

  let seed = 1
  while (output.length < calcTarget) {
    for (const template of CALC_TEMPLATES) {
      output.push(buildCalcQuestion(template, seed))
      seed += 1
      if (output.length >= calcTarget) {
        break
      }
    }
  }

  let variant = 0
  const levels: CFALevel[] = ['L1', 'L2', 'L3']
  while (output.length < target) {
    for (const level of levels) {
      for (const concept of LEVEL_TOPIC_CONCEPTS[level]) {
        output.push(buildConceptQuestion(level, concept, variant))
        variant += 1
        if (output.length >= target) {
          break
        }
      }
      if (output.length >= target) {
        break
      }
    }
  }

  return mixQuestionOrder(output)
}

export const QUESTION_BANK = generateQuestionBank(2500)
export const QUESTION_BY_ID = Object.fromEntries(QUESTION_BANK.map((q) => [q.id, q]))

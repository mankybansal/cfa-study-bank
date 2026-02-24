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
    plot?: {
      title: string
      xLabel: string
      yLabel: string
      points: Array<{ x: number; y: number }>
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

function orderedChoices(correct: number, offsets: [number, number, number], suffix = ''): {
  choices: [string, string, string, string]
  correctIndex: number
} {
  const options = [correct, correct + offsets[0], correct + offsets[1], correct + offsets[2]]
  const values = options.map((x) => `${round(x, 2).toFixed(2)}${suffix}`)
  const sorted = [...values].sort((a, b) => Number(a.replace('%', '')) - Number(b.replace('%', '')))
  const correctKey = `${round(correct, 2).toFixed(2)}${suffix}`
  return {
    choices: sorted as [string, string, string, string],
    correctIndex: sorted.indexOf(correctKey),
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
      const { choices, correctIndex } = orderedChoices(hpr, [2.6, -2.1, 4.4], '%')
      return {
        stem: `An investor buys ${shares} shares at $${buy.toFixed(2)}, sells at $${sell.toFixed(2)}, and receives $${dividend.toFixed(2)} dividend per share. Using \\(HPR=\\\\frac{P_1-P_0+D_1}{P_0}\\), holding period return is closest to:`,
        choices,
        correctIndex,
        explanation: `Apply \\(HPR=\\\\frac{P_1-P_0+D_1}{P_0}\\). Result: ${round(hpr, 2).toFixed(2)}%.`,
        tags: ['returns', 'calculation'],
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
      const { choices, correctIndex } = orderedChoices(pv, [260, -320, 590])
      return {
        stem: `A cash flow of $${fv.toLocaleString()} is expected in ${n} years. At ${(r * 100).toFixed(1)}% annual discount rate, using \\(PV=\\\\frac{FV}{(1+r)^n}\\), present value is closest to:`,
        choices,
        correctIndex,
        explanation: `Compute with \\(PV=\\\\frac{FV}{(1+r)^n}\\). Present value is $${round(pv, 2).toFixed(2)}.`,
        tags: ['tvm', 'discounting', 'calculation'],
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
      const mean = values.reduce((s, x) => s + x, 0) / values.length
      const variance = values.reduce((s, x) => s + (x - mean) ** 2, 0) / (values.length - 1)
      const sd = Math.sqrt(variance)
      const { choices, correctIndex } = orderedChoices(sd, [0.57, -0.46, 0.95])
      return {
        stem: `Given returns ${values.map((v) => `${v}%`).join(', ')}, the sample standard deviation is closest to:`,
        choices,
        correctIndex,
        explanation: `Sample standard deviation uses n-1 denominator; s = ${round(sd, 2).toFixed(2)}%.`,
        tags: ['statistics', 'standard-deviation', 'calculation'],
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
      const sens = numericInt(seed + 1, 70, 95) / 100
      const falsePos = numericInt(seed + 2, 5, 25) / 100
      const posterior = (sens * prior) / (sens * prior + falsePos * (1 - prior))
      const { choices, correctIndex } = orderedChoices(posterior * 100, [6, -5, 11], '%')
      return {
        stem: `An event has prior probability ${(prior * 100).toFixed(1)}%. A signal has sensitivity ${(sens * 100).toFixed(1)}% and false-positive rate ${(falsePos * 100).toFixed(1)}%. Given a positive signal, posterior event probability is closest to:`,
        choices,
        correctIndex,
        explanation: `Using Bayes theorem, posterior = ${round(posterior * 100, 2).toFixed(2)}%.`,
        tags: ['probability', 'bayes', 'calculation'],
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
      const cov = sdA * sdB * rho
      const { choices, correctIndex } = orderedChoices(rho, [0.2, -0.3, 0.35])
      return {
        stem: `Asset A sigma ${(sdA * 100).toFixed(1)}%, Asset B sigma ${(sdB * 100).toFixed(1)}%, and covariance ${round(cov, 4).toFixed(4)}. Correlation is closest to:`,
        choices,
        correctIndex,
        explanation: `Correlation = covariance/(sigmaA*sigmaB) = ${round(rho, 2).toFixed(2)}.`,
        tags: ['statistics', 'correlation', 'calculation'],
      }
    },
  },
  {
    key: 'regression-slope',
    level: 'L2',
    topic: 'Quantitative Methods',
    difficulty: 'hard',
    build: (seed) => {
      const cov = numericInt(seed, 18, 75) / 100
      const varX = numericInt(seed + 1, 20, 95) / 100
      const slope = cov / varX
      const { choices, correctIndex } = orderedChoices(slope, [0.32, -0.29, 0.51])
      return {
        stem: `In a simple regression, covariance(X,Y) = ${cov.toFixed(2)} and variance(X) = ${varX.toFixed(2)}. Estimated slope coefficient is closest to:`,
        choices,
        correctIndex,
        explanation: `Slope b1 = cov(X,Y)/var(X) = ${round(slope, 2).toFixed(2)}.`,
        tags: ['regression', 'slope', 'calculation'],
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
      const { choices, correctIndex } = orderedChoices(required, [1.2, -1.1, 2.1], '%')
      return {
        stem: `Using CAPM with \\(R_f=${(rf * 100).toFixed(1)}\\\\%\\), \\(R_m=${(rm * 100).toFixed(1)}\\\\%\\), and \\(\\\\beta=${beta.toFixed(2)}\\), required return is closest to:`,
        choices,
        correctIndex,
        explanation: `Use \\(E(R_i)=R_f+\\\\beta_i(R_m-R_f)\\). Required return is ${round(required, 2).toFixed(2)}%.`,
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
      const md = numericInt(seed, 3, 10)
      const cx = numericInt(seed + 1, 20, 90)
      const dy = numericInt(seed + 2, 20, 85) / 10000
      const pct = (-md * dy + 0.5 * cx * dy * dy) * 100
      const { choices, correctIndex } = orderedChoices(pct, [0.35, -0.45, 0.61], '%')
      return {
        stem: `Bond modified duration ${md.toFixed(2)}, convexity ${cx.toFixed(2)}. If yield rises ${(dy * 10000).toFixed(0)} bps, using \\(\\\\frac{\\\\Delta P}{P}\\\\approx -D\\\\Delta y+\\\\tfrac12 C(\\\\Delta y)^2\\), estimated % price change is closest to:`,
        choices,
        correctIndex,
        explanation: `Apply \\(\\\\frac{\\\\Delta P}{P}\\\\approx -D\\\\Delta y+\\\\tfrac12 C(\\\\Delta y)^2\\). Estimate: ${round(pct, 2).toFixed(2)}%.`,
        tags: ['duration', 'convexity', 'calculation'],
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
      const { choices, correctIndex } = orderedChoices(forward, [2.4, -2.0, 4.5])
      return {
        stem: `Index spot ${spot.toFixed(2)}, financing ${(r * 100).toFixed(1)}%, dividend yield ${(q * 100).toFixed(1)}%, maturity ${t.toFixed(2)} years. No-arbitrage forward price is closest to:`,
        choices,
        correctIndex,
        explanation: `F0 ≈ S0[1 + (r-q)T] = ${round(forward, 2).toFixed(2)}.`,
        tags: ['forwards', 'cost-of-carry', 'calculation'],
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
      const { choices, correctIndex } = orderedChoices(payoff, [2, -3, 5])
      return {
        stem: `A call option has strike ${strike}, premium ${premium}, and underlying expires at ${spot}. Profit per share for long call is closest to:`,
        choices,
        correctIndex,
        explanation: `Long call profit = max(ST-K,0)-premium = ${round(payoff, 2).toFixed(2)}.`,
        tags: ['options', 'payoff', 'calculation'],
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
      const te = numericInt(seed + 1, 2, 9) / 100
      const ir = active / te
      const { choices, correctIndex } = orderedChoices(ir, [0.16, -0.13, 0.28])
      return {
        stem: `Manager active return ${(active * 100).toFixed(1)}% with tracking error ${(te * 100).toFixed(1)}%. Information ratio is closest to:`,
        choices,
        correctIndex,
        explanation: `IR = active return / tracking error = ${round(ir, 2).toFixed(2)}.`,
        tags: ['information-ratio', 'calculation'],
      }
    },
  },
  {
    key: 'futures-hedge',
    level: 'L3',
    topic: 'Derivatives and Currency Management',
    difficulty: 'hard',
    build: (seed) => {
      const beta = numericInt(seed, 0.7, 1.4)
      const portfolio = numericInt(seed + 1, 15, 85) * 1_000_000
      const f = numericInt(seed + 2, 3000, 6000)
      const mult = 50
      const n = (beta * portfolio) / (f * mult)
      const rounded = Math.round(n)
      const options = [rounded - 18, rounded - 8, rounded, rounded + 12]
      return {
        stem: `Portfolio beta ${beta.toFixed(2)} and value $${Math.round(portfolio).toLocaleString()} are hedged using index futures priced at ${f} with multiplier ${mult}. Contracts to short are closest to:`,
        choices: options.map(String) as [string, string, string, string],
        correctIndex: 2,
        explanation: `N* = betaP*VP/(futures*multiplier) = ${round(n, 2)} ≈ ${rounded}.`,
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
      const tr = (rp - rf) / beta
      const { choices, correctIndex } = orderedChoices(tr * 100, [0.4, -0.35, 0.75], '%')
      return {
        stem: `Portfolio return ${(rp * 100).toFixed(1)}%, risk-free ${(rf * 100).toFixed(1)}%, beta ${beta.toFixed(2)}. Treynor measure is closest to:`,
        choices,
        correctIndex,
        explanation: `Treynor = (Rp-Rf)/beta = ${round(tr * 100, 2).toFixed(2)}%.`,
        tags: ['treynor', 'performance', 'calculation'],
      }
    },
  },
  {
    key: 'graph-interp',
    level: 'L2',
    topic: 'Quantitative Methods',
    difficulty: 'medium',
    build: (seed) => {
      const slope = numericInt(seed, -1.5, 1.8)
      const intercept = numericInt(seed + 1, -2, 3)
      const x = numericInt(seed + 2, -3, 6)
      const y = intercept + slope * x
      const { choices, correctIndex } = orderedChoices(y, [1.2, -1.1, 2.2])
      return {
        stem: `A regression line shown in the plot has intercept ${intercept.toFixed(2)} and slope ${slope.toFixed(2)}. At \\(x=${x.toFixed(0)}\\), fitted \\(y\\)-value is closest to:`,
        choices,
        correctIndex,
        explanation: `From line equation \\(y = a + bx\\), fitted value is ${round(y, 2).toFixed(2)}.`,
        tags: ['graph-interpretation', 'regression', 'calculation'],
        plot: {
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

export function generateQuestionBank(target = 2500): Question[] {
  const output: Question[] = []
  const calcTarget = Math.floor(target * 0.68)

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

  return output
}

export const QUESTION_BANK = generateQuestionBank(2500)
export const QUESTION_BY_ID = Object.fromEntries(QUESTION_BANK.map((q) => [q.id, q]))

import type { CFALevel, Difficulty, Question } from '@/types/quiz'

type TopicConcept = {
  topic: string
  concept: string
  correct: string
  wrong: [string, string, string]
}

const LEVEL_TOPIC_CONCEPTS: Record<CFALevel, TopicConcept[]> = {
  L1: [
    {
      topic: 'Ethical and Professional Standards',
      concept: 'duty to clients',
      correct: 'Client interests must be placed ahead of the member or employer interests.',
      wrong: [
        'Client interests are equal to member interests if disclosed.',
        'Employer interests always override fiduciary obligations.',
        'Suitability is optional for institutional accounts.',
      ],
    },
    {
      topic: 'Quantitative Methods',
      concept: 'time value of money',
      correct: 'A higher discount rate lowers the present value of future cash flows.',
      wrong: [
        'A higher discount rate raises present value for all cash flows.',
        'Present value is independent of discount rate selection.',
        'Discounting applies only to perpetual cash flow streams.',
      ],
    },
    {
      topic: 'Economics',
      concept: 'price elasticity',
      correct: 'Demand is elastic when a small price change causes a larger proportional quantity change.',
      wrong: [
        'Demand is elastic whenever quantity does not change with price.',
        'Elastic demand implies higher prices always increase total revenue.',
        'Elasticity is measured only for luxury goods.',
      ],
    },
    {
      topic: 'Financial Statement Analysis',
      concept: 'inventory accounting',
      correct: 'Under rising prices, FIFO generally reports lower cost of goods sold than LIFO.',
      wrong: [
        'Under rising prices, FIFO always reports higher cost of goods sold than LIFO.',
        'Inventory methods have no effect on gross profit.',
        'LIFO is required by IFRS for all issuers.',
      ],
    },
    {
      topic: 'Corporate Issuers',
      concept: 'capital budgeting',
      correct: 'A project with a positive NPV increases shareholder value if assumptions hold.',
      wrong: [
        'Any project with the highest IRR always has the highest NPV.',
        'Payback period includes all project cash flows after cutoff.',
        'Capital budgeting should ignore cost of capital differences.',
      ],
    },
    {
      topic: 'Equity Investments',
      concept: 'valuation multiples',
      correct: 'A P/E multiple is interpreted relative to growth, risk, and accounting quality.',
      wrong: [
        'A low P/E always means the stock is undervalued.',
        'Valuation multiples remove all effects of leverage.',
        'Multiples are not comparable within the same industry.',
      ],
    },
    {
      topic: 'Fixed Income',
      concept: 'duration',
      correct: 'For small yield moves, higher duration implies greater price sensitivity.',
      wrong: [
        'Duration measures credit spread only and not rate sensitivity.',
        'Higher duration means lower sensitivity to interest-rate changes.',
        'Duration is unaffected by coupon level.',
      ],
    },
    {
      topic: 'Derivatives',
      concept: 'futures pricing',
      correct: 'The no-arbitrage futures price reflects spot price plus carrying costs minus benefits.',
      wrong: [
        'Futures prices are always equal to expected future spot prices.',
        'Carrying costs are ignored in no-arbitrage pricing.',
        'Convenience yield increases fair futures price one-for-one.',
      ],
    },
    {
      topic: 'Alternative Investments',
      concept: 'real estate valuation',
      correct: 'Income capitalization estimates value by dividing stabilized NOI by a market cap rate.',
      wrong: [
        'Real estate value is best measured only by historical cost.',
        'Cap rates increase property values for a fixed NOI.',
        'NOI includes financing costs and principal repayment.',
      ],
    },
    {
      topic: 'Portfolio Management',
      concept: 'diversification',
      correct: 'Diversification reduces unsystematic risk but not market-wide systematic risk.',
      wrong: [
        'Diversification eliminates all portfolio risk.',
        'Diversification increases unsystematic risk by definition.',
        'Systematic risk is removed by holding more stocks in one sector.',
      ],
    },
  ],
  L2: [
    {
      topic: 'Ethical and Professional Standards',
      concept: 'mosaic theory',
      correct: 'Investment conclusions may combine nonmaterial nonpublic data with public information.',
      wrong: [
        'Any use of nonpublic information automatically violates the standards.',
        'Mosaic theory permits use of material nonpublic information if documented.',
        'Only public data may be used in all research reports.',
      ],
    },
    {
      topic: 'Quantitative Methods',
      concept: 'regression diagnostics',
      correct: 'Serial correlation in residuals can bias standard errors and test statistics.',
      wrong: [
        'Serial correlation improves reliability of t-statistics.',
        'Autocorrelation affects only dependent-variable scaling.',
        'Regression diagnostics are unnecessary in time-series models.',
      ],
    },
    {
      topic: 'Economics',
      concept: 'currency translation',
      correct: 'A stronger domestic currency tends to reduce translated foreign revenues.',
      wrong: [
        'Domestic currency strength always increases translated exports.',
        'Translation effects are unrelated to reporting currency.',
        'FX changes affect only balance sheet items and never income.',
      ],
    },
    {
      topic: 'Financial Statement Analysis',
      concept: 'intercorporate investments',
      correct: 'Under the equity method, investor income includes its share of investee earnings.',
      wrong: [
        'Under the equity method, dividends are the only source of income recognition.',
        'The equity method requires full consolidation of all liabilities.',
        'Ownership percentage never influences accounting treatment.',
      ],
    },
    {
      topic: 'Corporate Issuers',
      concept: 'capital structure',
      correct: 'Higher leverage can increase equity return volatility through financial risk.',
      wrong: [
        'Leverage always lowers equity risk and return dispersion.',
        'Capital structure does not affect cost of equity.',
        'Debt financing removes default risk from the firm.',
      ],
    },
    {
      topic: 'Equity Investments',
      concept: 'residual income valuation',
      correct: 'Residual income equals net income minus an equity charge based on required return.',
      wrong: [
        'Residual income is identical to free cash flow to equity.',
        'Residual income ignores book value in all models.',
        'Residual income requires dividend payout to be constant.',
      ],
    },
    {
      topic: 'Fixed Income',
      concept: 'term structure models',
      correct: 'A steeper yield curve can indicate higher expected future short rates or term premia.',
      wrong: [
        'Yield curves are always flat in efficient bond markets.',
        'Term structure is driven only by current inflation.',
        'Steep curves imply lower future short rates by definition.',
      ],
    },
    {
      topic: 'Derivatives',
      concept: 'option greeks',
      correct: 'Delta approximates the change in option value for a small change in underlying price.',
      wrong: [
        'Delta measures only the passage of time.',
        'Gamma is the first derivative of option value to spot price.',
        'Vega measures sensitivity to interest rates only.',
      ],
    },
    {
      topic: 'Alternative Investments',
      concept: 'private equity stages',
      correct: 'Buyout strategies typically use leverage to acquire more mature companies.',
      wrong: [
        'Venture capital buyouts target only distressed debt securities.',
        'Buyouts avoid operational improvements after acquisition.',
        'Private equity returns are fully observable daily in public markets.',
      ],
    },
    {
      topic: 'Portfolio Management',
      concept: 'active risk budgeting',
      correct: 'Information ratio evaluates active return per unit of active risk.',
      wrong: [
        'Information ratio uses total portfolio variance in the denominator.',
        'Tracking error measures market beta rather than active dispersion.',
        'Active risk budgeting ignores benchmark selection.',
      ],
    },
  ],
  L3: [
    {
      topic: 'Ethical and Professional Standards',
      concept: 'soft dollar standards',
      correct: 'Soft dollar arrangements must primarily benefit clients through research or execution services.',
      wrong: [
        'Soft dollars may fund any firm expense if disclosed annually.',
        'Soft dollars are prohibited even for client-directed brokerage.',
        'Research obtained with soft dollars may never influence portfolio decisions.',
      ],
    },
    {
      topic: 'Behavioral Finance',
      concept: 'loss aversion',
      correct: 'Loss-averse investors may hold losing positions too long to avoid realizing losses.',
      wrong: [
        'Loss aversion causes investors to prefer immediate loss recognition.',
        'Loss aversion is irrelevant once portfolio optimization is done.',
        'Loss aversion affects only institutional and not individual investors.',
      ],
    },
    {
      topic: 'Capital Market Expectations',
      concept: 'scenario analysis',
      correct: 'Scenario analysis evaluates portfolio outcomes under coherent multi-factor assumptions.',
      wrong: [
        'Scenario analysis replaces base-case forecasting and probability weighting.',
        'Scenarios should vary one variable while holding all macro inputs fixed.',
        'Scenario analysis is useful only for equity portfolios.',
      ],
    },
    {
      topic: 'Asset Allocation',
      concept: 'strategic versus tactical allocation',
      correct: 'Strategic allocation sets long-term policy weights aligned with objectives and constraints.',
      wrong: [
        'Tactical allocation determines permanent policy portfolio weights.',
        'Strategic allocation should ignore liability characteristics.',
        'Strategic allocation is updated daily with short-term signals.',
      ],
    },
    {
      topic: 'Fixed Income Portfolio Management',
      concept: 'liability-driven investing',
      correct: 'LDI emphasizes matching asset cash flow and duration characteristics to liabilities.',
      wrong: [
        'LDI seeks maximum yield with no regard to liability timing.',
        'LDI assumes liabilities are not sensitive to interest rates.',
        'LDI is relevant only for short-only equity mandates.',
      ],
    },
    {
      topic: 'Equity Portfolio Management',
      concept: 'portable alpha',
      correct: 'Portable alpha separates beta exposure from alpha generation using overlays.',
      wrong: [
        'Portable alpha eliminates the need for benchmark definition.',
        'Portable alpha combines only cash equities and no derivatives.',
        'Portable alpha guarantees positive active return each period.',
      ],
    },
    {
      topic: 'Derivatives and Currency Management',
      concept: 'currency hedging',
      correct: 'A strategic hedge ratio balances risk reduction against potential carry and opportunity costs.',
      wrong: [
        'Full hedging always maximizes return regardless of mandate.',
        'Hedging decisions are independent of investment horizon.',
        'Currency overlay cannot be implemented with forwards.',
      ],
    },
    {
      topic: 'Alternative Investments',
      concept: 'liquidity risk in alternatives',
      correct: 'Less liquid alternatives can require a return premium and longer lockup tolerance.',
      wrong: [
        'Liquidity risk disappears when valuation frequency is quarterly.',
        'Illiquidity always lowers required return.',
        'Liquidity constraints are irrelevant for endowment portfolios.',
      ],
    },
    {
      topic: 'Risk Management',
      concept: 'stress testing',
      correct: 'Stress testing evaluates tail outcomes beyond normal-distribution assumptions.',
      wrong: [
        'Stress testing is unnecessary when historical volatility is low.',
        'Stress testing should rely only on the single worst historical day.',
        'Stress tests replace all scenario and sensitivity analysis methods.',
      ],
    },
    {
      topic: 'Performance Evaluation',
      concept: 'attribution analysis',
      correct: 'Attribution separates active return into allocation, selection, and interaction effects.',
      wrong: [
        'Attribution reports only absolute return and not benchmark-relative effects.',
        'Attribution cannot be performed for multi-asset portfolios.',
        'Attribution assumes managers cannot add value through positioning.',
      ],
    },
  ],
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

const CONTEXTS = [
  'in a portfolio manager review meeting',
  'in an analyst training session',
  'for exam-style case interpretation',
  'while comparing two candidate answers',
  'under a realistic market stress scenario',
  'when evaluating a client suitability memo',
  'during a post-trade investment committee review',
  'for a mock exam vignette follow-up',
  'when validating assumptions in a forecast model',
  'while diagnosing a risk report inconsistency',
]

const STEM_TEMPLATES = [
  'A candidate is evaluating {concept} {context}. Which statement is most accurate?',
  'For {topic}, which statement best describes {concept} {context}?',
  'An analyst applies {concept} {context}. Which conclusion is most appropriate?',
]

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function seededIndex(seed: string, mod: number): number {
  let value = 0
  for (let i = 0; i < seed.length; i += 1) {
    value = (value * 31 + seed.charCodeAt(i)) % 2_147_483_647
  }
  return value % mod
}

function buildChoices(correct: string, wrong: [string, string, string], seed: string): {
  choices: [string, string, string, string]
  correctIndex: number
} {
  const all = [correct, ...wrong]
  const target = seededIndex(seed, 4)
  if (target !== 0) {
    const temp = all[target]
    all[target] = all[0]
    all[0] = temp
  }
  return {
    choices: all as [string, string, string, string],
    correctIndex: target,
  }
}

function buildStem(topic: string, concept: string, variant: number): string {
  const template = STEM_TEMPLATES[variant % STEM_TEMPLATES.length]
  const context = CONTEXTS[variant % CONTEXTS.length]
  return template
    .replace('{topic}', topic)
    .replace('{concept}', concept)
    .replace('{context}', context)
}

export function generateQuestionBank(target = 1000): Question[] {
  const output: Question[] = []
  const levels: CFALevel[] = ['L1', 'L2', 'L3']
  let variant = 0

  while (output.length < target) {
    for (const level of levels) {
      for (const item of LEVEL_TOPIC_CONCEPTS[level]) {
        const qid = `${level}-${slugify(item.topic)}-${slugify(item.concept)}-${variant}`
        const { choices, correctIndex } = buildChoices(
          item.correct,
          item.wrong,
          `${qid}-${variant}`,
        )

        output.push({
          id: qid,
          level,
          topic: item.topic,
          difficulty: DIFFICULTIES[(variant + output.length) % DIFFICULTIES.length],
          stem: buildStem(item.topic, item.concept, variant),
          choices,
          correctIndex,
          explanation: `Correct because ${item.correct.toLowerCase()} This reflects a core ${item.topic.toLowerCase()} principle tested in CFA-style multiple-choice questions.`,
          tags: [level, item.topic, item.concept, 'mcq'],
        })

        if (output.length >= target) {
          return output
        }
      }
    }
    variant += 1
  }

  return output
}

export const QUESTION_BANK = generateQuestionBank(1000)
export const QUESTION_BY_ID = Object.fromEntries(QUESTION_BANK.map((q) => [q.id, q]))

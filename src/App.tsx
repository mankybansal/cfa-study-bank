import { Fragment, useMemo, useState } from 'react'
import { BlockMath, InlineMath } from 'react-katex'
import { BarChart3, BookOpen, Clock3, LineChart, RefreshCcw, Target } from 'lucide-react'
import { EXAM_BLUEPRINTS } from '@/data/examBlueprint'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCurrentQuestionId } from '@/lib/quiz-engine'
import { useStudyStore } from '@/store/use-study-store'
import type { CFALevel } from '@/types/quiz'

const LEVELS: CFALevel[] = ['L1', 'L2', 'L3']

type ReviewFilter = 'all' | 'correct' | 'incorrect'

type MathSegment =
  | { type: 'text'; value: string }
  | { type: 'inline'; value: string }
  | { type: 'block'; value: string }

function parseMath(text: string): MathSegment[] {
  const segments: MathSegment[] = []
  let i = 0
  while (i < text.length) {
    if (text.startsWith('\\[', i)) {
      const end = text.indexOf('\\]', i + 2)
      if (end !== -1) {
        segments.push({ type: 'block', value: text.slice(i + 2, end) })
        i = end + 2
        continue
      }
    }
    if (text.startsWith('\\(', i)) {
      const end = text.indexOf('\\)', i + 2)
      if (end !== -1) {
        segments.push({ type: 'inline', value: text.slice(i + 2, end) })
        i = end + 2
        continue
      }
    }
    const nextInline = text.indexOf('\\(', i)
    const nextBlock = text.indexOf('\\[', i)
    const next = [nextInline, nextBlock].filter((x) => x >= 0).sort((a, b) => a - b)[0]
    const end = next === undefined ? text.length : next
    if (end === i) {
      segments.push({ type: 'text', value: text[i] })
      i += 1
      continue
    }
    segments.push({ type: 'text', value: text.slice(i, end) })
    i = end
  }
  return segments
}

function MathText({ text, className }: { text: string; className?: string }) {
  const segments = useMemo(() => parseMath(text), [text])

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'inline') {
          return <InlineMath key={`m-${index}`} math={segment.value} />
        }
        if (segment.type === 'block') {
          return <BlockMath key={`m-${index}`} math={segment.value} />
        }
        return <Fragment key={`m-${index}`}>{segment.value}</Fragment>
      })}
    </span>
  )
}

function QuestionPlot({
  kind,
  title,
  xLabel,
  yLabel,
  points,
}: {
  kind?: 'line' | 'scatter' | 'bar'
  title: string
  xLabel: string
  yLabel: string
  points: Array<{ x: number; y: number; label?: string }>
}) {
  if (points.length < 2) {
    return null
  }

  const width = 420
  const height = 180
  const padX = 46
  const padY = 24
  const minX = Math.min(...points.map((p) => p.x))
  const maxX = Math.max(...points.map((p) => p.x))
  const minY = Math.min(...points.map((p) => p.y))
  const maxY = Math.max(...points.map((p) => p.y))
  const baselineValue = minY <= 0 && maxY >= 0 ? 0 : minY

  const toX = (x: number): number =>
    padX + ((x - minX) / Math.max(0.0001, maxX - minX)) * (width - 2 * padX)
  const toY = (y: number): number =>
    height - padY - ((y - minY) / Math.max(0.0001, maxY - minY)) * (height - 2 * padY)
  const baselineY = toY(baselineValue)

  const polyline = points.map((p) => `${toX(p.x)},${toY(p.y)}`).join(' ')

  return (
    <div className="rounded-md border bg-card/60 p-2" data-testid="question-plot">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{title}</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full">
        <line x1={padX} y1={baselineY} x2={width - padX} y2={baselineY} stroke="currentColor" opacity="0.2" />
        <line x1={padX} y1={padY} x2={padX} y2={height - padY} stroke="currentColor" opacity="0.2" />
        {kind === 'bar'
          ? points.map((point, i) => {
              const x = toX(point.x) - 10
              const y = Math.min(toY(point.y), baselineY)
              const h = Math.abs(baselineY - toY(point.y))
              return (
                <rect
                  key={`${point.x}-${point.y}-${i}`}
                  x={x}
                  y={y}
                  width="20"
                  height={Math.max(1, h)}
                  fill="currentColor"
                  opacity="0.75"
                />
              )
            })
          : null}
        {kind !== 'bar' ? (
          <>
            {kind !== 'scatter' ? (
              <polyline fill="none" stroke="currentColor" strokeWidth="2.3" points={polyline} />
            ) : null}
            {points.map((point, i) => (
              <circle key={`${point.x}-${point.y}-${i}`} cx={toX(point.x)} cy={toY(point.y)} r="3" fill="currentColor" />
            ))}
          </>
        ) : null}
        <text x={width / 2} y={height - 4} textAnchor="middle" className="fill-current text-[10px]">
          {xLabel}
        </text>
        <text x={10} y={height / 2} textAnchor="middle" transform={`rotate(-90, 10, ${height / 2})`} className="fill-current text-[10px]">
          {yLabel}
        </text>
      </svg>
    </div>
  )
}

function QuestionSources({
  sources,
}: {
  sources: Array<{ title: string; url: string; note: string }>
}) {
  if (sources.length === 0) {
    return null
  }

  return (
    <details className="rounded-md border bg-muted/30 p-3 text-xs" data-testid="question-sources">
      <summary className="cursor-pointer font-medium">
        Why this is exam-relevant (sources)
      </summary>
      <div className="mt-2 space-y-2">
        {sources.map((source) => (
          <div key={`${source.title}-${source.url}`}>
            <a
              className="font-medium text-primary underline-offset-2 hover:underline"
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {source.title}
            </a>
            <p className="text-muted-foreground">{source.note}</p>
          </div>
        ))}
        <p className="text-muted-foreground">
          Questions are original practice items, mapped to official curriculum scope and exam
          structure.
        </p>
      </div>
    </details>
  )
}

function ScoreTrendChart({ points }: { points: Array<{ label: string; percent: number }> }) {
  if (points.length === 0) {
    return <p className="text-sm text-muted-foreground">Complete sessions to view trend.</p>
  }

  const width = 420
  const height = 140
  const padX = 28
  const padY = 18
  const stepX = points.length > 1 ? (width - 2 * padX) / (points.length - 1) : 0
  const polyline = points
    .map((point, index) => {
      const x = padX + index * stepX
      const y = height - padY - (point.percent / 100) * (height - 2 * padY)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full rounded-md border bg-card/60 p-2">
      <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="currentColor" opacity="0.18" />
      <line x1={padX} y1={padY} x2={padX} y2={height - padY} stroke="currentColor" opacity="0.18" />
      <polyline fill="none" stroke="currentColor" strokeWidth="2.5" points={polyline} />
      {points.map((point, index) => {
        const cx = padX + index * stepX
        const cy = height - padY - (point.percent / 100) * (height - 2 * padY)
        return <circle key={point.label} cx={cx} cy={cy} r="3" fill="currentColor" />
      })}
    </svg>
  )
}

function TopicBarChart({
  rows,
}: {
  rows: Array<{ topic: string; answered: number; correct: number; percent: number }>
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No topic data yet.</p>
  }

  const top = rows.slice(0, 6)
  const maxAnswered = Math.max(...top.map((r) => r.answered), 1)

  return (
    <div className="space-y-2 rounded-md border bg-card/60 p-3">
      {top.map((row) => (
        <div key={row.topic} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="truncate pr-2">{row.topic}</span>
            <span className="text-muted-foreground">{row.percent}%</span>
          </div>
          <div className="flex gap-1">
            <div className="h-2 rounded bg-primary" style={{ width: `${(row.answered / maxAnswered) * 100}%` }} />
            <div className="h-2 rounded bg-emerald-500" style={{ width: `${row.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function DifficultyDonut({ rows }: { rows: Array<{ difficulty: string; answered: number }> }) {
  const total = rows.reduce((sum, r) => sum + r.answered, 0)
  if (total === 0) {
    return <p className="text-sm text-muted-foreground">No difficulty split yet.</p>
  }

  const colors: Record<string, string> = {
    easy: '#3b82f6',
    medium: '#f59e0b',
    hard: '#ef4444',
  }

  const slices = rows.reduce<Array<{ difficulty: string; answered: number; start: number; sweep: number; color: string }>>(
    (acc, row) => {
      const last = acc[acc.length - 1]
      const start = last ? last.start + last.sweep : -90
      const sweep = (row.answered / total) * 360
      acc.push({
        ...row,
        start,
        sweep,
        color: colors[row.difficulty] ?? '#888',
      })
      return acc
    },
    [],
  )

  const radius = 56
  const cx = 80
  const cy = 80

  const pathForArc = (startDeg: number, sweepDeg: number): string => {
    const endDeg = startDeg + sweepDeg
    const startRad = (startDeg * Math.PI) / 180
    const endRad = (endDeg * Math.PI) / 180
    const x1 = cx + radius * Math.cos(startRad)
    const y1 = cy + radius * Math.sin(startRad)
    const x2 = cx + radius * Math.cos(endRad)
    const y2 = cy + radius * Math.sin(endRad)
    const largeArc = sweepDeg > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  return (
    <div className="rounded-md border bg-card/60 p-3">
      <svg viewBox="0 0 160 160" className="mx-auto h-36 w-36">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="16" />
        {slices.map((slice) => (
          <path
            key={slice.difficulty}
            d={pathForArc(slice.start, slice.sweep)}
            fill="none"
            stroke={slice.color}
            strokeWidth="16"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
        {rows.map((row) => (
          <div key={row.difficulty}>
            <p className="capitalize">{row.difficulty}</p>
            <p className="text-muted-foreground">{row.answered}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const {
    questions,
    questionsById,
    activeSession,
    completedSessions,
    createNewSession,
    submitCurrentAnswer,
    moveNext,
    restartActiveSession,
    exitToMain,
    resetProgress,
    getActiveScore,
    getTopicAccuracy,
    getAnsweredDifficulties,
    getAnsweredHistory,
    getSessionTrend,
  } = useStudyStore()

  const [selectedLevels, setSelectedLevels] = useState<CFALevel[]>(['L1', 'L2', 'L3'])
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    () => [...new Set(questions.map((question) => question.topic))].sort((a, b) => a.localeCompare(b)),
  )
  const [sessionSize, setSessionSize] = useState(40)
  const [setupError, setSetupError] = useState<string | null>(null)
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all')
  const [selectedReviewKey, setSelectedReviewKey] = useState<string | null>(null)

  const currentQuestionId = activeSession ? getCurrentQuestionId(activeSession) : undefined
  const currentQuestion = currentQuestionId ? questionsById[currentQuestionId] : undefined
  const currentAnswer =
    activeSession && currentQuestionId ? activeSession.answers[currentQuestionId] : undefined

  const activeScore = getActiveScore()
  const completionPercent =
    activeScore.total > 0 ? Math.round((activeScore.answered / activeScore.total) * 100) : 0

  const topicAccuracy = getTopicAccuracy()
  const answeredDifficulties = getAnsweredDifficulties()
  const answeredHistory = getAnsweredHistory()
  const sessionTrend = getSessionTrend()

  const totalAnswered = useMemo(
    () => answeredDifficulties.reduce((sum, row) => sum + row.answered, 0),
    [answeredDifficulties],
  )

  const availableTopics = useMemo(() => {
    const activeLevels = selectedLevels.length > 0 ? selectedLevels : LEVELS
    return [...new Set(questions.filter((question) => activeLevels.includes(question.level)).map((question) => question.topic))].sort(
      (a, b) => a.localeCompare(b),
    )
  }, [questions, selectedLevels])

  const selectedVisibleTopics = useMemo(
    () => selectedTopics.filter((topic) => availableTopics.includes(topic)),
    [selectedTopics, availableTopics],
  )

  const reviewRows = useMemo(() => {
    return answeredHistory.filter((row) => {
      if (reviewFilter === 'all') return true
      if (reviewFilter === 'correct') return row.isCorrect
      return !row.isCorrect
    })
  }, [answeredHistory, reviewFilter])

  const selectedReview = reviewRows.find(
    (row) => `${row.questionId}-${row.answeredAt}` === selectedReviewKey,
  )

  const toggleLevel = (level: CFALevel): void => {
    setSelectedLevels((current) => {
      if (current.includes(level)) return current.filter((item) => item !== level)
      return [...current, level]
    })
  }

  const toggleTopic = (topic: string): void => {
    setSelectedTopics((current) => {
      if (current.includes(topic)) {
        return current.filter((item) => item !== topic)
      }
      return [...current, topic]
    })
  }

  const startSession = (): void => {
    const normalizedSize = Number.isFinite(sessionSize) ? Math.round(sessionSize) : 40
    const topicsForSession = selectedVisibleTopics
    if (topicsForSession.length === 0) {
      setSetupError('Select at least one topic to start a session.')
      return
    }
    setSetupError(null)
    createNewSession({
      size: Math.max(1, Math.min(180, normalizedSize)),
      filters: {
        levels: selectedLevels.length > 0 ? selectedLevels : ['L1', 'L2', 'L3'],
        topics: topicsForSession,
      },
    })
  }

  const applyExamPreset = (level: CFALevel): void => {
    const blueprint = EXAM_BLUEPRINTS[level]
    setSelectedLevels([level])
    setSessionSize(blueprint.totalQuestions)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            CFA Level I, II, III
          </Badge>
          <Badge className="rounded-full px-3 py-1">{questions.length} MCQs</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">CFA Study Bank</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
          Practice exam-style, calculation-heavy questions with topic weighting guidance and answer
          review. Progress is saved locally so you can resume and iterate fast.
        </p>
      </header>

      <Tabs defaultValue="practice" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:w-[560px]">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-4">
          {!activeSession ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5" /> Session Setup
                  </CardTitle>
                  <CardDescription>
                    Choose level coverage and count. Use exam preset buttons for official question
                    counts and timing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 md:grid-cols-3">
                    {LEVELS.map((level) => (
                      <Label
                        key={level}
                        className="flex cursor-pointer items-center gap-2 rounded-md border p-3"
                      >
                        <Checkbox
                          checked={selectedLevels.includes(level)}
                          onCheckedChange={() => toggleLevel(level)}
                          aria-label={`Toggle ${level}`}
                        />
                        <span>{level}</span>
                      </Label>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {LEVELS.map((level) => (
                      <Button
                        key={level}
                        variant="outline"
                        onClick={() => applyExamPreset(level)}
                        type="button"
                      >
                        {level} Exam Preset
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Label>Topics ({selectedVisibleTopics.length}/{availableTopics.length} selected)</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setSelectedTopics(availableTopics)}
                        >
                          Select all topics
                        </Button>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setSelectedTopics([])}
                        >
                          Clear topics
                        </Button>
                      </div>
                    </div>
                    <div className="grid max-h-64 gap-2 overflow-auto rounded-md border p-3 md:grid-cols-2">
                      {availableTopics.map((topic) => (
                        <Label
                          key={topic}
                          className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm"
                        >
                          <Checkbox
                            checked={selectedVisibleTopics.includes(topic)}
                            onCheckedChange={() => toggleTopic(topic)}
                            aria-label={`Toggle topic ${topic}`}
                          />
                          <span>{topic}</span>
                        </Label>
                      ))}
                    </div>
                  </div>

                  <div className="w-full max-w-xs space-y-2">
                    <Label htmlFor="question-count">Question count</Label>
                    <Input
                      id="question-count"
                      type="number"
                      min={1}
                      max={180}
                      value={Number.isFinite(sessionSize) ? sessionSize : ''}
                      onChange={(event) => {
                        const raw = event.target.value
                        if (raw === '') {
                          setSessionSize(Number.NaN)
                          return
                        }
                        setSessionSize(Number(raw))
                      }}
                    />
                  </div>
                  {setupError ? (
                    <p className="text-sm text-destructive" data-testid="setup-error">
                      {setupError}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={startSession} data-testid="start-session">
                      Start New Session
                    </Button>
                    <Button variant="outline" onClick={resetProgress}>
                      <RefreshCcw className="mr-2 h-4 w-4" /> Reset Local Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">2026 Exam Blueprint Snapshot</CardTitle>
                  <CardDescription>
                    Official structure and topic-weight bands used to tune this study bank.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    {LEVELS.map((level) => {
                      const blueprint = EXAM_BLUEPRINTS[level]
                      return (
                        <div key={level} className="rounded-md border p-3 text-sm">
                          <p className="font-medium">{blueprint.officialLabel}</p>
                          <p className="text-muted-foreground">
                            {blueprint.totalQuestions} questions, {blueprint.totalMinutes} minutes
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">{blueprint.structure}</p>
                        </div>
                      )
                    })}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Topic weight bands</p>
                    {(selectedLevels.length === 1
                      ? EXAM_BLUEPRINTS[selectedLevels[0]].topicWeights
                      : EXAM_BLUEPRINTS.L1.topicWeights
                    ).map((weight) => (
                      <div key={weight.topic} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{weight.topic}</span>
                          <span className="text-muted-foreground">
                            {weight.low}-{weight.high}%
                          </span>
                        </div>
                        <Progress value={(weight.low + weight.high) / 2} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}

          {activeSession && currentQuestion ? (
            <Card data-testid="question-card">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-lg">{currentQuestion.topic}</CardTitle>
                  <Badge variant="outline">{currentQuestion.level}</Badge>
                </div>
                <CardDescription>
                  Question {activeSession.currentIndex + 1} of {activeSession.questionIds.length}
                </CardDescription>
                <Progress value={completionPercent} aria-label="Session progress" />
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={restartActiveSession}
                    data-testid="reset-test"
                  >
                    Reset Test
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={exitToMain}
                    data-testid="back-main"
                  >
                    Back To Main
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <MathText className="text-sm leading-relaxed md:text-base" text={currentQuestion.stem} />
                {currentQuestion.plot ? <QuestionPlot {...currentQuestion.plot} /> : null}
                <QuestionSources sources={currentQuestion.sources} />
                <div className="grid gap-2">
                  {currentQuestion.choices.map((choice, index) => {
                    const submitted = currentAnswer !== undefined
                    const isSelected = currentAnswer?.selectedIndex === index
                    const isCorrect = currentQuestion.correctIndex === index
                    const tone = submitted
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-50'
                        : isSelected
                          ? 'border-rose-400 bg-rose-50'
                          : 'border-border'
                      : 'border-border hover:bg-muted/80'

                    return (
                      <button
                        type="button"
                        key={`${currentQuestion.id}-${choice}`}
                        className={`w-full rounded-md border p-3 text-left text-sm ${tone}`}
                        disabled={submitted}
                        onClick={() => submitCurrentAnswer(index)}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>{' '}
                        <MathText text={choice} />
                      </button>
                    )
                  })}
                </div>

                {currentAnswer ? (
                  <div className="rounded-md border bg-muted/50 p-3 text-sm" data-testid="answer-feedback">
                    <p className="mb-1 font-medium">
                      {currentAnswer.isCorrect ? 'Correct' : 'Incorrect'} answer
                    </p>
                    <MathText className="text-muted-foreground" text={currentQuestion.explanation} />
                    <Button className="mt-3" onClick={() => moveNext()} data-testid="next-question">
                      Next Question
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">No active session</CardTitle>
                <CardDescription>
                  Build a new practice set to start answering questions.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Answered Questions</CardTitle>
              <CardDescription>
                Review all attempted questions, including your selected answer and explanation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={reviewFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReviewFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={reviewFilter === 'incorrect' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReviewFilter('incorrect')}
                >
                  Incorrect
                </Button>
                <Button
                  variant={reviewFilter === 'correct' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReviewFilter('correct')}
                >
                  Correct
                </Button>
              </div>

              {reviewRows.length === 0 ? (
                <p className="text-sm text-muted-foreground">No answered questions yet.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
                  <div className="max-h-[440px] space-y-2 overflow-auto pr-1">
                    {reviewRows.map((row) => {
                      const key = `${row.questionId}-${row.answeredAt}`
                      return (
                        <button
                          key={key}
                          type="button"
                          className={`w-full rounded-md border p-3 text-left text-sm ${selectedReviewKey === key ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => setSelectedReviewKey(key)}
                        >
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <Badge variant="outline">{row.question.level}</Badge>
                            <span className={row.isCorrect ? 'text-emerald-600' : 'text-rose-600'}>
                              {row.isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>
                          <p className="line-clamp-2">{row.question.stem}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {row.question.topic} • Q{row.questionIndex + 1}/{row.totalQuestions}
                          </p>
                        </button>
                      )
                    })}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Review Detail</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {selectedReview ? (
                        <>
                          <MathText className="font-medium" text={selectedReview.question.stem} />
                          {selectedReview.question.plot ? <QuestionPlot {...selectedReview.question.plot} /> : null}
                          <QuestionSources sources={selectedReview.question.sources} />
                          <p>
                            Your answer:{' '}
                            <span className={selectedReview.isCorrect ? 'text-emerald-600' : 'text-rose-600'}>
                              {String.fromCharCode(65 + selectedReview.selectedIndex)}.{' '}
                              {selectedReview.question.choices[selectedReview.selectedIndex]}
                            </span>
                          </p>
                          <p>
                            Correct answer: {String.fromCharCode(65 + selectedReview.question.correctIndex)}.{' '}
                            {selectedReview.question.choices[selectedReview.question.correctIndex]}
                          </p>
                          <Separator />
                          <MathText className="text-muted-foreground" text={selectedReview.question.explanation} />
                        </>
                      ) : (
                        <p className="text-muted-foreground">
                          Select an answered question from the list to inspect details.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4" /> Question Bank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{questions.length}</p>
                <p className="text-sm text-muted-foreground">Total questions available</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock3 className="h-4 w-4" /> Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{completedSessions.length}</p>
                <p className="text-sm text-muted-foreground">Completed sessions locally</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-4 w-4" /> Questions Answered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{totalAnswered}</p>
                <p className="text-sm text-muted-foreground">Across all saved sessions</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <LineChart className="h-4 w-4" /> Score Trend (Recent Sessions)
                </CardTitle>
                <CardDescription>Line plot of completed session percentages.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScoreTrendChart points={sessionTrend.map((s) => ({ label: s.label, percent: s.percent }))} />
                {sessionTrend.length > 0 ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Latest: {sessionTrend[sessionTrend.length - 1].percent}%
                  </p>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Difficulty Split (Donut)</CardTitle>
                <CardDescription>Distribution of answered easy/medium/hard questions.</CardDescription>
              </CardHeader>
              <CardContent>
                <DifficultyDonut rows={answeredDifficulties} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Topic Accuracy Bars</CardTitle>
              <CardDescription>Horizontal bars combining volume and hit-rate.</CardDescription>
            </CardHeader>
            <CardContent>
              <TopicBarChart rows={topicAccuracy} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default App

import { useMemo, useState } from 'react'
import { BarChart3, BookOpen, Clock3, RefreshCcw, Target } from 'lucide-react'
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

function App() {
  const {
    questions,
    questionsById,
    activeSession,
    completedSessions,
    createNewSession,
    submitCurrentAnswer,
    moveNext,
    resetProgress,
    getActiveScore,
    getTopicAccuracy,
    getAnsweredDifficulties,
  } = useStudyStore()

  const [selectedLevels, setSelectedLevels] = useState<CFALevel[]>(['L1', 'L2', 'L3'])
  const [sessionSize, setSessionSize] = useState(30)

  const currentQuestionId = activeSession ? getCurrentQuestionId(activeSession) : undefined
  const currentQuestion = currentQuestionId ? questionsById[currentQuestionId] : undefined
  const currentAnswer =
    activeSession && currentQuestionId ? activeSession.answers[currentQuestionId] : undefined

  const activeScore = getActiveScore()
  const completionPercent =
    activeScore.total > 0 ? Math.round((activeScore.answered / activeScore.total) * 100) : 0

  const topicAccuracy = getTopicAccuracy()
  const answeredDifficulties = getAnsweredDifficulties()

  const totalAnswered = useMemo(
    () => answeredDifficulties.reduce((sum, row) => sum + row.answered, 0),
    [answeredDifficulties],
  )

  const toggleLevel = (level: CFALevel): void => {
    setSelectedLevels((current) => {
      if (current.includes(level)) {
        return current.filter((item) => item !== level)
      }
      return [...current, level]
    })
  }

  const startSession = (): void => {
    createNewSession({
      size: Math.max(10, Math.min(120, sessionSize)),
      filters: {
        levels: selectedLevels.length > 0 ? selectedLevels : ['L1', 'L2', 'L3'],
      },
    })
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            CFA Level I, II, III
          </Badge>
          <Badge className="rounded-full px-3 py-1">1000 MCQs</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">CFA Study Bank</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
          Practice exam-style, single-best-answer questions across the CFA curriculum. Your
          progress is saved locally in your browser for quick resume sessions.
        </p>
      </header>

      <Tabs defaultValue="practice" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:w-[420px]">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-4">
          {!activeSession ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" /> Session Setup
                </CardTitle>
                <CardDescription>Choose level coverage and question count.</CardDescription>
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

                <div className="w-full max-w-xs space-y-2">
                  <Label htmlFor="question-count">Question count</Label>
                  <Input
                    id="question-count"
                    type="number"
                    min={10}
                    max={120}
                    value={sessionSize}
                    onChange={(event) => setSessionSize(Number(event.target.value) || 30)}
                  />
                </div>

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
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed md:text-base">{currentQuestion.stem}</p>
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
                        key={choice}
                        className={`w-full rounded-md border p-3 text-left text-sm ${tone}`}
                        disabled={submitted}
                        onClick={() => submitCurrentAnswer(index)}
                      >
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span>{' '}
                        {choice}
                      </button>
                    )
                  })}
                </div>

                {currentAnswer ? (
                  <div className="rounded-md border bg-muted/50 p-3 text-sm" data-testid="answer-feedback">
                    <p className="mb-1 font-medium">
                      {currentAnswer.isCorrect ? 'Correct' : 'Incorrect'} answer
                    </p>
                    <p className="text-muted-foreground">{currentQuestion.explanation}</p>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Topic accuracy snapshot</CardTitle>
              <CardDescription>Based on your local attempt history.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topicAccuracy.length === 0 ? (
                <p className="text-sm text-muted-foreground">No answered questions yet.</p>
              ) : (
                topicAccuracy.map((row) => (
                  <div key={row.topic} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{row.topic}</span>
                      <span className="text-muted-foreground">
                        {row.correct}/{row.answered} ({row.percent}%)
                      </span>
                    </div>
                    <Progress value={row.percent} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Difficulty coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-3">
                {answeredDifficulties.map((row) => (
                  <div key={row.difficulty} className="rounded-md border p-3 text-sm">
                    <p className="font-medium capitalize">{row.difficulty}</p>
                    <Separator className="my-2" />
                    <p>{row.answered} answered</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default App

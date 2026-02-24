import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'
import { useStudyStore } from '@/store/use-study-store'

describe('App', () => {
  it('starts a session and answers one question', async () => {
    localStorage.clear()
    useStudyStore.setState({
      activeSession: null,
      completedSessions: [],
    })
    const user = userEvent.setup()

    render(<App />)
    const countInput = screen.getByLabelText('Question count')
    await user.clear(countInput)
    await user.type(countInput, '5')

    await user.click(screen.getByTestId('start-session'))

    expect(await screen.findByTestId('question-card')).toBeInTheDocument()
    expect(useStudyStore.getState().activeSession?.questionIds.length).toBe(5)
    expect(screen.queryByText('Session Setup')).not.toBeInTheDocument()

    const options = screen.getAllByRole('button').filter((btn) =>
      /^[A-D]\.\s/.test(btn.textContent ?? ''),
    )
    expect(options.length).toBe(4)

    await user.click(options[0])
    expect(await screen.findByTestId('answer-feedback')).toBeInTheDocument()
    expect(screen.getByTestId('question-sources')).toBeInTheDocument()

    await user.click(screen.getByTestId('back-main'))
    expect(screen.getByText('Session Setup')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Review' }))
    expect(screen.getByText('Answered Questions')).toBeInTheDocument()
  })
})

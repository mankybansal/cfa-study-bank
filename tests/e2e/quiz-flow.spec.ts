import { expect, test } from '@playwright/test'

test('user can start and answer a question', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('start-session').click()

  await expect(page.getByTestId('question-card')).toBeVisible()

  const options = page.getByRole('button').filter({ hasText: /^A\.|^B\.|^C\.|^D\./ })
  await options.first().click()

  await expect(page.getByTestId('answer-feedback')).toBeVisible()
})

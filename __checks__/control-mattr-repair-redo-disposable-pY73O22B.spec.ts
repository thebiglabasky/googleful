import { test, expect } from '@playwright/test'

const TARGET_URL = process.env.ENVIRONMENT_URL ?? 'https://learn.mattr.global'
const CHAT_TIMEOUT = 20_000

test('Ask Bob chat returns meaningful streamed response about mdoc credential issuance', async ({ page }) => {
  const networkErrors: string[] = []
  page.on('requestfailed', (req) => {
    networkErrors.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`)
  })

  // Navigate and wait for full load
  const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30_000 })
  expect(response, 'Page navigation returned no response').not.toBeNull()
  expect(response!.status(), `Page returned HTTP ${response!.status()}`).toBeLessThan(400)

  // Verify page is not blank
  const bodyText = await page.locator('body').innerText({ timeout: 10_000 })
  expect(bodyText.trim().length, 'Page body is blank').toBeGreaterThan(0)

  // Wait for Ask Bob button
  const askBobButton = page.getByRole('button', { name: /ask bob/i })
  await expect(askBobButton).toBeVisible({ timeout: 15_000 })
  await expect(askBobButton).toBeEnabled({ timeout: 5_000 })
  await askBobButton.click()

  // Verify chat window rendered
  const chatInput = page.locator('textarea, input[type="text"]').last()
  await expect(chatInput).toBeVisible({ timeout: 10_000 })

  // Type and send the question
  await chatInput.fill('tell me about mdoc credential issuance verbosely')

  // Try send button, fall back to Enter
  const sendBtn = page.locator('button[type="submit"]').first()
  if (await sendBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await sendBtn.click()
  } else {
    await chatInput.press('Enter')
  }

  // Poll for streamed response content
  const startTime = Date.now()
  let responseText = ''

  await expect(async () => {
    const elapsed = Date.now() - startTime
    if (elapsed > CHAT_TIMEOUT) {
      throw new Error(`Chat response did not complete streaming within ${CHAT_TIMEOUT / 1000}s`)
    }
    const msgs = page.locator('[class*="message"], [class*="response"], [class*="answer"], [class*="chat"] p, [class*="bot"], [class*="assistant"]')
    const count = await msgs.count()
    let combined = ''
    for (let i = Math.max(0, count - 5); i < count; i++) {
      const t = await msgs.nth(i).innerText().catch(() => '')
      combined += ' ' + t
    }
    responseText = combined.trim()
    expect(responseText.length, 'Response is still empty or streaming has not started').toBeGreaterThan(50)
  }).toPass({ timeout: CHAT_TIMEOUT, intervals: [1_000, 2_000, 2_000] })

  // Validate response content
  const lower = responseText.toLowerCase()

  // Check for error keywords indicating silent backend failure
  const errorKws = ['error', 'failed', 'unable', 'something went wrong']
  for (const kw of errorKws) {
    if (lower.includes(kw) && !lower.includes('mattr')) {
      throw new Error(`Response contains error keyword "${kw}": ${responseText.substring(0, 200)}`)
    }
  }

  // Verify response is not blank
  expect(responseText.trim().length, 'Chat response is blank').toBeGreaterThan(50)

  // Verify response is relevant to the topic
  const terms = ['mattr', 'credential', 'mdoc', 'issuance', 'issuer', 'verif', 'digital', 'sign', 'vii']
  const relevant = terms.some((t) => lower.includes(t))
  expect(relevant, `No relevant terms found. Got: ${responseText.substring(0, 300)}`).toBeTruthy()

  // Final network error check
  expect(networkErrors, `Network errors:\n${networkErrors.join('\n')}`).toHaveLength(0)
})

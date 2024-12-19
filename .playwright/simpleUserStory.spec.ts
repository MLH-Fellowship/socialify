import { type Page, expect, test } from '@playwright/test'

const customTimeout = { timeout: 30000 }
const componentUpdateTimeout = 1000

// Testing constants.
const repo: string = 'wei/socialify'
const expectedConfigURL: string =
  '/wei/socialify?language=1&owner=1&name=1&stargazers=1&theme=Light'
const expectedImageURLRegExp: RegExp =
  /\/wei\/socialify\/image\?description=1&font=Source\+Code\+Pro&language=1&name=1&owner=1&theme=Light$/

async function getClipboardText(page: Page): Promise<string> {
  return await page.evaluate(async () => {
    return await navigator.clipboard.readText()
  })
}

test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('/', customTimeout)

  // Wait for the page to load/hydrate completely.
  await page.waitForLoadState('networkidle', customTimeout)
})

test.describe('A simple user story:', () => {
  test(`user can enter a GitHub repo ("username/repo"), click submit button, click "URL", and get the social preview image`, async ({
    page,
  }: { page: Page }): Promise<void> => {
    // Input and submit the repo following accessibility best practices.
    await page.fill('input[name="repo-input"]', repo)
    await page.waitForTimeout(componentUpdateTimeout)
    await page.click('button[type="submit"]')

    // Wait for navigation to the preview config page.
    await page.waitForSelector('button:has-text("URL")', customTimeout)

    // Wait for the page to load/hydrate completely.
    await page.waitForLoadState('networkidle', customTimeout)
    await expect(page).toHaveURL(expectedConfigURL)

    await page.click('input[name="stargazers"]')
    await page.waitForTimeout(componentUpdateTimeout)
    await page.click('input[name="description"]')
    await page.waitForTimeout(componentUpdateTimeout)
    // Select the "Source Code Pro" option for max diff from default.
    await page.selectOption('select[name="font"]', { label: 'Source Code Pro' })
    await page.waitForTimeout(componentUpdateTimeout)

    // Obtain the consistent preview image URL.
    await page.click('button:has-text("URL")')

    // Compare the clipboard content to the expected image URL.
    // (Only check the end of the URL due to dynamic localhost port allocation.)
    const url: string = await getClipboardText(page)
    expect(url).toMatch(expectedImageURLRegExp)

    // Visit the image URL and snapshot the image.
    await page.goto(url, customTimeout)

    // Wait for the page to load/hydrate completely.
    await page.waitForLoadState('networkidle', customTimeout)

    const image = await page.screenshot()
    expect(image).toMatchSnapshot()
  })
})

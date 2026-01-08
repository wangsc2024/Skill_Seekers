---
name: playwright
description: Browser automation and end-to-end testing framework by Microsoft
version: 1.0.0
---

# Playwright Skill

## Overview
Playwright is a framework for Web Testing and Automation developed by Microsoft. It enables cross-browser web automation that is reliable, fast, and capable. Playwright supports all modern rendering engines including Chromium, WebKit, and Firefox.

## When to Use This Skill
Use this skill when working with:
- End-to-end (E2E) testing for web applications
- Browser automation and web scraping
- Cross-browser testing (Chrome, Firefox, Safari/WebKit)
- API testing alongside browser tests
- Visual regression testing
- Mobile web testing

## Quick Reference

### Installation

```bash
# Node.js
npm init playwright@latest

# Python
pip install pytest-playwright
playwright install

# Java
# Add to pom.xml or build.gradle

# .NET
dotnet add package Microsoft.Playwright
```

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('basic navigation test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});

test('click and verify', async ({ page }) => {
  await page.goto('https://example.com');
  await page.click('text=More information');
  await expect(page).toHaveURL(/iana/);
});
```

### Locators (Recommended)

```typescript
// Preferred locator strategies (most stable)
page.getByRole('button', { name: 'Submit' })
page.getByText('Welcome')
page.getByLabel('Username')
page.getByPlaceholder('Enter email')
page.getByTestId('submit-button')

// CSS and XPath (when needed)
page.locator('css=button.primary')
page.locator('xpath=//button[@type="submit"]')
```

### Actions

```typescript
// Click actions
await page.click('button#submit');
await page.dblclick('text=Double click me');
await page.click('button', { button: 'right' });

// Input actions
await page.fill('input[name="email"]', 'user@example.com');
await page.type('input[name="search"]', 'query', { delay: 100 });

// Select and check
await page.selectOption('select#country', 'USA');
await page.check('input[type="checkbox"]');

// File upload
await page.setInputFiles('input[type="file"]', 'file.pdf');

// Keyboard and mouse
await page.keyboard.press('Enter');
await page.mouse.click(100, 200);
```

### Assertions

```typescript
// Page assertions
await expect(page).toHaveTitle('Page Title');
await expect(page).toHaveURL(/.*dashboard/);

// Locator assertions
await expect(page.locator('.status')).toBeVisible();
await expect(page.locator('.status')).toHaveText('Success');
await expect(page.locator('input')).toHaveValue('test@example.com');
await expect(page.locator('button')).toBeEnabled();
await expect(page.locator('.items')).toHaveCount(3);
```

### Page Object Model

```typescript
// pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/login.spec.ts
test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('/login');
  await loginPage.login('user@test.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

### API Testing

```typescript
import { test, expect } from '@playwright/test';

test('API test', async ({ request }) => {
  const response = await request.get('/api/users');
  expect(response.ok()).toBeTruthy();

  const users = await response.json();
  expect(users.length).toBeGreaterThan(0);
});

test('POST request', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: {
      name: 'John',
      email: 'john@example.com'
    }
  });
  expect(response.status()).toBe(201);
});
```

### Configuration (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: 4,

  use: {
    baseURL: 'https://example.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
```

### Waiting Strategies

```typescript
// Auto-waiting (built-in, preferred)
await page.click('button'); // Waits automatically

// Explicit waits when needed
await page.waitForSelector('.loaded');
await page.waitForLoadState('networkidle');
await page.waitForURL('**/success');
await page.waitForResponse('/api/data');
await page.waitForTimeout(1000); // Avoid if possible
```

### Screenshots and Videos

```typescript
// Screenshot
await page.screenshot({ path: 'screenshot.png' });
await page.screenshot({ path: 'full.png', fullPage: true });
await page.locator('.card').screenshot({ path: 'element.png' });

// Video recording (in config)
use: {
  video: 'on', // 'off', 'on', 'retain-on-failure', 'on-first-retry'
}
```

### Debugging Tools

```bash
# Run with headed browser
npx playwright test --headed

# Run in debug mode (Inspector)
npx playwright test --debug

# Run codegen (record tests)
npx playwright codegen example.com

# View trace
npx playwright show-trace trace.zip
```

## Key Concepts

1. **Auto-waiting**: Playwright automatically waits for elements to be actionable before performing actions
2. **Locators**: Use semantic locators (getByRole, getByText) over CSS/XPath when possible
3. **Test Isolation**: Each test runs in a fresh browser context
4. **Parallel Execution**: Tests run in parallel by default for faster execution
5. **Cross-browser**: Same API works across Chromium, Firefox, and WebKit

## Best Practices

1. Use locators with explicit attributes over text-based locators
2. Prefer `getByRole`, `getByLabel`, `getByTestId` over CSS selectors
3. Use Page Object Model for maintainable tests
4. Enable tracing for debugging failures
5. Run tests in headless mode for CI/CD pipelines
6. Use fixtures for setup and teardown

## Common Patterns

### Authentication State

```typescript
// Save auth state
await page.context().storageState({ path: 'auth.json' });

// Reuse auth state
const context = await browser.newContext({
  storageState: 'auth.json'
});
```

### Network Interception

```typescript
await page.route('**/api/**', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ mocked: true })
  });
});
```

## Reference Documentation
- Official Docs: https://playwright.dev/
- API Reference: https://playwright.dev/docs/api/class-playwright
- GitHub: https://github.com/microsoft/playwright

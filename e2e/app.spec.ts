import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-app-ready="true"]', { timeout: 10000 });
});

test.describe('Masternode Chess Duel Edition', () => {
  test('should load the application', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Masternode Chess Duel Edition');
  });

  test('should show game board ready message', async ({ page }) => {
    await expect(page.locator('#game-board')).toContainText('Chess game ready');
  });

  test('should have app marked as ready', async ({ page }) => {
    const appReady = await page.getAttribute('#app', 'data-app-ready');
    expect(appReady).toBe('true');
  });

  test('should not make external network calls', async ({ page }) => {
    // Listen for console errors that would indicate blocked network calls
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForSelector('[data-app-ready="true"]', { timeout: 10000 });

    // Check that no OFFLINE GUARD errors occurred (which would indicate attempted external calls)
    const offlineGuardErrors = errors.filter(e => e.includes('[OFFLINE GUARD]'));
    expect(offlineGuardErrors.length).toBe(0);
  });
});

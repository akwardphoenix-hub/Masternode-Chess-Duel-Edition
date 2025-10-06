import { test, expect } from '@playwright/test';
import { mockExternal } from './global.setup';

test.beforeEach(async ({ page }) => {
  // Apply external network mocking before each test
  await mockExternal(page);
});

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check that the page title is correct
  await expect(page).toHaveTitle(/Masternode Chess Duel Edition/);
  
  // Check that the main heading is present
  const heading = page.locator('h1');
  await expect(heading).toHaveText('Masternode Chess Duel Edition');
});

test('chess pieces are displayed', async ({ page }) => {
  await page.goto('/');
  
  // Check that the game board is present
  const gameBoard = page.locator('#game-board');
  await expect(gameBoard).toBeVisible();
  
  // Check that chess pieces are rendered
  const chessBoard = page.locator('.chess-board');
  await expect(chessBoard).toBeVisible();
  
  // Check that squares with chess pieces exist
  const squares = page.locator('.square');
  const count = await squares.count();
  expect(count).toBeGreaterThan(0);
});

test('no external network calls are made', async ({ page }) => {
  const externalRequests: string[] = [];
  
  // Track all network requests
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') {
      externalRequests.push(request.url());
    }
  });
  
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Verify no external requests were made
  expect(externalRequests).toEqual([]);
});

import { test, expect } from '@playwright/test'

test.describe('Masternode Chess Duel Edition', () => {
  test('should load the game page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Masternode Chess Duel Edition')
  })

  test('should start the game when clicking start button', async ({ page }) => {
    await page.goto('/')
    const startButton = page.locator('#start-game')
    await expect(startButton).toBeVisible()
    await expect(startButton).toHaveText('Start Game')
    
    await startButton.click()
    await expect(startButton).toHaveText('Reset Game')
    await expect(page.locator('#game-status')).toContainText('Game Started')
  })

  test('should reset the game when clicking reset button', async ({ page }) => {
    await page.goto('/')
    const startButton = page.locator('#start-game')
    
    // Start game
    await startButton.click()
    await expect(startButton).toHaveText('Reset Game')
    
    // Reset game
    await startButton.click()
    await expect(startButton).toHaveText('Start Game')
    await expect(page.locator('#game-status')).toBeEmpty()
  })
})

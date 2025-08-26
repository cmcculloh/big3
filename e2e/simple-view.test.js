import { test, expect } from '@playwright/test';

test('should open routine creation page', async ({ page }) => {
  // Navigate to the routine creation page
  await page.goto('/routines/create');

  // Wait for the page to load
  await page.waitForSelector('h1');

  // Verify the page title
  await expect(page.locator('h1')).toContainText('Create New Routine');

  // Verify form elements are present
  await expect(page.locator('#routine-name')).toBeVisible();
  await expect(page.locator('#routine-description')).toBeVisible();
  await expect(page.locator('#routine-category')).toBeVisible();
  await expect(page.locator('#routine-duration')).toBeVisible();

  // Verify the Add Exercise button is present
  await expect(page.locator('button:has-text("Add Exercise")')).toBeVisible();

  // Keep the browser open for manual inspection
  await page.waitForTimeout(10000); // Wait 10 seconds so you can see the page
});

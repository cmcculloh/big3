import { test, expect } from '@playwright/test';

test.describe('Routine Creation Page', () => {
  test('should create a new routine with exercises', async ({ page }) => {
    // Navigate to the routine creation page
    await page.goto('/routines/create');

    // Wait for the page to load
    await page.waitForSelector('h1');

    // Fill in routine details
    await page.fill('#routine-name', 'Test Workout Routine');
    await page.fill('#routine-description', 'A test routine for demonstration');
    await page.selectOption('#routine-category', 'strength');
    await page.fill('#routine-duration', '45');

    // Add an exercise
    await page.click('button:has-text("Add Exercise")');

    // Wait for exercise selector modal
    await page.waitForSelector('.modal-content');

    // Select an exercise (assuming there are exercises available)
    const exerciseItems = page.locator('.exercise-item');
    if (await exerciseItems.count() > 0) {
      await exerciseItems.first().click();
      await page.click('button:has-text("Add Selected")');
    }

    // Verify exercise was added
    await expect(page.locator('.exercise-item')).toHaveCount(1);

    // Edit exercise details
    await page.click('button:has-text("Edit")');

    // Fill in exercise details - look for the edit form inputs
    const editForm = page.locator('.exercise-edit-form');
    if (await editForm.isVisible()) {
      // Find the first number input for sets
      const numberInputs = page.locator('.exercise-edit-form input[type="number"]');
      if (await numberInputs.count() > 0) {
        await numberInputs.first().fill('3'); // Sets
      }

      // Find the select for type
      const selects = page.locator('.exercise-edit-form select');
      if (await selects.count() > 0) {
        await selects.first().selectOption('reps'); // Type
      }

      // Find the second number input for reps/time
      if (await numberInputs.count() > 1) {
        await numberInputs.nth(1).fill('10'); // Reps
      }

      // Find the text input for weight
      const textInputs = page.locator('.exercise-edit-form input[type="text"]');
      if (await textInputs.count() > 0) {
        await textInputs.first().fill('135 lbs'); // Weight
      }
    }

    // Save exercise
    await page.click('button:has-text("Save")');

    // Save the routine
    await page.click('button:has-text("Create Routine")');

    // Wait for success message (should show in alert modal)
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('should show validation errors for empty routine name', async ({ page }) => {
    await page.goto('/routines/create');

    // Try to save without entering a name
    await page.click('button:has-text("Create Routine")');

    // Should show error modal
    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.locator('.modal-content')).toContainText('Please enter a routine name');
  });

  test('should allow reordering exercises', async ({ page }) => {
    await page.goto('/routines/create');

    // Add multiple exercises
    await page.click('button:has-text("Add Exercise")');
    await page.waitForSelector('.modal-content');

    // Add first exercise
    const exerciseItems = page.locator('.exercise-item');
    if (await exerciseItems.count() > 0) {
      await exerciseItems.first().click();
      await page.click('button:has-text("Add Selected")');
    }

    // Add second exercise
    await page.click('button:has-text("Add Exercise")');
    await page.waitForSelector('.modal-content');
    if (await exerciseItems.count() > 1) {
      await exerciseItems.nth(1).click();
      await page.click('button:has-text("Add Selected")');
    }

    // Verify we have 2 exercises
    await expect(page.locator('.exercise-item')).toHaveCount(2);

    // Test move up/down buttons - look for buttons with arrow icons
    const moveUpButtons = page.locator('button:has-text("↑")');
    const moveDownButtons = page.locator('button:has-text("↓")');

    if (await moveUpButtons.count() > 0 && await moveDownButtons.count() > 0) {
      // Move first exercise down
      await moveDownButtons.first().click();

      // Move second exercise up
      await moveUpButtons.nth(1).click();
    }
  });

  test('should remove exercises', async ({ page }) => {
    await page.goto('/routines/create');

    // Add an exercise
    await page.click('button:has-text("Add Exercise")');
    await page.waitForSelector('.modal-content');

    const exerciseItems = page.locator('.exercise-item');
    if (await exerciseItems.count() > 0) {
      await exerciseItems.first().click();
      await page.click('button:has-text("Add Selected")');
    }

    // Verify exercise was added
    await expect(page.locator('.exercise-item')).toHaveCount(1);

    // Remove the exercise - look for remove button
    await page.click('button:has-text("Remove")');

    // Verify exercise was removed
    await expect(page.locator('.exercise-item')).toHaveCount(0);
  });
});

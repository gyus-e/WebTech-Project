import { test, expect } from '@playwright/test';

test('title is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('WebTech StreetCats');
});

test('map is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('div').filter({ hasText: '+− Leaflet | © OpenStreetMap' }).nth(2)).toBeVisible();
});
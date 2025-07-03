import { test, expect } from '@playwright/test';

test('unauthenticated user cannot see post form', async ({ page }) => {
  await page.goto('/cats');
  await expect(page.getByRole('button', { name: 'Upload New Cat' })).toBeHidden();
});

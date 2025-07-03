import { test, expect } from '@playwright/test';

test('click sign up', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page).toHaveTitle('Signup');
});

test('click login', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page).toHaveTitle('Login');
});

test('click cats', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Cats', exact: true }).click();
  await expect(page).toHaveTitle('Cats');
});
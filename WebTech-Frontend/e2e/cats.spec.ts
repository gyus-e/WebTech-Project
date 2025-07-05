import { test, expect, request } from '@playwright/test';
import { REST_BACKEND_URL } from '../src/app/_config/rest-backend-url';

test('unauthenticated user cannot see post form', async ({ page }) => {
  await page.goto('/cats');
  await expect(page.locator('form')).toBeHidden();
});

test.describe('authenticated user cats operations', () => {
  const TEST_USR = 'testuser@example.com';
  const TEST_PWD = 'testpassword';

  test.beforeAll(async () => {
    const apiContext = await request.newContext();
    await apiContext.post(`${REST_BACKEND_URL}/auth/signup`, {
      data: {
        usr: TEST_USR,
        pwd: TEST_PWD,
      },
    });
    await apiContext.dispose();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USR);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill(TEST_PWD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Success')).toBeVisible();
    await page.goto('/cats');
  });

  test.afterEach(async ({ page }) => {
    await page.goto('/logout');
  });

  test('can see post form', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
  });

  test('can create a new cat post', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Enter cat name' }).fill('Yamamaya');
    await page.getByRole('button', { name: 'Upload New Cat' }).click();
    await expect(page.getByText('Success')).toBeVisible();
  });

});
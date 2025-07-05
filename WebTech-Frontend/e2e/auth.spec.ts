import { test, expect, request } from '@playwright/test';
import { REST_BACKEND_URL } from '../src/app/_config/rest-backend-url';

test.describe('Invalid form data', () => {
    test('sign up with invalid email', async ({ page }) => {
    await page.goto('/signup');
    await page.getByRole('textbox', { name: 'Email' }).fill('invalid-email');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('mypassword');
    await page.getByRole('textbox', { name: 'Confirm password' }).fill('mypassword');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText('Error: invalid form data')).toBeVisible();
    });

    test('login with invalid email', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email' }).fill('invalid-email');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('mypassword');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Error: invalid form data')).toBeVisible();
    });

    test('sign up with invalid password', async ({ page }) => {
    await page.goto('/signup');
    await page.getByRole('textbox', { name: 'Email' }).fill('email@email.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('pwd');
    await page.getByRole('textbox', { name: 'Confirm password' }).fill('pwd');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText('Error: invalid form data')).toBeVisible();
    });

    test('login with invalid password', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email' }).fill('email@email.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('pwd');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Error: invalid form data')).toBeVisible();
    });

    test('sign up passwords do not match', async ({ page }) => {
    await page.goto('/signup');
    await page.getByRole('textbox', { name: 'Email' }).fill('email@email.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password1');
    await page.getByRole('textbox', { name: 'Confirm password' }).fill('password2');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText('Passwords do not match!')).toBeVisible();
    });
});

test.describe('valid form data', () => {
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

  test('login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(TEST_USR);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill(TEST_PWD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Success')).toBeVisible();
  });
});
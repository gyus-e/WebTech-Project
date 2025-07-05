import { inject } from '@angular/core';
import { test, expect } from '@playwright/test';
import { RestBackendAuthService } from '../src/app/_services/rest-backend/rest-backend-auth.service';
import { AuthRequest } from '../src/app/_types/auth-request.type';
import { AuthService } from '../src/app/_services/auth/auth.service';

test('unauthenticated user cannot see post form', async ({ page }) => {
  await page.goto('/cats');
  await expect(page.getByRole('button', { name: 'Upload New Cat' })).toBeHidden();
});

describe('authenticated user cats operations', () => {
  const restBackendAuthService = inject(RestBackendAuthService);
  const authService = inject(AuthService);

  test.beforeAll(async ({ page }) => {
    restBackendAuthService.signup({usr: 'testuser', pwd: 'password'} as AuthRequest).subscribe({
      next: (token) => {
        authService.updateToken(token).then(() => {return});
      },
      error: (err) => {
        throw new Error(`Failed to sign up: ${err.message}`);
      }
    });
  });

  test.beforeEach(async ({ page }) => {
    restBackendAuthService.login({usr: 'testuser', pwd: 'password'} as AuthRequest).subscribe({
      next: (token) => {
        authService.updateToken(token).then(() => {return});
      },
      error: (err) => {
        throw new Error(`Failed to log in: ${err.message}`);
      }
    });
  });

  test('can see post form', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Upload New Cat' })).toBeVisible();
  });

  test('can create a new cat post', async ({ page }) => {
    await page.getByRole('button', { name: 'Upload New Cat' }).click();
    await page.getByLabel('Cat Name').fill('Yamamaya');
    await page.getByLabel('Cat Image').setInputFiles('assets/yamamaya.jpg');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Yamamaya')).toBeVisible();
  });

});
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';
const STANDARD_USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('SauceDemo Login Page - Standard User', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('verify login page is displayed', async ({ page }) => {
    await expect(await page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('verify standard user can log in with valid credentials', async ({ page }) => {
    await page.getByPlaceholder('Username').fill(STANDARD_USERNAME);
    await page.getByPlaceholder('Password').fill(PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('verify login is blocked when username and password are empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('div.error-message-container.error:visible'))
      .toContainText('Epic sadface: Username is required');
    await expect(page).toHaveURL(BASE_URL);
  });

  test('verify login is blocked when standard username is entered without a password', async ({ page }) => {
    await page.getByPlaceholder('Username').fill(STANDARD_USERNAME);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('div.error-message-container.error:visible'))
      .toContainText('Epic sadface: Password is required');
    await expect(page).toHaveURL(BASE_URL);
  });

  test('verify password characters are masked', async ({ page }) => {
    const passwordField = page.getByPlaceholder('Password');

    await passwordField.fill(PASSWORD);

    await expect(passwordField).toHaveAttribute('type', 'password');
  });
});

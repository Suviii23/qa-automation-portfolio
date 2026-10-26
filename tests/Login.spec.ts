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

  test('verify login with valid standard user credentials', async ({ page }) => {
    await page.getByPlaceholder('Username').fill(STANDARD_USERNAME);
    await page.getByPlaceholder('Password').fill(PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('verify login with invalid username', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('invalid_user');
    await page.getByPlaceholder('Password').fill(PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]'))
      .toContainText('Username and password do not match any user in this service');
    await expect(page).toHaveURL(BASE_URL);
  });

  test('verify login with invalid password', async ({ page }) => {
    await page.getByPlaceholder('Username').fill(STANDARD_USERNAME);
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]'))
      .toContainText('Username and password do not match any user in this service');
    await expect(page).toHaveURL(BASE_URL);
  });

  test('verify error message can be dismissed', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toContainText('Username is required');

    await page.locator('[data-test="error-button"]').click();

    await expect(errorMessage).toBeHidden();
  });

  test('verify login form remains available after failed login', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('invalid_user');
    await page.getByPlaceholder('Password').fill(PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page).toHaveURL(BASE_URL);
  });
});

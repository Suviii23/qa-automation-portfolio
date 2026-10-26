import { expect, test } from '@playwright/test';
import { BASE_URL } from '../config/environment';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { loginTestData } from './test-data/login.data';

test.describe('SauceDemo login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('displays the login page', async ({ page }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(BASE_URL);
  });

  test('blocks login when username and password are empty', async ({ page }) => {
    await loginPage.submit();

    await expect(loginPage.errorMessage)
      .toContainText(loginTestData.expectedErrors.usernameRequired);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('blocks login when password is empty', async ({ page }) => {
    await loginPage.usernameInput.fill(loginTestData.standardUser.username);
    await loginPage.submit();

    await expect(loginPage.errorMessage)
      .toContainText(loginTestData.expectedErrors.passwordRequired);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('masks password characters', async () => {
    await loginPage.passwordInput.fill(loginTestData.standardUser.password);

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('logs in with valid standard user credentials', async ({ page }) => {
    await loginPage.login(
      loginTestData.standardUser.username,
      loginTestData.standardUser.password,
    );

    const inventoryPage = new InventoryPage(page);
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(inventoryPage.productsHeading).toBeVisible();
  });

  test('rejects an invalid username', async ({ page }) => {
    await loginPage.login(
      loginTestData.invalidUser.username,
      loginTestData.invalidUser.password,
    );

    await expect(loginPage.errorMessage)
      .toContainText(loginTestData.expectedErrors.invalidCredentials);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('rejects an invalid password', async ({ page }) => {
    await loginPage.login(
      loginTestData.invalidPassword.username,
      loginTestData.invalidPassword.password,
    );

    await expect(loginPage.errorMessage)
      .toContainText(loginTestData.expectedErrors.invalidCredentials);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('allows the error message to be dismissed', async () => {
    await loginPage.submit();
    await expect(loginPage.errorMessage)
      .toContainText(loginTestData.expectedErrors.usernameRequired);

    await loginPage.dismissError();

    await expect(loginPage.errorMessage).toBeHidden();
  });

  test('keeps the login form available after a failed login', async ({ page }) => {
    await loginPage.login(
      loginTestData.invalidUser.username,
      loginTestData.invalidUser.password,
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(BASE_URL);
  });
});

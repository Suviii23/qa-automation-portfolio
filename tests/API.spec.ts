
import { test, expect } from '@playwright/test';
import { API_BASE_URL } from '../config/api-environment';

test.describe('API Tests - Posts', () => {
  test('verify GET request returns a post successfully', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/posts/1`);

    // Verify HTTP status
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // Parse response body
    const responseBody = await response.json();

    // Verify response data
    expect(responseBody.id).toBe(1);
    expect(responseBody.userId).toBe(1);
    expect(responseBody.title).toBeTruthy();
    expect(typeof responseBody.title).toBe('string');
    expect(responseBody.body).toBeTruthy();
    expect(typeof responseBody.body).toBe('string');
  });
});

test('verify POST request sends data and returns the created post', async ({ request }) => {
  const requestBody = {
    title: 'Playwright API Testing',
    body: 'Learning API automation with TypeScript',
    userId: 1,
  };

  const response = await request.post(`${API_BASE_URL}/posts`, {
    data: requestBody,
  });

  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  expect(responseBody.title).toBe(requestBody.title);
  expect(responseBody.body).toBe(requestBody.body);
  expect(responseBody.userId).toBe(requestBody.userId);
  expect(responseBody.id).toBeTruthy();
});

test('verify GET request for nonexistent post returns 404', async ({ request }) => {
  const response = await request.get(`${API_BASE_URL}/posts/999999`);

  expect(response.status()).toBe(404);
});

test('verify POST request handles missing fields', async ({ request }) => {
  const response = await request.post(`${API_BASE_URL}/posts`, {
    data: {},
  });

  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty('id');
});

import { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly productsHeading: Locator;

  constructor(page: Page) {
    this.productsHeading = page.getByText('Products', { exact: true });
  }
}

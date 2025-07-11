import { Page } from '@playwright/test';

/**
 * Base Page Object class that contains common methods and properties
 * All page objects should extend this class
 */
export class BasePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }
  
  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}

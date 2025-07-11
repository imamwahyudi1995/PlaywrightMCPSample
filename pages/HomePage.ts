import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object representing the Dealls.com Homepage
 */
export class HomePage extends BasePage {
  // Define locators
  readonly heading: Locator;
  readonly searchBox: Locator;
  
  /**
   * Initialize HomePage elements
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.searchBox = page.getByRole('textbox', { name: /Search by job title/ });
  }
  
  /**
   * Navigate to the Dealls homepage
   */
  async goto(): Promise<void> {
    await super.goto('https://dealls.com/');
  }
  
  /**
   * Verify that the homepage has loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Lowongan Kerja Terbaru/);
    await expect(this.heading).toContainText('Cari Lowongan Kerja Pakai Dealls');
  }
  
  /**
   * Search for jobs using the search box
   * @param keyword - Search keyword
   */
  async searchJobs(keyword: string): Promise<void> {
    await expect(this.searchBox).toBeVisible();
    await this.searchBox.fill(keyword);
    await this.searchBox.press('Enter');
  }
}

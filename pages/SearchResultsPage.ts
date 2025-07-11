import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object representing the Dealls.com Search Results Page
 */
export class SearchResultsPage extends BasePage {
  /**
   * Initialize SearchResultsPage elements
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Verify that search results have loaded for the given keyword
   * @param keyword - Search keyword used
   */
  async verifySearchResults(keyword: string): Promise<void> {
    // Verify URL contains search keyword
    await expect(this.page).toHaveURL(new RegExp(`searchJob=${keyword.replace(/\s+/g, '\\+')}`));
    
    // Wait for search results to load
    const jobListings = this.page.getByRole('heading', { level: 2 }).first();
    await expect(jobListings).toBeVisible({ timeout: 10000 });
  }
  
  /**
   * Get a job listing by title
   * @param title - The job title to find
   * @returns The job listing Locator
   */
  getJobByTitle(title: string): Locator {
    return this.page.getByRole('heading', { level: 2 }).filter({ hasText: title }).first();
  }
  
  /**
   * Click on a job listing and wait for the job details page to open
   * @param jobTitle - Title of the job to click
   * @returns The URL of the clicked job
   */
  async clickOnJob(jobTitle: string): Promise<{ newPage: Page; jobUrl: string }> {
    // Find job with the specified title
    const jobHeading = this.getJobByTitle(jobTitle);
    await expect(jobHeading).toBeVisible();
    
    // Get the job card's URL for verification
    const jobCard = jobHeading.locator('xpath=../../../..');
    const href = await jobCard.getAttribute('href') || '';
    
    // Set up listener for the new tab/page that will open
    const pagePromise = this.page.waitForEvent('popup');
    
    // Click on the job title to open job details
    await jobHeading.click();
    
    // Wait for the new page to open
    const newPage = await pagePromise;
    
    return { newPage, jobUrl: href };
  }
}

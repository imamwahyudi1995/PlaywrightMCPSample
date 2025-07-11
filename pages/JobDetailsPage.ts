import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object representing the Dealls.com Job Details Page
 */
export class JobDetailsPage extends BasePage {
  readonly jobDescriptionHeading: Locator;
  readonly qualificationsHeading: Locator;
  readonly applyButton: Locator;
  readonly benefitsSection: Locator;
  
  /**
   * Initialize JobDetailsPage elements
   * @param page - Playwright Page instance
   */
  constructor(page: Page) {
    super(page);
    this.jobDescriptionHeading = page.getByRole('heading', { name: 'Deskripsi Pekerjaan' });
    this.qualificationsHeading = page.getByRole('heading', { name: 'Kualifikasi' });
    this.applyButton = page.getByRole('button').filter({ hasText: /Lamar/ });
    this.benefitsSection = page.getByRole('heading', { level: 3 }).filter({ hasText: 'Benefit Perusahaan' });
  }
  
  /**
   * Verify that the job details page has loaded correctly and contains expected elements
   * @param jobUrl - The expected URL path fragment
   */
  async verifyJobDetailsPage(jobUrl: string): Promise<void> {
    // Wait for the page to load completely
    await this.waitForPageLoad();
    
    // Verify URL contains correct job path
    expect(this.page.url()).toContain(jobUrl);
    
    // Verify job information sections exist
    await expect(this.jobDescriptionHeading).toBeVisible();
    await expect(this.qualificationsHeading).toBeVisible();
    
    // Verify apply button is visible
    await expect(this.applyButton).toBeVisible();
    
    // Verify benefits section exists
    await expect(this.benefitsSection).toBeVisible();
  }
}

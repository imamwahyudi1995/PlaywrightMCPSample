# Page Object Model (POM) Implementation

## Overview

This document explains the Page Object Model implementation for the Dealls.com job search automation project. The Page Object Model is a design pattern that creates an object repository for web UI elements, improving test maintenance and reducing code duplication.

## Structure

Our POM implementation consists of four main classes:

1. **BasePage** - Base class with common functionality
2. **HomePage** - Represents the Dealls.com homepage
3. **SearchResultsPage** - Represents the job search results page
4. **JobDetailsPage** - Represents the job details page

## BasePage Implementation

`BasePage.ts` provides common functionality for all page objects:

```typescript
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
```

## HomePage Implementation

`HomePage.ts` encapsulates interactions with the Dealls.com homepage:

```typescript
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
```

## SearchResultsPage Implementation

`SearchResultsPage.ts` handles interactions with job search results:

```typescript
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
```

## JobDetailsPage Implementation

`JobDetailsPage.ts` manages interactions with the job details page:

```typescript
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
```

## Using the Page Objects in Tests

Our tests use these page objects to create a clear, maintainable structure:

```typescript
import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { JobDetailsPage } from '../pages/JobDetailsPage';

test.describe('Dealls Job Search Functionality with POM', () => {
  test('should search for software developer jobs and view job details', async ({ page }) => {
    // Initialize Page Objects
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    const jobDetailsPage = new JobDetailsPage(page);
    
    // Step 1: Navigate to the homepage and verify
    await test.step('Navigate to Dealls homepage', async () => {
      await homePage.goto();
      await homePage.verifyPageLoaded();
    });

    // Step 2: Search for software developer jobs and verify results
    await test.step('Search for software developer jobs', async () => {
      await homePage.searchJobs('software developer');
      await searchResultsPage.verifySearchResults('software developer');
    });

    // Step 3: Click on job and view details in new tab
    await test.step('View job details', async () => {
      // Find and click on a Software Developer job listing
      const { newPage, jobUrl } = await searchResultsPage.clickOnJob('Software Developer');
      
      // Initialize a new JobDetailsPage with the new page
      const jobDetailsPageTab = new JobDetailsPage(newPage);
      
      // Wait for the page to load completely
      await newPage.waitForLoadState('networkidle');
      
      // Verify the job details page
      await jobDetailsPageTab.verifyJobDetailsPage(jobUrl);
    });
  });
});
```

## Benefits of Our POM Implementation

1. **Separation of Concerns**: Test code is separated from page-specific implementation details.

2. **Improved Maintainability**: UI changes only require updates in one place (the page object), not in multiple tests.

3. **Readability**: Test code focuses on the business logic and user journeys rather than DOM interactions.

4. **Reusability**: Page objects can be reused across multiple test cases.

5. **Reduced Duplication**: Common functionality is implemented once and shared across page objects.

6. **Better Abstraction**: Tests operate at a higher level of abstraction, making them easier to understand.

7. **Encapsulation**: Page-specific elements and behaviors are encapsulated within their respective page objects.

## Future Enhancements

1. **Component Objects**: For reusable UI components that appear on multiple pages
2. **Data Providers**: For parameterized testing with different search terms
3. **State Management**: Handling complex application states and transitions
4. **API Integration**: Combining UI tests with API calls for more efficient testing

---

*Documentation created: July 11, 2025*

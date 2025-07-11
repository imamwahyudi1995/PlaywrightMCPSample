import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { JobDetailsPage } from '../pages/JobDetailsPage';

/**
 * Test: Dealls Job Search using Page Object Model (POM)
 * 
 * This test verifies the core job search functionality of Dealls.com, including:
 * 1. Navigating to the homepage
 * 2. Searching for software developer jobs
 * 3. Viewing job details and verifying job information
 * 
 * Using Page Object Model for better test maintainability and reusability.
 */
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

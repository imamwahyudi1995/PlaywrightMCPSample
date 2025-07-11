import { test, expect } from '@playwright/test';

/**
 * Test: Dealls Job Search
 * 
 * This test verifies the core job search functionality of Dealls.com, including:
 * 1. Navigating to the homepage
 * 2. Searching for software developer jobs
 * 3. Viewing job details and verifying job information
 */
test.describe('Dealls Job Search Functionality', () => {
  test('should search for software developer jobs and view job details', async ({ page }) => {
    // Step 1: Navigate to the homepage
    await test.step('Navigate to Dealls homepage', async () => {
      await page.goto('https://dealls.com/');
      
      // Verify that we're on the homepage
      await expect(page).toHaveTitle(/Lowongan Kerja Terbaru/);
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Cari Lowongan Kerja Pakai Dealls');
    });

    // Step 2: Search for software developer jobs
    await test.step('Search for software developer jobs', async () => {
      // Type in the search box and press Enter
      const searchBox = page.getByRole('textbox', { name: /Search by job title/ });
      await expect(searchBox).toBeVisible();
      await searchBox.fill('software developer');
      await searchBox.press('Enter');
      
      // Verify search results page
      await expect(page).toHaveURL(/searchJob=software\+developer/);
      
      // Wait for search results to load and verify we have results
      const jobListings = page.getByRole('heading', { level: 2 }).filter({ hasText: /Software/ }).first();
      await expect(jobListings).toBeVisible({ timeout: 10000 });
    });

    // Step 3: View job details
    await test.step('View job details', async () => {
      // Find and wait for a Software Developer job listing
      const jobTitle = page.getByRole('heading', { level: 2 }).filter({ hasText: 'Software Developer' }).first();
      await expect(jobTitle).toBeVisible();
      
      // Get the job card's URL for verification
      const jobCard = jobTitle.locator('xpath=../../../..');
      const href = await jobCard.getAttribute('href') || '';
      
      // Set up listener for the new tab/page that will open
      const pagePromise = page.waitForEvent('popup');
      
      // Click on the job title to open job details
      await jobTitle.click();
      
      // Wait for the new page to open and load
      const jobDetailsPage = await pagePromise;
      await jobDetailsPage.waitForLoadState('networkidle');
      
      // Verify the job details page URL
      expect(jobDetailsPage.url()).toContain(href);
      
      // Verify job information sections exist
      await expect(jobDetailsPage.getByRole('heading', { name: 'Deskripsi Pekerjaan' })).toBeVisible();
      await expect(jobDetailsPage.getByRole('heading', { name: 'Kualifikasi' })).toBeVisible();
      
      // Verify job action button exists (Apply button)
      const applyButton = jobDetailsPage.getByRole('button').filter({ hasText: /Lamar/ });
      await expect(applyButton).toBeVisible();
      
      // Verify company benefits section exists
      const benefitSection = jobDetailsPage.getByRole('heading', { level: 3 }).filter({ hasText: 'Benefit Perusahaan' });
      await expect(benefitSection).toBeVisible();
    });
  });
});

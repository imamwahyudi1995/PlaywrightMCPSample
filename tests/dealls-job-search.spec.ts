import { test, expect } from '@playwright/test';

/**
 * Test suite for Dealls.com job search functionality
 * 
 * This test verifies the core job search functionality of Dealls.com, including:
 * 1. Navigating to the homepage
 * 2. Searching for jobs by keyword
 * 3. Viewing job details
 */
test.describe('Dealls Job Search Functionality', () => {
  test('should search for software developer jobs and view job details', async ({ page }) => {
    // Navigate to the homepage
    await test.step('Navigate to the homepage', async () => {
      await page.goto('https://dealls.com/');
      
      // Verify that we're on the homepage
      await expect(page).toHaveTitle(/Lowongan Kerja Terbaru/);
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Cari Lowongan Kerja Pakai Dealls');
    });

    // Search for software developer jobs
    await test.step('Search for software developer jobs', async () => {
      // Type in the search box and press Enter
      const searchBox = page.getByRole('textbox', { name: /Search by job title/ });
      await searchBox.fill('software developer');
      await searchBox.press('Enter');
      
      // Verify search results
      await expect(page).toHaveURL(/searchJob=software\+developer/);
      
      // Wait for search results to load and verify we have results
      const jobListings = page.locator('h2:has-text("Software")').first();
      await expect(jobListings).toBeVisible({ timeout: 10000 });
    });

    // View job details
    await test.step('View job details', async () => {
      // Find and wait for the first Software Developer job listing
      const jobTitle = page.getByRole('heading', { name: 'Software Developer', exact: true }).first();
      await expect(jobTitle).toBeVisible();
      
      // Get the URL of the job we're about to click for verification
      const jobCard = jobTitle.locator('xpath=../../../..');
      const href = await jobCard.getAttribute('href') || '';
      
      // Set up listener for the new tab/page that will open
      const pagePromise = page.waitForEvent('popup');
      
      // Click on the job title to open job details
      await jobTitle.click();
      
      // Wait for the new page to open and load
      const jobDetailsPage = await pagePromise;
      await jobDetailsPage.waitForLoadState('networkidle');
      
      // Verify the job details page URL contains the correct job path
      expect(jobDetailsPage.url()).toContain(href);
      
      // Verify job information sections exist
      await expect(jobDetailsPage.getByRole('heading', { name: 'Deskripsi Pekerjaan' })).toBeVisible();
      await expect(jobDetailsPage.getByRole('heading', { name: 'Kualifikasi' })).toBeVisible();
      
      // Verify job action buttons exist
      await expect(jobDetailsPage.getByRole('button', { name: /Lamar/i })).toBeVisible();
      
      // Verify job-related sections exist by checking for relevant items
      const benefitSection = jobDetailsPage.locator('h3').filter({ hasText: 'Benefit Perusahaan' });
      await expect(benefitSection).toBeVisible();
    });
  });
});

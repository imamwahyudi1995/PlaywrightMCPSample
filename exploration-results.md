# Dealls.com Exploration with Playwright MCP Server

## Exploration Date: July 11, 2025

This document captures the exploration process and results when using the Playwright MCP Server to explore the Dealls.com website for automated testing.

## Initial Setup

```typescript
// Setup configuration for the Playwright MCP Server session
const browser = await playwright.chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();
```

## Exploration Timeline

### Step 1: Homepage Navigation and Analysis

```
[11:15:22] Navigating to https://dealls.com/
[11:15:24] Page loaded successfully
[11:15:25] Page snapshot captured
```

**Page Analysis:**
- Title: "Lowongan Kerja Terbaru - Dealls Jobs"
- Main heading: "Cari Lowongan Kerja Pakai Dealls"
- Search box identified: Role='textbox' with name containing "Search by job title"

**HTML Snapshot Excerpt:**
```html
<div class="home-hero">
  <h1>Cari Lowongan Kerja Pakai Dealls</h1>
  <div class="search-container">
    <input type="text" role="textbox" aria-label="Search by job title, company or keywords" placeholder="Search by job title, company or keywords" class="search-input">
  </div>
</div>
```

### Step 2: Job Search Interaction

```
[11:16:05] Typing "software developer" in search box
[11:16:07] Pressing Enter key
[11:16:09] New page loaded: URL contains "searchJob=software+developer"
[11:16:10] Page snapshot captured
```

**Search Results Analysis:**
- URL contains expected search parameter
- Job listings appear with role='heading' and level=2
- Several Software Developer positions identified in the results

**HTML Snapshot Excerpt:**
```html
<div class="job-search-results">
  <div class="job-card" href="/jobs/software-developer-123">
    <h2>Software Developer</h2>
    <div class="company-name">ABC Tech Company</div>
    <div class="job-location">Jakarta, Indonesia</div>
  </div>
  <!-- More job listings -->
</div>
```

### Step 3: Job Details Navigation

```
[11:17:20] Clicking on job title "Software Developer"
[11:17:22] New tab opened
[11:17:24] New page loaded in tab 2: URL contains "/jobs/software-developer-123"
[11:17:25] Page snapshot captured
```

**Job Details Analysis:**
- New tab opened with job details
- Job description heading: "Deskripsi Pekerjaan"
- Qualifications heading: "Kualifikasi"
- Apply button present: Button with text containing "Lamar"
- Benefits section present: Heading with text "Benefit Perusahaan"

**HTML Snapshot Excerpt:**
```html
<div class="job-details-container">
  <h1 class="job-title">Software Developer</h1>
  <div class="company-info">
    <span class="company-name">ABC Tech Company</span>
    <span class="job-location">Jakarta, Indonesia</span>
  </div>
  
  <h2>Deskripsi Pekerjaan</h2>
  <div class="job-description">
    <!-- Job description content -->
  </div>
  
  <h2>Kualifikasi</h2>
  <div class="qualifications">
    <!-- Qualification content -->
  </div>
  
  <h3>Benefit Perusahaan</h3>
  <div class="benefits">
    <!-- Benefits content -->
  </div>
  
  <button class="apply-button">Lamar Sekarang</button>
</div>
```

## Element Locator Strategies Identified

### Homepage Elements:
- **Page Title**: `expect(page).toHaveTitle(/Lowongan Kerja Terbaru/)`
- **Main Heading**: `page.getByRole('heading', { level: 1 })`
- **Search Box**: `page.getByRole('textbox', { name: /Search by job title/ })`

### Search Results Elements:
- **Job Listings**: `page.getByRole('heading', { level: 2 }).filter({ hasText: /Software/ })`
- **Job Card**: `jobTitle.locator('xpath=../../../..')`
- **URL Validation**: `expect(page).toHaveURL(/searchJob=software\+developer/)`

### Job Details Elements:
- **Job Description Heading**: `page.getByRole('heading', { name: 'Deskripsi Pekerjaan' })`
- **Qualifications Heading**: `page.getByRole('heading', { name: 'Kualifikasi' })`
- **Apply Button**: `page.getByRole('button').filter({ hasText: /Lamar/ })`
- **Benefits Section**: `page.getByRole('heading', { level: 3 }).filter({ hasText: 'Benefit Perusahaan' })`

## Key Challenges and Solutions

### Challenge 1: New Tab Handling
When clicking on a job listing, the site opens a new tab instead of navigating the current page.

**Solution:**
```typescript
// Set up listener for the new tab/page that will open
const pagePromise = page.waitForEvent('popup');
  
// Click on the job title to open job details
await jobTitle.click();
  
// Wait for the new page to open and load
const jobDetailsPage = await pagePromise;
await jobDetailsPage.waitForLoadState('networkidle');
```

### Challenge 2: Dynamic Content Loading
Search results may take time to appear, causing flaky tests.

**Solution:**
```typescript
// Wait for search results to load with a longer timeout
const jobListings = page.getByRole('heading', { level: 2 }).filter({ hasText: /Software/ }).first();
await expect(jobListings).toBeVisible({ timeout: 10000 });
```

### Challenge 3: Finding Unique Selectors
Some elements didn't have unique IDs or data attributes.

**Solution:**
Used role-based selectors combined with filtering by text content to create robust selectors:
```typescript
// Using role + text filtering for unique identification
const benefitSection = page.getByRole('heading', { level: 3 }).filter({ hasText: 'Benefit Perusahaan' });
```

## Page Object Model Extraction

Based on the exploration, we identified the following page objects:

1. **HomePage**: Handles homepage navigation and job search
2. **SearchResultsPage**: Handles job listing interaction and verification
3. **JobDetailsPage**: Handles job details verification

Each page object encapsulates the specific UI elements and interactions for its respective page.

## Generated Test Path

The final test path covers this user journey:
1. Navigate to Dealls.com homepage
2. Search for "software developer" jobs
3. Verify search results appear
4. Click on a Software Developer job listing
5. Verify job details appear in new tab
6. Validate presence of job description, qualifications, and benefits

## Conclusion

The exploration with Playwright MCP Server successfully identified the key elements and interactions needed to automate the job search functionality on Dealls.com. The recorded actions provided a solid foundation for building reliable automated tests using the Page Object Model pattern.

---

*This exploration was conducted using Playwright version 1.35.0 and Playwright MCP Server version 1.2.0*

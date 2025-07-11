# Playwright MCP Sample - Dealls.com Job Search Automation

This repository demonstrates automated testing of the job search functionality on [Dealls.com](https://dealls.com/) using Playwright with Model Context Protocol (MCP) and the Page Object Model pattern.

## Project Overview

This project showcases how to:
- Automate browser interactions using Playwright
- Implement the Page Object Model (POM) design pattern for maintainable tests
- Use Model Context Protocol (MCP) for AI-assisted test automation
- Navigate multi-tab scenarios in web testing

## Documentation

This project includes comprehensive documentation:
- [README.md](README.md) - Main project overview (this file)
- [exploration-results.md](exploration-results.md) - Detailed results of website exploration using Playwright MCP
- [page-object-model.md](page-object-model.md) - In-depth explanation of the Page Object Model implementation
- [playwright-mcp-guide.md](playwright-mcp-guide.md) - Guide to using Playwright MCP Server for exploration

## Exploration Journey

The project began with an exploration of Dealls.com using the Playwright MCP Server. Here's a summary of the recorded actions:

1. **Initial Exploration**: 
   - Navigated to https://dealls.com/
   - Analyzed the homepage structure and job search functionality
   - Identified key elements for automation (search box, job listings, job details)

2. **Job Search Flow**:
   - Entered "software developer" in the search box
   - Validated search results page and job listings
   - Selected a job listing and verified details in a new tab
   - Confirmed essential job information sections (description, qualifications, benefits)

3. **Test Development**:
   - Created initial test script based on exploration
   - Iteratively improved selectors and assertions for reliability
   - Added proper handling for new tabs/windows
   - Refactored to implement Page Object Model

## Project Structure

```
├── config/                # Configuration files
├── pages/                 # Page Object Model classes
│   ├── BasePage.ts        # Base page with common functionality
│   ├── HomePage.ts        # Dealls.com homepage interactions
│   ├── SearchResultsPage.ts # Search results page interactions
│   └── JobDetailsPage.ts  # Job details page interactions
├── playwright-report/     # Test reports
├── test-results/          # Test execution artifacts
├── tests/                 # Test files
│   ├── dealls-job-search.spec.ts      # Initial test implementation
│   └── dealls-job-search-pom.spec.ts  # POM implementation
├── utils/                 # Utility functions
├── package.json           # Project dependencies
└── playwright.config.ts   # Playwright configuration
```

## Page Object Model Implementation

The project uses the Page Object Model pattern to improve test maintainability:

### BasePage

Base class providing common functionality for all page objects:
- Navigation to URLs
- Waiting for page load states

### HomePage

Represents the Dealls.com homepage with methods for:
- Navigating to the homepage
- Verifying page elements
- Searching for jobs

### SearchResultsPage

Handles interactions with job search results:
- Verifying search results for keywords
- Finding job listings by title
- Clicking on jobs and handling new tab navigation

### JobDetailsPage

Manages job details page interactions:
- Verifying job details sections
- Validating presence of key information (description, qualifications, benefits)

## Running the Tests

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd PlaywrightMCPSample

# Install dependencies
npm install
```

### Run Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/dealls-job-search-pom.spec.ts

# Run with UI mode
npx playwright test --ui
```

## Viewing Test Reports

After test execution, view the HTML report:

```bash
npx playwright show-report
```

## Key Learnings

- **Role-based Selectors**: Using Playwright's role-based selectors improves test reliability
- **Tab Handling**: Properly managing new tabs/windows with page.waitForEvent('popup')
- **Page Object Model**: Separating UI interactions from test logic improves maintainability
- **Auto-waiting Assertions**: Leveraging Playwright's built-in waiting mechanism for assertions

## Next Steps

- Add more test scenarios (applying for jobs, filtering results)
- Implement parameterized tests for different job categories
- Add visual testing for UI components
- Integrate with CI/CD pipeline

## Summary of Project Files

### Test Files
- `tests/dealls-job-search.spec.ts` - Initial test implementation
- `tests/dealls-job-search-test.spec.ts` - Improved version of the test
- `tests/dealls-job-search-pom.spec.ts` - POM implementation of the test

### Page Object Files
- `pages/BasePage.ts` - Base page object with common functionality
- `pages/HomePage.ts` - Home page interactions
- `pages/SearchResultsPage.ts` - Search results page interactions
- `pages/JobDetailsPage.ts` - Job details page interactions

### Documentation Files
- `README.md` - Main project documentation (this file)
- `exploration-results.md` - Detailed exploration results
- `page-object-model.md` - Page Object Model implementation details
- `playwright-mcp-guide.md` - Guide to using Playwright MCP Server

### CI/CD Files
- `.github/workflows/playwright-tests.yml` - GitHub Actions workflow to run tests

## Created: July 11, 2025

---

*This project was developed as a demonstration of Playwright automation capabilities with MCP.*

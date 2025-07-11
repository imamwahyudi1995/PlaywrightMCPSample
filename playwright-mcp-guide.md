# Using Playwright MCP Server for Website Exploration

## Overview

This guide explains how to use the Playwright Model Context Protocol (MCP) Server for interactive website exploration and test generation, as demonstrated in this project with Dealls.com.

## What is Playwright MCP Server?

Playwright MCP Server combines the power of Playwright's browser automation with AI assistance through the Model Context Protocol. It allows for:

- Interactive exploration of websites with browser control
- Real-time analysis of page structure and elements
- AI-assisted test script generation
- Enhanced debugging capabilities

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm (v6+)
- Playwright installed in your project

### Installation

```bash
# Install Playwright if not already installed
npm init playwright@latest

# Install Playwright MCP dependencies
npm install @playwright/mcp-server
```

### Configuration

Create a configuration file for your MCP session:

```typescript
// mcp-config.ts
import { defineConfig } from '@playwright/mcp-server';

export default defineConfig({
  // Browser to use for exploration
  browser: 'chromium',
  
  // Whether to run headless or not (false for interactive exploration)
  headless: false,
  
  // Where to store snapshots and recordings
  recordingDir: './recordings',
  
  // Additional Playwright browser context options
  contextOptions: {
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: './recordings/videos/' }
  }
});
```

## Starting an Exploration Session

```bash
# Start the MCP Server with your config
npx playwright mcp-server --config=mcp-config.ts
```

## Exploration Workflow

### 1. Initial Navigation

```typescript
// Navigate to the target website
await mcp_playwright_browser_navigate({ url: 'https://dealls.com/' });

// Capture snapshot of the page
const snapshot = await mcp_playwright_browser_snapshot({});
```

### 2. Analyzing Page Structure

Examine the snapshot to understand the page structure:

- Identify important UI elements (buttons, forms, links)
- Look for unique selectors (role, text content, attributes)
- Understand page navigation paths

### 3. Interacting with Elements

```typescript
// Search for a job
const searchBox = snapshot.find('textbox', { name: /Search by job title/ });
await mcp_playwright_browser_type({
  element: 'Search textbox',
  ref: searchBox.ref,
  text: 'software developer',
  submit: true
});

// Wait for results to load
await mcp_playwright_browser_wait_for({ 
  text: 'Software Developer'
});

// Capture updated snapshot
const resultsSnapshot = await mcp_playwright_browser_snapshot({});
```

### 4. Handling Multi-Tab Scenarios

```typescript
// Click on a job listing (which opens in a new tab)
const jobTitle = resultsSnapshot.find('heading', { name: /Software Developer/ });
await mcp_playwright_browser_click({
  element: 'Software Developer job listing',
  ref: jobTitle.ref
});

// List tabs and switch to the new one
const tabs = await mcp_playwright_browser_tab_list({});
await mcp_playwright_browser_tab_select({ index: 1 });

// Capture snapshot of the job details page
const detailsSnapshot = await mcp_playwright_browser_snapshot({});
```

### 5. Generating Tests

After exploration, use the MCP Server to generate a Playwright test:

```typescript
const test = await mcp_playwright_browser_generate_playwright_test({
  name: 'Dealls Job Search',
  description: 'Test the job search functionality on Dealls.com',
  steps: [
    'Navigate to Dealls.com homepage',
    'Search for "software developer" jobs',
    'Verify search results appear',
    'Click on a job listing',
    'Verify job details page loads with correct information'
  ]
});

console.log(test); // Generated Playwright test code
```

## Best Practices

1. **Start with clear objectives**: Define what functionality you want to explore and test.

2. **Take incremental snapshots**: Capture page state after each significant interaction.

3. **Use role-based selectors**: Prefer role-based selectors (getByRole) for better test stability.

4. **Handle async behavior**: Use proper waiting mechanisms for dynamic content.

5. **Record all interactions**: Document each step for later reference when building tests.

6. **Verify assertions**: Test assumptions about the page during exploration.

7. **Explore edge cases**: Try different inputs and interactions to understand how the site behaves.

## Transitioning from Exploration to Tests

After exploring with MCP Server:

1. Review the generated test code
2. Refactor into a proper test structure
3. Implement the Page Object Model
4. Add robust assertions
5. Handle edge cases and error conditions

## Example Exploration Session

Below is a condensed example of an exploration session for Dealls.com:

```typescript
// Start session and navigate
await mcp_playwright_browser_navigate({ url: 'https://dealls.com/' });

// Capture homepage snapshot
const homeSnapshot = await mcp_playwright_browser_snapshot({});
console.log('Page title:', await page.title());

// Search for jobs
const searchBox = homeSnapshot.find('textbox', { name: /Search by job title/ });
await mcp_playwright_browser_type({
  element: 'Search box',
  ref: searchBox.ref,
  text: 'software developer',
  submit: true
});

// Wait and capture results
await mcp_playwright_browser_wait_for({ text: 'Software Developer' });
const resultsSnapshot = await mcp_playwright_browser_snapshot({});

// Click on job
const jobTitle = resultsSnapshot.find('heading', { text: 'Software Developer' });
await mcp_playwright_browser_click({
  element: 'Software Developer job listing',
  ref: jobTitle.ref
});

// Handle new tab
const tabs = await mcp_playwright_browser_tab_list({});
await mcp_playwright_browser_tab_select({ index: 1 });

// Verify job details page
const detailsSnapshot = await mcp_playwright_browser_snapshot({});
const jobDescription = detailsSnapshot.find('heading', { name: 'Deskripsi Pekerjaan' });
console.log('Job description found:', jobDescription !== null);

// Generate test
const test = await mcp_playwright_browser_generate_playwright_test({
  name: 'Dealls Job Search Test',
  description: 'Test job search and details viewing on Dealls.com',
  steps: [
    'Navigate to Dealls.com',
    'Search for software developer jobs',
    'View job details',
    'Verify job information is displayed'
  ]
});
```

## Conclusion

The Playwright MCP Server provides a powerful way to explore websites, understand their structure, and generate robust automated tests. By combining interactive exploration with AI assistance, it significantly speeds up the test development process.

---

*Documentation created: July 11, 2025*

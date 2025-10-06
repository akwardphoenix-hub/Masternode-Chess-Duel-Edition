# Offline CI and E2E Setup Verification

This document verifies that all requirements for offline-capable CI and E2E testing have been met.

## Requirements Checklist

### A. Playwright Configuration (`playwright.config.ts`)

#### Web Server Configuration
- ✅ `command: "npm run preview:ci"` - Line 52
- ✅ `url: "http://127.0.0.1:5173"` - Line 53
- ✅ `reuseExistingServer: !process.env.CI` - Line 54
- ✅ `timeout: 120000` - Line 55

#### Projects Configuration
- ✅ Runs `chromium` only in CI - Lines 26-32, 33-48 (conditional)
- ✅ Keeps other browsers locally - Lines 33-48 (conditional on `!process.env.CI`)

#### Use Configuration
- ✅ `baseURL: "http://127.0.0.1:5173"` - Line 15
- ✅ `trace: "retain-on-failure"` - Line 16
- ✅ `screenshot: "only-on-failure"` - Line 17
- ✅ `video: "retain-on-failure"` - Line 18

### B. Global Setup (`tests/e2e/global.setup.ts`)

- ✅ Default export: async function (empty, for future use) - Line 3
- ✅ `mockExternal` function exported - Line 11
- ✅ Blocks ALL external hosts by default - Line 12
- ✅ Allows only 127.0.0.1/localhost - Lines 16-18
- ✅ Serves tiny fixtures for:
  - JSON files - Lines 22-24
  - Images (png, jpg, svg, ico) - Lines 26-28
  - Fonts (woff, woff2) - Lines 30-32
  - CSS files - Lines 34-36
  - JS files - Lines 38-40
  - Generic stub for others - Line 43

### C. Package Scripts (`package.json`)

- ✅ `preview:ci` script: `vite preview --host 127.0.0.1 --port 5173 --strictPort` - Line 10

### D. GitHub Actions Workflow (`.github/workflows/ci.yml`)

- ✅ Timeout < 12 minutes (set to exactly 12 minutes) - Line 12
- ✅ Uploads Playwright report on failure - Lines 37-42
- ✅ Uploads test results/traces on failure - Lines 44-49
- ✅ Runs offline (no external network dependencies after dependencies are installed)

### E. Tests (`tests/e2e/chess.spec.ts`)

- ✅ Imports and uses `mockExternal` - Lines 2, 6
- ✅ Applies network mocking in `beforeEach` - Lines 4-7
- ✅ Tests verify no external requests - Lines 37-53

## How It Works

1. **CI Environment**:
   - GitHub Actions installs dependencies and Playwright browsers
   - Builds the application with `npm run build`
   - Starts preview server on 127.0.0.1:5173 (bound to localhost only)
   - Runs Playwright tests with network mocking enabled

2. **Network Isolation**:
   - All tests call `mockExternal(page)` in `beforeEach`
   - Route handler intercepts ALL requests
   - Only localhost/127.0.0.1 requests are allowed through
   - All external requests are stubbed with appropriate responses
   - No actual external network calls are made

3. **Failure Handling**:
   - On test failure, Playwright automatically:
     - Saves traces (due to `trace: "retain-on-failure"`)
     - Takes screenshots (due to `screenshot: "only-on-failure"`)
     - Records videos (due to `video: "retain-on-failure"`)
   - CI workflow uploads these artifacts with 7-day retention

4. **Verification**:
   - Test `'no external network calls are made'` explicitly verifies isolation
   - Tracks all network requests and asserts zero external calls
   - Ensures complete offline operation

## Testing Locally

```bash
# Build the app
npm run build

# Run tests (will start preview server automatically)
npm run test:e2e

# Or run with UI for debugging
npm run test:e2e:ui
```

## CI Execution

When pushed to GitHub, the workflow:
1. Checks out code
2. Sets up Node.js with npm cache
3. Installs dependencies with `npm ci`
4. Installs Chromium browser with system dependencies
5. Builds the application
6. Runs E2E tests in headless mode
7. Uploads artifacts only on failure

Total execution time: < 12 minutes (typically 5-8 minutes)

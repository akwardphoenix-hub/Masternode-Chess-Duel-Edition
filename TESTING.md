# Testing Guide

## Overview

This project uses Playwright for end-to-end (E2E) testing. The test setup is specifically configured to work within GitHub Actions firewall restrictions.

## Firewall and Network Access

### How It Works

GitHub Actions environments have firewall restrictions that block most external network calls during test execution. This project handles this by:

1. **Pre-installation Phase** (`.github/copilot-setup-steps.yml`):
   - All dependencies are installed BEFORE the firewall is enabled
   - Node.js packages are installed via `npm ci`
   - Playwright browsers are pre-installed with `npx playwright install --with-deps`
   - System packages (if needed) are installed via `apt`

2. **Test Execution Phase** (after firewall):
   - Tests run against a local Vite preview server
   - The preview server serves pre-built static files from `dist/`
   - No external network calls are required
   - All assets are bundled locally

### Why This Matters

Without proper setup, these operations would fail due to firewall blocks:
- ❌ `esm.ubuntu.com` - Ubuntu package repository
- ❌ `api.github.com` - GitHub API calls
- ❌ `registry.npmjs.org` - NPM package fetching
- ❌ Vite dev server with external dependencies
- ❌ Playwright browser downloads

With proper setup:
- ✅ All dependencies pre-installed
- ✅ Tests run against local preview server
- ✅ No external network calls needed
- ✅ All assets served from local `dist/` folder

## Running Tests Locally

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Build the Application

```bash
npm run build
```

This creates the production build in the `dist/` directory.

### Run E2E Tests

```bash
# Run tests with UI
npm run test:e2e

# Run tests in headless mode (CI style)
npm run test:ci
```

The tests will:
1. Build the application (`npm run build`)
2. Start a local preview server on `http://localhost:4173`
3. Run Playwright tests against the preview server
4. Shut down the server after tests complete

### Development Mode

For development with hot reload:

```bash
npm run dev
```

This starts the Vite dev server on `http://localhost:5173`.

## Test Structure

### Test Files

- `tests/game.spec.ts` - Main game functionality tests

### Playwright Configuration

The `playwright.config.ts` is configured to:
- Use `http://localhost:4173` as the base URL (preview server)
- Start the preview server automatically via `webServer` option
- Run in headless mode in CI environments
- Use only Chromium browser to minimize resource usage

## CI/CD Integration

### GitHub Actions Workflow (`.github/workflows/test.yml`)

The workflow follows this order:

1. **Checkout repository**
2. **Setup Node.js** with caching
3. **Install dependencies** (`npm ci`)
4. **Install Playwright browsers** (before firewall)
5. **Build application** (`npm run build`)
6. **Run E2E tests** (`npm run test:ci`)
7. **Upload test results** (on failure)

### Setup Steps (`.github/copilot-setup-steps.yml`)

This file defines all operations that must happen before the firewall is enabled:
- Node.js setup
- NPM dependency installation
- Playwright browser installation
- Any system package installation

## Troubleshooting

### Tests Fail with Network Errors

If you see errors like:
- `ECONNREFUSED`
- `Could not connect to api.github.com`
- `Unable to reach esm.ubuntu.com`

**Solution**: Ensure the failing operation is in `.github/copilot-setup-steps.yml` to run before the firewall is enabled.

### Preview Server Won't Start

If the preview server fails to start:

```bash
# Check if port 4173 is already in use
lsof -i :4173

# Kill the process if needed
kill -9 <PID>

# Try running preview manually
npm run preview
```

### Tests Can't Find Elements

If tests fail to find page elements:

```bash
# Run tests with UI to see what's happening
npx playwright test --ui

# Or run in headed mode with slow motion
npx playwright test --headed --slow-mo=1000
```

### Build Fails

Ensure you have the correct Node.js version:

```bash
node --version  # Should be v20 or higher
```

## Best Practices

1. **Always build before testing**: E2E tests run against the production build
2. **Pre-install everything**: Add all external dependencies to `copilot-setup-steps.yml`
3. **Use local assets**: Never fetch external resources during test execution
4. **Test locally first**: Run `npm run test:e2e` before pushing to verify everything works
5. **Keep tests fast**: Use single browser (Chromium) and minimal retries

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

# Masternode-Chess-Duel-Edition
Literally empirically the coolest most bamboozelest Chess game ever created besides actual Chess. This concept was ripped and stolen from chess cascadingly through all of the years of video games and board games. All the games all your games are belong to us.

## Offline-Capable CI and E2E Testing

This project is configured to run completely offline in CI environments with network firewalls and DNS blocks.

### Features

- **Fully Offline CI**: All tests run without external network access
- **Headless E2E Tests**: Playwright tests run against local preview server (127.0.0.1:5173)
- **Network Mocking**: All external requests are blocked/stubbed automatically
- **Fast Execution**: Complete runs in under 12 minutes
- **Failure Artifacts**: Playwright reports and traces uploaded on test failures

### Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run E2E tests
npm test

# Run E2E tests with UI
npm run test:e2e:ui
```

### Project Structure

```
.
├── src/                   # Source code
│   ├── main.ts           # Main entry point
│   └── style.css         # Styles
├── tests/e2e/            # E2E tests
│   ├── global.setup.ts   # Network mocking setup
│   └── chess.spec.ts     # Test suite
├── .github/workflows/    # CI configuration
│   └── ci.yml           # GitHub Actions workflow
├── playwright.config.ts  # Playwright configuration
├── vite.config.ts       # Vite configuration
└── index.html           # HTML entry point
```

### Configuration Details

#### Playwright Configuration
- **Web Server**: Bound to `127.0.0.1:5173` only
- **Base URL**: `http://127.0.0.1:5173`
- **Browser**: Chromium only in CI (all browsers locally)
- **Retries**: 2 in CI, 0 locally
- **Artifacts**: Traces, screenshots, and videos on failure

#### Network Mocking
The `mockExternal` function in `tests/e2e/global.setup.ts` blocks all external requests:
- Allows only `localhost` and `127.0.0.1`
- Stubs common file types (JSON, images, fonts, CSS, JS)
- Ensures completely offline operation

### CI Workflow
- Runs on push to `main` and `chore/ci-offline-green` branches
- 12-minute timeout
- Installs only Chromium browser
- Uploads Playwright reports and test results on failure

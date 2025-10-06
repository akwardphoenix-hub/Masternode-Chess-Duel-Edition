# Masternode-Chess-Duel-Edition
Literally empirically the coolest most bamboozelest Chess game ever created besides actual Chess. This concept was ripped and stolen from chess cascadingly through all of the years of video games and board games. All the games all your games are belong to us.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run E2E tests
npm run test:e2e
```

## Project Structure

This is a modern web application built with:
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **Playwright** - E2E testing framework

## Testing

See [TESTING.md](TESTING.md) for detailed testing documentation, including:
- How to run tests locally
- CI/CD configuration
- Firewall and network access handling
- Troubleshooting guide

## GitHub Actions

The project includes a CI/CD workflow (`.github/workflows/test.yml`) that:
1. Installs all dependencies before firewall restrictions
2. Builds the application
3. Runs E2E tests against a local preview server
4. Works without requiring external network access during test execution

All dependencies are pre-installed in `.github/copilot-setup-steps.yml` before the firewall is enabled.

# Copilot Instructions

## Network Access and Firewall Configuration

This repository is configured to work within GitHub Actions firewall restrictions. All dependencies and external resources must be installed during the pre-setup phase.

### Custom Allowlist

If certain URLs must be accessible during test execution, add them to the allowlist below:

#### Allowed Domains
- `esm.ubuntu.com` - Ubuntu package repository (for apt package installation)
- `api.github.com/repos/*/runtime/*` - GitHub API for runtime resources
- `registry.npmjs.org` - NPM package registry (for dependency installation)
- `playwright.azureedge.net` - Playwright browser binaries

### Important Notes

1. **Pre-installation Phase**: All `apt`, `npm`, and browser installations happen in `.github/copilot-setup-steps.yml` BEFORE the firewall is enabled.

2. **Test Execution**: E2E tests run against a local Vite preview server (`vite preview`) that serves the pre-built `dist/` folder. No external network calls are made during test execution.

3. **Local Assets Only**: The application and tests use only locally bundled assets. No CDN or external resource fetching occurs at runtime.

4. **CI Mode**: The `test:ci` script runs Playwright in headless mode without needing external network access.

### Troubleshooting

If you encounter network-related errors:
1. Ensure the failing operation is moved to `copilot-setup-steps.yml`
2. Add any required domains to the allowlist above
3. Verify that `vite preview` uses only local files from `dist/`
4. Check that Playwright browsers are pre-installed

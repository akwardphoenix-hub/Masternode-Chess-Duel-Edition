# Masternode-Chess-Duel-Edition
Literally empirically the coolest most bamboozelest Chess game ever created besides actual Chess. This concept was ripped and stolen from chess cascadingly through all of the years of video games and board games. All the games all your games are belong to us.

## GitHub Actions CI/CD

This repository includes a GitHub Actions workflow configured to handle firewall restrictions that may occur during CI/CD execution.

### Firewall Fixes Implemented

1. **APT Source Replacement**: The workflow automatically replaces `esm.ubuntu.com` apt sources with `azure.archive.ubuntu.com` before running `apt-get update` to avoid DNS/HTTP block errors.

2. **Pre-installed Dependencies**: Node.js 20 and Python 3.10 are installed early in the workflow using official GitHub Actions (`actions/setup-node@v4` and `actions/setup-python@v5`) before any firewall rules are applied.

3. **Domain Allowlist**: A `.github/copilot-allowlist.json` file has been created to allowlist essential domains:
   - `api.github.com` - GitHub API access
   - `esm.ubuntu.com` - Ubuntu ESM repository
   - `azure.archive.ubuntu.com` - Azure Ubuntu mirror
   - Wildcards for `*.ubuntu.com` and `*.github.com`

### CI Workflow

The workflow (`.github/workflows/ci.yml`) runs on:
- Push to `main` branch
- Pull requests to `main` branch

It includes steps for:
- Source code checkout
- APT source replacement
- Node.js and Python setup
- Dependency installation
- Build execution
- Test execution
- E2E test execution

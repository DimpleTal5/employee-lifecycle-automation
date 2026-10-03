# Framework Architecture

## Design

The framework follows Page Object Model (POM) with reusable fixtures.

```text
tests
  -> fixtures
      -> page objects
          -> OrangeHRM UI
  -> utils
      -> test data
      -> API helper
```

## Responsibilities

- `pages/` contains UI interaction and locator logic.
- `tests/` contains business-level test scenarios and assertions.
- `fixtures/` provides reusable page objects.
- `utils/` contains test-data and API helpers.
- `config/` contains environment configuration.
- `.github/workflows/` contains CI/CD configuration.

## Test data

Employee names use a timestamp suffix so repeated runs do not intentionally reuse the same last name.

## Configuration

Credentials are loaded from `.env` locally and GitHub Actions secrets in CI.

`.env` is excluded from Git.

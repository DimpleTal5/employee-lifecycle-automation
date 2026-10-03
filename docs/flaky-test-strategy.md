# Flaky Test Detection and Mitigation

## Detection

A test is treated as potentially flaky when it:

- passes on retry after failing initially;
- fails intermittently without a product change;
- fails around asynchronous UI transitions or network-dependent states.

CI uses Playwright retries so transient failures are visible without immediately failing the whole pipeline.

## Mitigation

1. Prefer role/text locators over brittle CSS where accessible names exist.
2. Use Playwright's auto-waiting and explicit state assertions.
3. Avoid arbitrary `waitForTimeout()` calls.
4. Generate screenshots, videos and traces on failure.
5. Use unique test data to reduce collisions.
6. Keep UI and API validation separated so failures are easier to diagnose.
7. Investigate repeated retries instead of masking persistent defects with high retry counts.

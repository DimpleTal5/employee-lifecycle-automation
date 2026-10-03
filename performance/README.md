# Performance Testing

The candidate CV lists JMeter, so the performance section uses JMeter rather than K6.

The assignment describes K6 as a bonus requirement. K6 is intentionally not introduced into this project because the candidate's stated toolset uses JMeter.

## JMeter baseline

- Target: OrangeHRM API
- Scenario: authenticated employee GET
- Virtual users: 5
- Ramp-up: 10 seconds
- Iterations: 10 per virtual user
- Total requests per run: 50
- Initial response-time threshold: define based on the environment rather than claiming a production SLA.

## Authentication

OrangeHRM Starter API v2 uses OAuth2 bearer-token authentication. The public documentation states that an access token is required for API calls.

For the assessment, do not commit a real access token. Pass it to JMeter as a runtime property/environment variable.

Example:

```text
jmeter -n -t performance/orangehrm-api-baseline.jmx \
  -JbaseUrl=https://opensource-demo.orangehrmlive.com/web/index.php \
  -JaccessToken=<token> \
  -JempNumber=<employee-number> \
  -l results.jtl \
  -e -o performance-report
```

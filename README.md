# OrangeHRM Employee Lifecycle Automation

Senior QA Automation Engineer technical assessment project implementing a maintainable UI and API automation framework using Playwright and JavaScript.

The framework automates an employee lifecycle on the OrangeHRM demo application and demonstrates:

- Page Object Model
- UI and API test automation
- Role-based access validation
- Reusable API utilities
- Test fixtures and automatic cleanup
- Unique test data generation
- Environment-based configuration
- Test tagging and step-level reporting
- Retry and failure evidence
- GitHub Actions CI/CD
- HTML reports, screenshots, videos and traces
- JMeter performance baseline

---

## Application Under Test

OrangeHRM Open Source Demo:

https://opensource-demo.orangehrmlive.com/

The automation covers:

1. Authentication
2. Employee creation
3. Employee search
4. Employee update
5. Role-based access validation
6. API-level employee verification
7. Employee deletion
8. Negative API validation
9. Automatic test-data cleanup

---

## Technology Stack

- Playwright
- JavaScript
- Node.js
- REST API testing
- Page Object Model
- Git & GitHub
- GitHub Actions
- JMeter
- dotenv
- HTML reporting

---

## Framework Architecture

The project separates test scenarios, page interactions, reusable utilities, fixtures, configuration and test data.

```text
employee-lifecycle-automation/
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── config/
│   └── environments.js
│
├── docs/
│   ├── architecture.md
│   └── flaky-test-strategy.md
│
├── fixtures/
│   └── test-fixtures.js
│
├── pages/
│   ├── DashboardPage.js
│   ├── EmployeePage.js
│   └── LoginPage.js
│
├── performance/
│   ├── README.md
│   └── orangehrm-api-baseline.jmx
│
├── tests/
│   ├── api/
│   │   └── employee-api.spec.js
│   │
│   └── ui/
│       ├── authentication.spec.js
│       ├── employee-lifecycle.spec.js
│       └── role-validation.spec.js
│
├── utils/
│   ├── apiHelper.js
│   └── testData.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.js
└── README.md
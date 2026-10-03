# OrangeHRM Employee Lifecycle Automation

Senior QA Automation Engineer technical assessment project implementing a scalable UI and API automation framework using Playwright and JavaScript.

The project automates an end-to-end employee lifecycle on the OrangeHRM demo application, with a focus on maintainability, reusable components, API validation, test stability, CI/CD execution, reporting, and performance testing.

---

## Application Under Test

OrangeHRM Open Source Demo:

https://opensource-demo.orangehrmlive.com

The framework covers the following employee lifecycle:

- Authentication
- Employee creation
- Employee search and validation
- Role-based access validation
- Employee update
- API-level verification
- Employee deletion
- Post-deletion verification

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

The framework follows a layered structure that separates test scenarios, page interactions, reusable utilities, configuration, and test data.

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
├── playwright.config.js
└── README.md
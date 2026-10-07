const base = require('@playwright/test');

const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { EmployeePage } = require('../pages/EmployeePage');
const { ApiHelper } = require('../utils/apiHelper');

const test = base.test.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  employeePage: async ({ page }, use) => {
    await use(new EmployeePage(page));
  },

  employeeCleanup: async ({ page }, use) => {
    const employeeIds = [];

    await use({
      register: (employeeId) => {
        if (employeeId && !employeeIds.includes(employeeId)) {
          employeeIds.push(employeeId);
        }
      },
    });

    if (employeeIds.length === 0) {
      return;
    }

    const api = new ApiHelper(page.context().request);

    for (const employeeId of employeeIds) {
      try {
        const response = await api.delete(
          `${api.basePath}/pim/employees`,
          {
            data: {
              ids: [employeeId],
            },
          }
        );

        if (!response.ok()) {
          console.warn(
            `Employee cleanup returned HTTP ${response.status()} for ${employeeId}`
          );
        }
      } catch (error) {
        console.warn(
          `Employee cleanup failed for ${employeeId}: ${error.message}`
        );
      }
    }
  },

  essUserCleanup: async ({ page }, use) => {
    const userIds = [];

    await use({
      register: (userId) => {
        if (userId && !userIds.includes(userId)) {
          userIds.push(userId);
        }
      },
    });

    if (userIds.length === 0) {
      return;
    }

    const api = new ApiHelper(page.context().request);

    try {
      await api.deleteUsers(userIds);
    } catch (error) {
      console.warn(
        `ESS user cleanup failed: ${error.message}`
      );
    }
  },
});

module.exports = {
  test,
  expect: base.expect,
};
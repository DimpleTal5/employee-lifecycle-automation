const { test, expect } = require('../../fixtures/test-fixtures');

test.describe('Role Based Validation', () => {
  test('@regression Admin role can access Admin and PIM modules', async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.loginAs(
      process.env.ORANGEHRM_USERNAME,
      process.env.ORANGEHRM_PASSWORD
    );

    await expect(dashboardPage.dashboardHeading).toBeVisible();

    // Admin role should have access to both administrative and
    // employee-management modules.
    await expect(dashboardPage.adminMenu).toBeVisible();
    await expect(dashboardPage.pimMenu).toBeVisible();
  });
});

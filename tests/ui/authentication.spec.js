const { test, expect } = require('../../fixtures/test-fixtures');

test.describe('Authentication', () => {
  test('@smoke Admin user can log in successfully', async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.loginAs(
      process.env.ORANGEHRM_USERNAME,
      process.env.ORANGEHRM_PASSWORD
    );

    await expect(dashboardPage.page).toHaveURL(
      /\/web\/index\.php\/dashboard\/index/
    );
  });
});
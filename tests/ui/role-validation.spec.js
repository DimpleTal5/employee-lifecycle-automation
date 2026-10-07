const { test, expect } = require('../../fixtures/test-fixtures');
const { createEmployeeData } = require('../../utils/testData');
const { ApiHelper } = require('../../utils/apiHelper');
const { LoginPage } = require('../../pages/LoginPage');

test.describe('Role Based Validation', () => {
  test('@regression Admin role can access Admin and PIM modules', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    await loginPage.loginAs(
      process.env.ORANGEHRM_USERNAME,
      process.env.ORANGEHRM_PASSWORD
    );

    await expect(dashboardPage.dashboardHeading).toBeVisible();

    await expect(dashboardPage.adminMenu).toBeVisible();
    await expect(dashboardPage.pimMenu).toBeVisible();

    await dashboardPage.openPIM();

    await expect(
      page.getByRole('heading', { name: 'Employee Information' })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Search' })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Reset' })
    ).toBeVisible();
  });

  test('@regression ESS user can access allowed modules and is restricted from privileged modules', 
      { timeout: 90000 },
    async ({
    loginPage,
    dashboardPage,
    employeePage,
    employeeCleanup,
    essUserCleanup,
    page,
    browser,
  }) => {
    const employee = createEmployeeData();

    const essUsername = `ess_${Date.now().toString().slice(-8)}`;
    const essPassword = 'Dimple@12345';

    // Login as Admin
    await loginPage.loginAs(
      process.env.ORANGEHRM_USERNAME,
      process.env.ORANGEHRM_PASSWORD
    );

    await expect(dashboardPage.dashboardHeading).toBeVisible();

    // Create employee
    await dashboardPage.openPIM();
    await employeePage.openAddEmployee();

    await employeePage.createEmployee(employee);

    await expect(employeePage.successMessage).toBeVisible({
  timeout: 15000,
    });

    // Find the created employee through API
    const api = new ApiHelper(page.context().request);

    const createdEmployee = await api.findEmployeeByLastName(
      employee.lastName
    );

    expect(createdEmployee.firstName).toBe(employee.firstName);
    expect(createdEmployee.lastName).toBe(employee.lastName);

    employeeCleanup.register(createdEmployee.empNumber);

    // Create ESS user linked to the employee
    const essUserId = await api.createEssUser({
      username: essUsername,
      password: essPassword,
      empNumber: createdEmployee.empNumber,
    });

    expect(essUserId).toBeTruthy();

    essUserCleanup.register(essUserId);

    // Create a separate browser context for the ESS session.
    // This keeps the Admin session available for test-data cleanup.
    const essContext = await browser.newContext({
      baseURL: process.env.BASE_URL,
    });

    const essPage = await essContext.newPage();

    try {
      const essLoginPage = new LoginPage(essPage);

      // Login as ESS user
      await essLoginPage.loginAs(
        essUsername,
        essPassword
      );

      // Verify ESS can access allowed modules
      const sideMenu = essPage.locator('.oxd-main-menu-item');

      const menuItem = (name) =>
        sideMenu.filter({
          hasText: new RegExp(`^\\s*${name}\\s*$`),
        });

      await expect(menuItem('My Info')).toHaveCount(1);
      await expect(menuItem('Leave')).toHaveCount(1);

      // Verify ESS cannot access privileged modules
      await expect(menuItem('Admin')).toHaveCount(0);
      await expect(menuItem('PIM')).toHaveCount(0);
      await expect(menuItem('Recruitment')).toHaveCount(0);
      await expect(menuItem('Maintenance')).toHaveCount(0);

      // Verify the same restriction through the API
      const essApiResponse = await essContext.request.get(
        '/web/index.php/api/v2/admin/users'
      );

      expect(essApiResponse.ok()).toBeFalsy();
    } finally {
      await essContext.close();
    }
  });
});
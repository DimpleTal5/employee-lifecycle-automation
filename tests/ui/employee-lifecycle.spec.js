const { test, expect } = require('../../fixtures/test-fixtures');
const { createEmployeeData } = require('../../utils/testData');
const { ApiHelper } = require('../../utils/apiHelper');

test.describe('Employee Lifecycle', () => {
  test('@regression Admin can complete the employee lifecycle', async ({
    loginPage,
    dashboardPage,
    employeePage,
    page,
  }) => {
    const employee = createEmployeeData();

    await loginPage.loginAs(
      process.env.ORANGEHRM_USERNAME,
      process.env.ORANGEHRM_PASSWORD
    );

    await expect(dashboardPage.dashboardHeading).toBeVisible();
    await dashboardPage.openPIM();

    // CREATE - UI
    await employeePage.openAddEmployee();

    const employeeId = await employeePage.createEmployee(employee);

    await expect(employeePage.successMessage).toBeVisible();

    // READ - UI
    await employeePage.openEmployeeList();
    await employeePage.searchEmployeeById(employeeId);

    await expect(
      employeePage.getEmployeeRow(employee.lastName)
    ).toBeVisible();

    // API client using the authenticated browser context
    const api = new ApiHelper(page.context().request);

    // Find the employee created through the UI
    const createdEmployee = await api.findEmployeeByLastName(
      employee.lastName
    );

    expect(createdEmployee.firstName).toBe(employee.firstName);
    expect(createdEmployee.lastName).toBe(employee.lastName);
    expect(createdEmployee.employeeId).toBeTruthy();

    // UPDATE - UI
    await employeePage.openEmployeeForEdit(employee.lastName);
await employeePage.updateLastName(employee.updatedLastName);


    // READ AFTER UPDATE - UI
    await employeePage.openEmployeeList();
    await employeePage.searchEmployeeById(employeeId);

    await expect(
      employeePage.getEmployeeRow(employee.updatedLastName)
    ).toBeVisible();

    // API VERIFICATION
    const updatedEmployee = await api.findEmployeeByLastName(
      employee.updatedLastName
    );

    expect(updatedEmployee).toHaveProperty('empNumber');
    expect(updatedEmployee.firstName).toBe(employee.firstName);
    expect(updatedEmployee.lastName).toBe(employee.updatedLastName);
    expect(updatedEmployee.employeeId).toBe(employeeId);

    const getResponse = await api.get(
      `${api.basePath}/pim/employees/${updatedEmployee.empNumber}`
    );

    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();

    expect(getBody.data.empNumber).toBe(updatedEmployee.empNumber);
    expect(getBody.data.firstName).toBe(employee.firstName);
    expect(getBody.data.lastName).toBe(employee.updatedLastName);

    // DELETE - API
    const deleteResponse = await api.delete(
      `${api.basePath}/pim/employees`,
      {
        data: {
          ids: [updatedEmployee.empNumber],
        },
      }
    );

    expect(deleteResponse.status()).toBe(200);

// VERIFY DELETE
const verifyDeleteResponse = await api.get(
  `${api.basePath}/pim/employees/${updatedEmployee.empNumber}`
);

expect(verifyDeleteResponse.status()).toBe(422);

  });
});

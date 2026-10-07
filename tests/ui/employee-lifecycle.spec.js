const { test, expect } = require('../../fixtures/test-fixtures');
const { createEmployeeData } = require('../../utils/testData');
const { ApiHelper } = require('../../utils/apiHelper');

test.describe('Employee Lifecycle', () => {
  test(
    'Admin can create an employee',
    { tag: '@regression' },
    async ({
      loginPage,
      dashboardPage,
      employeePage,
      employeeCleanup,
      page,
    }) => {
      const employee = createEmployeeData();

      await test.step('Login as Admin', async () => {
        await loginPage.loginAs(
          process.env.ORANGEHRM_USERNAME,
          process.env.ORANGEHRM_PASSWORD
        );

        await expect(dashboardPage.dashboardHeading).toBeVisible();
      });

      await test.step('Open PIM and create employee', async () => {
        await dashboardPage.openPIM();
        await employeePage.openAddEmployee();

        await employeePage.createEmployee(employee);

        await expect(employeePage.successMessage).toBeVisible();
      });

      await test.step('Verify created employee through API', async () => {
        const api = new ApiHelper(page.context().request);

        const createdEmployee = await api.findEmployeeByLastName(
          employee.lastName
        );

        expect(createdEmployee.firstName).toBe(employee.firstName);
        expect(createdEmployee.lastName).toBe(employee.lastName);
        expect(createdEmployee.employeeId).toBe(employee.employeeId);

        employeeCleanup.register(createdEmployee.empNumber);
      });
    }
  );

  test(
    'Admin can search and update an employee',
    { tag: '@regression' },
    async ({
      loginPage,
      dashboardPage,
      employeePage,
      employeeCleanup,
      page,
    }) => {
      const employee = createEmployeeData();

      await test.step('Login as Admin', async () => {
        await loginPage.loginAs(
          process.env.ORANGEHRM_USERNAME,
          process.env.ORANGEHRM_PASSWORD
        );

        await expect(dashboardPage.dashboardHeading).toBeVisible();
      });

      await test.step('Create employee for this test', async () => {
        await dashboardPage.openPIM();
        await employeePage.openAddEmployee();

        await employeePage.createEmployee(employee);

        await expect(employeePage.successMessage).toBeVisible();
      });

      const api = new ApiHelper(page.context().request);

      const createdEmployee = await test.step(
        'Verify created employee through API',
        async () => {
          const result = await api.findEmployeeByLastName(
            employee.lastName
          );

          expect(result.firstName).toBe(employee.firstName);
          expect(result.lastName).toBe(employee.lastName);

          employeeCleanup.register(result.empNumber);

          return result;
        }
      );

      await test.step('Search for the employee', async () => {
        await employeePage.openEmployeeList();
        await employeePage.searchEmployeeById(employee.employeeId);

        await expect(
          employeePage.getEmployeeRow(employee.lastName)
        ).toBeVisible();
      });

      await test.step('Update employee last name', async () => {
        await employeePage.openEmployeeForEdit(employee.lastName);

        await employeePage.updateLastName(employee.updatedLastName);
      });

      await test.step('Verify updated employee in UI', async () => {
        await employeePage.openEmployeeList();
        await employeePage.searchEmployeeById(employee.employeeId);

        await expect(
          employeePage.getEmployeeRow(employee.updatedLastName)
        ).toBeVisible();
      });

      await test.step('Verify updated employee through API', async () => {
        const updatedEmployee = await api.findEmployeeByLastName(
          employee.updatedLastName
        );

        expect(updatedEmployee.firstName).toBe(employee.firstName);
        expect(updatedEmployee.lastName).toBe(employee.updatedLastName);
        expect(updatedEmployee.employeeId).toBe(employee.employeeId);
      });

      void createdEmployee;
    }
  );

  test(
    'Admin can verify an employee through API',
    { tag: '@api' },
    async ({
      loginPage,
      dashboardPage,
      employeePage,
      employeeCleanup,
      page,
    }) => {
      const employee = createEmployeeData();

      await test.step('Login as Admin', async () => {
        await loginPage.loginAs(
          process.env.ORANGEHRM_USERNAME,
          process.env.ORANGEHRM_PASSWORD
        );

        await expect(dashboardPage.dashboardHeading).toBeVisible();
      });

      await test.step('Create employee through UI', async () => {
        await dashboardPage.openPIM();
        await employeePage.openAddEmployee();

        await employeePage.createEmployee(employee);

        await expect(employeePage.successMessage).toBeVisible();
      });

      const api = new ApiHelper(page.context().request);

      const createdEmployee = await test.step(
        'Find created employee through API',
        async () => {
          const result = await api.findEmployeeByLastName(
            employee.lastName
          );

          expect(result.firstName).toBe(employee.firstName);
          expect(result.lastName).toBe(employee.lastName);
          expect(result.employeeId).toBe(employee.employeeId);

          employeeCleanup.register(result.empNumber);

          return result;
        }
      );

      await test.step('Verify employee using employee endpoint', async () => {
        const getResponse = await api.get(
          `${api.basePath}/pim/employees/${createdEmployee.empNumber}`
        );

        expect(getResponse.status()).toBe(200);

        const getBody = await getResponse.json();

        expect(getBody.data.empNumber).toBe(createdEmployee.empNumber);
        expect(getBody.data.firstName).toBe(employee.firstName);
        expect(getBody.data.lastName).toBe(employee.lastName);
        expect(getBody.data.employeeId).toBe(employee.employeeId);
      });
    }
  );

  test(
    'Admin can delete an employee through API',
    { tag: '@regression' },
    async ({
      loginPage,
      dashboardPage,
      employeePage,
      employeeCleanup,
      page,
    }) => {
      const employee = createEmployeeData();

      await test.step('Login as Admin', async () => {
        await loginPage.loginAs(
          process.env.ORANGEHRM_USERNAME,
          process.env.ORANGEHRM_PASSWORD
        );

        await expect(dashboardPage.dashboardHeading).toBeVisible();
      });

      await test.step('Create employee', async () => {
        await dashboardPage.openPIM();
        await employeePage.openAddEmployee();

        await employeePage.createEmployee(employee);

        await expect(employeePage.successMessage).toBeVisible();
      });

      const api = new ApiHelper(page.context().request);

      const createdEmployee = await test.step(
        'Find created employee through API',
        async () => {
          const result = await api.findEmployeeByLastName(
            employee.lastName
          );

          expect(result.firstName).toBe(employee.firstName);
          expect(result.lastName).toBe(employee.lastName);

          return result;
        }
      );

      await test.step('Delete employee through API', async () => {
        const deleteResponse = await api.delete(
          `${api.basePath}/pim/employees`,
          {
            data: {
              ids: [createdEmployee.empNumber],
            },
          }
        );

        expect(deleteResponse.status()).toBe(200);
      });

      await test.step('Verify employee is deleted', async () => {
        const verifyDeleteResponse = await api.get(
          `${api.basePath}/pim/employees/${createdEmployee.empNumber}`
        );

        expect(verifyDeleteResponse.status()).toBe(422);
      });

      // This test deletes the employee itself.
      void employeeCleanup;
    }
  );
});
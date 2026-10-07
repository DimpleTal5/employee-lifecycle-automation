const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../../utils/apiHelper');

test.describe('Employee API Verification', () => {
  test(
    'authenticated session can retrieve an employee',
    { tag: '@api' },
    async ({ page }) => {
      await test.step('Login as Admin', async () => {
        await page.goto('/web/index.php/auth/login');

        await page
          .getByRole('textbox', { name: 'Username' })
          .fill(process.env.ORANGEHRM_USERNAME);

        await page
          .getByRole('textbox', { name: 'Password' })
          .fill(process.env.ORANGEHRM_PASSWORD);

        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page).toHaveURL(
          /\/web\/index\.php\/dashboard\/index/
        );
      });

      const api = new ApiHelper(page.context().request);

      const listResponse = await test.step(
        'Retrieve employee list through API',
        async () => {
          const response = await api.get(
            `${api.basePath}/pim/employees?limit=1&offset=0`
          );

          expect(response.status()).toBe(200);

          return response;
        }
      );

      const listBody = await listResponse.json();

      expect(Array.isArray(listBody.data)).toBeTruthy();

      test.skip(
        listBody.data.length === 0,
        'No employee record is available in the environment.'
      );

      const employee = listBody.data[0];

      await test.step('Validate employee list response', async () => {
        expect(employee).toHaveProperty('empNumber');
        expect(employee).toHaveProperty('firstName');
        expect(employee).toHaveProperty('lastName');
      });

      const detailResponse = await test.step(
        'Retrieve employee details through API',
        async () => {
          const response = await api.get(
            `${api.basePath}/pim/employees/${employee.empNumber}`
          );

          expect(response.status()).toBe(200);

          return response;
        }
      );

      const detailBody = await detailResponse.json();

      await test.step(
        'Verify employee detail response',
        async () => {
          expect(detailBody.data.empNumber).toBe(employee.empNumber);
        }
      );
    }
  );

  test(
    'API returns an error for a non-existent employee',
    { tag: '@api' },
    async ({ page }) => {
      await test.step('Login as Admin', async () => {
        await page.goto('/web/index.php/auth/login');

        await page
          .getByRole('textbox', { name: 'Username' })
          .fill(process.env.ORANGEHRM_USERNAME);

        await page
          .getByRole('textbox', { name: 'Password' })
          .fill(process.env.ORANGEHRM_PASSWORD);

        await page
          .getByRole('button', { name: 'Login' })
          .click();

        await expect(page).toHaveURL(
          /\/web\/index\.php\/dashboard\/index/
        );
      });

      const api = new ApiHelper(page.context().request);

      await test.step(
        'Request a non-existent employee',
        async () => {
          const response = await api.get(
            `${api.basePath}/pim/employees/999999999`
          );

          expect(response.status()).toBe(422);
        }
      );
    }
  );
});
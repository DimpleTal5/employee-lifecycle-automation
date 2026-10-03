const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../../utils/apiHelper');

test.describe('Employee API Verification', () => {
  test('@api authenticated session can retrieve an employee', async ({
    page,
  }) => {
    await page.goto('/web/index.php/auth/login');

    await page.getByRole('textbox', { name: 'Username' }).fill(
      process.env.ORANGEHRM_USERNAME
    );

    await page.getByRole('textbox', { name: 'Password' }).fill(
      process.env.ORANGEHRM_PASSWORD
    );

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();

    const api = new ApiHelper(page.context().request);

    const listResponse = await api.get(
      `${api.basePath}/pim/employees?limit=1&offset=0`
    );

    expect(listResponse.status()).toBe(200);

    const listBody = await listResponse.json();

    expect(Array.isArray(listBody.data)).toBeTruthy();

    test.skip(
      listBody.data.length === 0,
      'No employee record is available in the environment.'
    );

    const employee = listBody.data[0];

    expect(employee).toHaveProperty('empNumber');
    expect(employee).toHaveProperty('firstName');
    expect(employee).toHaveProperty('lastName');

    const detailResponse = await api.get(
      `${api.basePath}/pim/employees/${employee.empNumber}`
    );

    expect(detailResponse.status()).toBe(200);

    const detailBody = await detailResponse.json();

    expect(detailBody.data.empNumber).toBe(employee.empNumber);
  });
});

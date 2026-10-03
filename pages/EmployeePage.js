const { expect } = require('@playwright/test');

class EmployeePage {
  constructor(page) {
    this.page = page;

    this.addEmployeeButton = page.getByRole('link', { name: 'Add Employee' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.middleNameInput = page.getByRole('textbox', { name: 'Middle Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });

    this.employeeIdInput = page.locator('input.oxd-input').nth(4);

    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successMessage = page.getByText('Successfully Saved', { exact: true });
    this.updatedMessage = page.getByText('Successfully Updated', { exact: true });

    this.employeeListButton = page.getByRole('link', { name: 'Employee List' });

    this.employeeIdSearch = page.getByRole('textbox').nth(1);

    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
  }

  async openAddEmployee() {
    await this.addEmployeeButton.click();
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async createEmployee({
    firstName,
    middleName = '',
    lastName,
    employeeId,
  }) {
    await this.firstNameInput.fill(firstName);

    if (middleName) {
      await this.middleNameInput.fill(middleName);
    }

    await this.lastNameInput.fill(lastName);

    if (employeeId) {
      await this.employeeIdInput.fill(employeeId);
    }

    await this.saveButton.click();

    return employeeId;
  }

  async openEmployeeList() {
    await this.employeeListButton.click();

    await this.page
      .getByRole('heading', { name: 'Employee Information' })
      .waitFor({ state: 'visible' });
  }

  async searchEmployeeById(employeeId) {
    await this.employeeIdSearch.fill(employeeId);
    await this.searchButton.click();

    await this.page
      .locator('.oxd-table-body')
      .waitFor({ state: 'visible' });
  }

  getEmployeeRow(lastName) {
    return this.page.getByRole('row').filter({ hasText: lastName }).last();
  }

  async openEmployeeForEdit(lastName) {
    const row = this.getEmployeeRow(lastName);

    await row.waitFor({ state: 'visible' });
    await row.getByRole('button').first().click();

    await this.page
      .getByRole('heading', { name: 'Personal Details' })
      .waitFor({ state: 'visible' });
  }

async updateLastName(newLastName) {
  const lastNameField = this.page.getByRole('textbox', {
    name: 'Last Name',
  });

  // Make sure the field is actually present
  await lastNameField.waitFor({ state: 'visible' });

  // Bring the field into view
  await lastNameField.scrollIntoViewIfNeeded();

  // Clear the existing value and enter the new last name
  await lastNameField.click();
  await lastNameField.fill(newLastName);

  // PROVE that Playwright entered the new value
  await expect(lastNameField).toHaveValue(newLastName);

  // Only after the field contains the new value, click Save
  await this.page.getByRole('button', { name: 'Save' }).first().click();

  await this.updatedMessage.waitFor({ state: 'visible' });

  // Refresh after update
  await this.page.reload();

  await this.page.getByRole('heading', {
    name: 'Personal Details',
  }).waitFor({ state: 'visible' });
}
  async selectEmployee(lastName) {
    const row = this.getEmployeeRowByLastName(lastName);
    await row.getByRole('checkbox').check();
  }

  async deleteSelectedEmployee() {
    await this.page.getByText('Delete Selected', { exact: true }).click();
    await this.page.getByRole('button', { name: /Yes, Delete/i }).click();
  }
}

module.exports = { EmployeePage };

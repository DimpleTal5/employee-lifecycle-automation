const { expect } = require('@playwright/test');

class EmployeePage {
  constructor(page) {
    this.page = page;

    this.addEmployeeButton = page.getByRole('link', {
      name: 'Add Employee',
    });

    this.firstNameInput = page.getByRole('textbox', {
      name: 'First Name',
    });

    this.middleNameInput = page.getByRole('textbox', {
      name: 'Middle Name',
    });

    this.lastNameInput = page.getByRole('textbox', {
      name: 'Last Name',
    });

    this.employeeIdInput = page.locator('input.oxd-input').nth(4);

    this.saveButton = page.getByRole('button', {
      name: 'Save',
    });

    this.successMessage = page.getByText('Successfully Saved', {
      exact: true,
    });

    this.updatedMessage = page.getByText('Successfully Updated', {
      exact: true,
    });

    this.employeeListButton = page.getByRole('link', {
      name: 'Employee List',
    });

    this.employeeIdSearch = page.getByRole('textbox').nth(1);

    this.searchButton = page.getByRole('button', {
      name: 'Search',
    });

    this.resetButton = page.getByRole('button', {
      name: 'Reset',
    });
  }

  async openAddEmployee() {
    await this.addEmployeeButton.click();

    await this.firstNameInput.waitFor({
      state: 'visible',
      timeout: 15000,
    });
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

    await this.successMessage.waitFor({
      state: 'visible',
      timeout: 15000,
    });

    return employeeId;
  }

  async openEmployeeList() {
    await this.employeeListButton.click();

    await this.page.waitForLoadState('domcontentloaded', {
      timeout: 30000,
    });

    await this.page
      .getByRole('heading', {
        name: 'Employee Information',
      })
      .waitFor({
        state: 'visible',
        timeout: 30000,
      });
  }

  async searchEmployeeById(employeeId) {
    await this.employeeIdSearch.waitFor({
      state: 'visible',
      timeout: 15000,
    });

    await this.employeeIdSearch.fill(employeeId);

    await this.searchButton.click();

    await this.page
      .locator('.oxd-table-body')
      .waitFor({
        state: 'visible',
        timeout: 15000,
      });
  }

  getEmployeeRow(lastName) {
    return this.page
      .getByRole('row')
      .filter({
        hasText: lastName,
      })
      .last();
  }

  async openEmployeeForEdit(lastName) {
    const row = this.getEmployeeRow(lastName);

    await row.waitFor({
      state: 'visible',
      timeout: 15000,
    });

    await row
      .getByRole('button')
      .first()
      .click();

    await this.page
      .getByRole('heading', {
        name: 'Personal Details',
      })
      .waitFor({
        state: 'visible',
        timeout: 30000,
      });
  }

  async updateLastName(newLastName) {
    const lastNameField = this.page.getByRole('textbox', {
      name: 'Last Name',
    });

    await lastNameField.waitFor({
      state: 'visible',
      timeout: 15000,
    });

    await lastNameField.scrollIntoViewIfNeeded();

    await lastNameField.click();

    await lastNameField.fill(newLastName);

    await expect(lastNameField).toHaveValue(newLastName);

    await this.page
      .getByRole('button', {
        name: 'Save',
      })
      .first()
      .click();

    await this.updatedMessage.waitFor({
      state: 'visible',
      timeout: 15000,
    });

    await this.page.reload();

    await this.page
      .getByRole('heading', {
        name: 'Personal Details',
      })
      .waitFor({
        state: 'visible',
        timeout: 30000,
      });
  }

  async selectEmployee(lastName) {
    const row = this.getEmployeeRow(lastName);

    await row
      .getByRole('checkbox')
      .check();
  }

  async deleteSelectedEmployee() {
    await this.page
      .getByText('Delete Selected', {
        exact: true,
      })
      .click();

    await this.page
      .getByRole('button', {
        name: /Yes, Delete/i,
      })
      .click();
  }
}

module.exports = {
  EmployeePage,
};
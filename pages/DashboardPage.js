class DashboardPage {
  constructor(page) {
    this.page = page;

    this.dashboardHeading = page.getByRole('heading', {
      name: 'Dashboard',
      exact: true,
    });

    this.adminMenu = page.getByRole('link', {
      name: 'Admin',
    });

    this.pimMenu = page.getByRole('link', {
      name: 'PIM',
    });

    this.leaveMenu = page.getByRole('link', {
      name: 'Leave',
    });

    this.myInfoMenu = page.getByRole('link', {
      name: 'My Info',
    });
  }

  async openPIM() {
    await this.pimMenu.click();

    await this.page
      .getByRole('heading', {
        name: 'Employee Information',
      })
      .waitFor({
        state: 'visible',
        timeout: 30000,
      });
  }
}

module.exports = {
  DashboardPage,
};
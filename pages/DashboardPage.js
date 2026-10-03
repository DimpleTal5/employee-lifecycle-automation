class DashboardPage {
  constructor(page) {
    this.page = page;

    this.dashboardHeading = page.getByRole('heading', {
      name: 'Dashboard',
    });

    this.pimMenu = page.getByRole('link', {
      name: 'PIM',
    });

    this.adminMenu = page.getByRole('link', {
      name: 'Admin',
    });
  }

  async isDashboardVisible() {
    return this.dashboardHeading.isVisible();
  }

  async openPIM() {
    await this.pimMenu.click();
  }

  async openAdmin() {
    await this.adminMenu.click();
  }
}

module.exports = { DashboardPage };

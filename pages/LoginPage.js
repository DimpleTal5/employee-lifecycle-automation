class LoginPage {
  constructor(page) {
    this.page = page;

    this.usernameInput = page.getByRole('textbox', {
      name: 'Username',
    });

    this.passwordInput = page.getByRole('textbox', {
      name: 'Password',
    });

    this.loginButton = page.getByRole('button', {
      name: 'Login',
    });
  }

  async open() {
    await this.page.goto('/web/index.php/auth/login', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await this.usernameInput.waitFor({
      state: 'visible',
      timeout: 30000,
    });
  }

  async loginAs(username, password) {
    await this.open();

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    await this.loginButton.click();

    await this.page.waitForURL(
      /\/web\/index\.php\/dashboard\/index/,
      {
        timeout: 30000,
      }
    );
  }
}

module.exports = {
  LoginPage,
};
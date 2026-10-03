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

    this.loginError = page.locator('.oxd-alert-content-text');
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAs(username, password) {
    await this.goto();
    await this.login(username, password);
  }
}

module.exports = { LoginPage };

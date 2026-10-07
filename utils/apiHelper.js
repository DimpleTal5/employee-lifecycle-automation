class ApiHelper {
  constructor(request, basePath = '/web/index.php/api/v2') {
    this.request = request;
    this.basePath = basePath;
    this.employeePageSize = 50;
    this.essRoleId = 2;
  }

  async get(url, options = {}) {
    return this.request.get(url, options);
  }

  async post(url, options = {}) {
    return this.request.post(url, options);
  }

  async put(url, options = {}) {
    return this.request.put(url, options);
  }

  async delete(url, options = {}) {
    return this.request.delete(url, options);
  }

  async findEmployeeByLastName(lastName) {
    for (let offset = 0; offset <= 500; offset += this.employeePageSize) {
      const response = await this.get(
        `${this.basePath}/pim/employees?limit=${this.employeePageSize}&offset=${offset}`
      );

      if (!response.ok()) {
        throw new Error(
          `Unable to list employees. HTTP ${response.status()}`
        );
      }

      const body = await response.json();
      const employees = Array.isArray(body.data) ? body.data : [];

      const match = employees.find(
        (employee) => employee.lastName === lastName
      );

      if (match) {
        return match;
      }

      if (employees.length < this.employeePageSize) {
        break;
      }
    }

    throw new Error(`Employee with last name "${lastName}" was not found.`);
  }

  async createEssUser({ username, password, empNumber }) {
    const response = await this.post(
      `${this.basePath}/admin/users`,
      {
        data: {
          username,
          password,
          status: true,
          userRoleId: this.essRoleId,
          empNumber,
        },
      }
    );

    if (!response.ok()) {
      throw new Error(
        `Unable to create ESS user. HTTP ${response.status()}`
      );
    }

    const body = await response.json();

    return body.data.id;
  }

  async deleteUsers(userIds) {
    if (!userIds || userIds.length === 0) {
      return;
    }

    const response = await this.delete(
      `${this.basePath}/admin/users`,
      {
        data: {
          ids: userIds,
        },
      }
    );

    if (!response.ok()) {
      throw new Error(
        `Unable to delete users. HTTP ${response.status()}`
      );
    }
  }
}

module.exports = { ApiHelper };
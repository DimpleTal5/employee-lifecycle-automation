class ApiHelper {
  constructor(request, basePath = '/web/index.php/api/v2') {
    this.request = request;
    this.basePath = basePath;
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
    for (let offset = 0; offset <= 500; offset += 50) {
      const response = await this.get(
        `${this.basePath}/pim/employees?limit=50&offset=${offset}`
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

      if (employees.length < 50) {
        break;
      }
    }

    throw new Error(`Employee with last name "${lastName}" was not found.`);
  }
}

module.exports = { ApiHelper };

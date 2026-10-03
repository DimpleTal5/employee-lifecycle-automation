function createEmployeeData() {
  const uniqueId = Date.now().toString().slice(-8);

  return {
    firstName: 'D1',
    middleName: 'A1',
    lastName: 'T1',
    employeeId: uniqueId,
    updatedLastName: 'T1U',
  };
}

module.exports = { createEmployeeData };

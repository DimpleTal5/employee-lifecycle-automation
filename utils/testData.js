function createEmployeeData() {
  const uniqueSuffix = Date.now().toString().slice(-6);

  return {
    firstName: 'Dimple',
    middleName: 'QA',
    lastName: `Talreja_${uniqueSuffix}`,
    employeeId: `EMP${uniqueSuffix}`,
    updatedLastName: `TalrejaU_${uniqueSuffix}`,
  };
}

module.exports = { createEmployeeData };

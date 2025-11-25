const db = require('../config/database');

// Generate next employee ID in format EMP-00001
const generateEmployeeId = () => {
  const result = db.prepare(`
    SELECT employee_id FROM employees ORDER BY id DESC LIMIT 1
  `).get();

  let nextNumber = 1;

  if (result && result.employee_id) {
    const currentNumber = parseInt(result.employee_id.split('-')[1]);
    nextNumber = currentNumber + 1;
  }

  return `EMP-${String(nextNumber).padStart(5, '0')}`;
};

module.exports = {
  generateEmployeeId
};

const db = require('../config/database');

// Get employee by ID
const getEmployeeById = (id) => {
  const employee = db.prepare(`
    SELECT id, employee_id, name, email, department, work_eligibility_doc_path,
           employment_start_date, status, created_at
    FROM employees
    WHERE id = ?
  `).get(id);

  return employee;
};

// Get employee profile with additional stats
const getEmployeeProfile = (id) => {
  const employee = getEmployeeById(id);

  if (!employee) {
    return null;
  }

  // Get training progress
  const trainingStats = db.prepare(`
    SELECT
      COUNT(*) as total_modules,
      SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_modules
    FROM employee_training
    WHERE employee_id = ?
  `).get(id);

  // Get timesheet stats
  const timesheetStats = db.prepare(`
    SELECT
      COUNT(*) as total_timesheets,
      SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted_timesheets,
      SUM(total_hours) as total_hours_logged
    FROM timesheets
    WHERE employee_id = ?
  `).get(id);

  // Get expense stats
  const expenseStats = db.prepare(`
    SELECT
      COUNT(*) as total_expenses,
      SUM(amount) as total_amount
    FROM expenses
    WHERE employee_id = ?
  `).get(id);

  return {
    ...employee,
    training: {
      total: trainingStats.total_modules || 0,
      completed: trainingStats.completed_modules || 0,
      percentage: trainingStats.total_modules > 0
        ? Math.round((trainingStats.completed_modules / trainingStats.total_modules) * 100)
        : 0
    },
    timesheets: {
      total: timesheetStats.total_timesheets || 0,
      submitted: timesheetStats.submitted_timesheets || 0,
      totalHours: timesheetStats.total_hours_logged || 0
    },
    expenses: {
      count: expenseStats.total_expenses || 0,
      totalAmount: expenseStats.total_amount || 0
    }
  };
};

// Get employee dashboard data
const getEmployeeDashboard = (employeeId) => {
  const profile = getEmployeeProfile(employeeId);

  if (!profile) {
    return null;
  }

  // Get recent training modules
  const recentTraining = db.prepare(`
    SELECT
      tm.id, tm.code, tm.name, tm.description, tm.estimated_hours, tm.category,
      et.status, et.completion_date, et.completion_score
    FROM employee_training et
    JOIN training_modules tm ON et.module_id = tm.id
    WHERE et.employee_id = ?
    ORDER BY et.updated_at DESC
    LIMIT 5
  `).all(employeeId);

  // Get recent timesheets
  const recentTimesheets = db.prepare(`
    SELECT id, week_start_date, week_end_date, total_hours, status, submitted_at
    FROM timesheets
    WHERE employee_id = ?
    ORDER BY week_start_date DESC
    LIMIT 5
  `).all(employeeId);

  // Get recent expenses
  const recentExpenses = db.prepare(`
    SELECT id, date, category, amount, currency, description
    FROM expenses
    WHERE employee_id = ?
    ORDER BY date DESC
    LIMIT 5
  `).all(employeeId);

  return {
    profile,
    recentTraining,
    recentTimesheets,
    recentExpenses
  };
};

module.exports = {
  getEmployeeById,
  getEmployeeProfile,
  getEmployeeDashboard
};

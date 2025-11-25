const db = require('../config/database');

// Get all pending timesheets across all employees
const getPendingTimesheets = () => {
  const timesheets = db.prepare(`
    SELECT
      t.id,
      t.employee_id,
      t.week_start_date,
      t.week_end_date,
      t.total_hours,
      t.status,
      t.submitted_at,
      t.created_at,
      e.name as employee_name,
      e.employee_id as employee_number,
      e.department
    FROM timesheets t
    JOIN employees e ON t.employee_id = e.id
    WHERE t.status = 'submitted'
    ORDER BY t.submitted_at DESC
  `).all();

  return timesheets;
};

// Get all timesheets (with optional status filter)
const getAllTimesheets = (status = null) => {
  let query = `
    SELECT
      t.id,
      t.employee_id,
      t.week_start_date,
      t.week_end_date,
      t.total_hours,
      t.status,
      t.submitted_at,
      t.created_at,
      e.name as employee_name,
      e.employee_id as employee_number,
      e.department
    FROM timesheets t
    JOIN employees e ON t.employee_id = e.id
  `;

  const params = [];

  if (status) {
    query += ` WHERE t.status = ?`;
    params.push(status);
  }

  query += ` ORDER BY t.submitted_at DESC, t.created_at DESC`;

  return db.prepare(query).all(...params);
};

// Get timesheet details with entries
const getTimesheetDetails = (timesheetId) => {
  const timesheet = db.prepare(`
    SELECT
      t.id,
      t.employee_id,
      t.week_start_date,
      t.week_end_date,
      t.total_hours,
      t.status,
      t.submitted_at,
      t.created_at,
      e.name as employee_name,
      e.employee_id as employee_number,
      e.department,
      e.email as employee_email
    FROM timesheets t
    JOIN employees e ON t.employee_id = e.id
    WHERE t.id = ?
  `).get(timesheetId);

  if (!timesheet) {
    return null;
  }

  // Get entries
  const entries = db.prepare(`
    SELECT id, date, hours, project_description, work_location
    FROM timesheet_entries
    WHERE timesheet_id = ?
    ORDER BY date ASC
  `).all(timesheetId);

  return {
    ...timesheet,
    entries
  };
};

// Approve timesheet
const approveTimesheet = (timesheetId) => {
  const timesheet = db.prepare('SELECT id, status FROM timesheets WHERE id = ?').get(timesheetId);

  if (!timesheet) {
    throw new Error('Timesheet not found');
  }

  if (timesheet.status !== 'submitted') {
    throw new Error('Only submitted timesheets can be approved');
  }

  db.prepare(`
    UPDATE timesheets
    SET status = 'approved'
    WHERE id = ?
  `).run(timesheetId);

  return {
    message: 'Timesheet approved successfully'
  };
};

// Reject timesheet
const rejectTimesheet = (timesheetId, reason = null) => {
  const timesheet = db.prepare('SELECT id, status FROM timesheets WHERE id = ?').get(timesheetId);

  if (!timesheet) {
    throw new Error('Timesheet not found');
  }

  if (timesheet.status !== 'submitted') {
    throw new Error('Only submitted timesheets can be rejected');
  }

  db.prepare(`
    UPDATE timesheets
    SET status = 'rejected'
    WHERE id = ?
  `).run(timesheetId);

  return {
    message: 'Timesheet rejected successfully',
    reason
  };
};

// Get dashboard statistics
const getDashboardStats = () => {
  const timesheetStats = db.prepare(`
    SELECT
      COUNT(*) as total_timesheets,
      SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as pending_timesheets,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_timesheets,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_timesheets
    FROM timesheets
  `).get();

  const employeeStats = db.prepare(`
    SELECT
      COUNT(*) as total_employees,
      COUNT(DISTINCT department) as total_departments
    FROM employees
    WHERE status = 'active'
  `).get();

  const recentActivity = db.prepare(`
    SELECT
      t.id,
      t.status,
      t.submitted_at,
      e.name as employee_name,
      e.department,
      'timesheet' as type
    FROM timesheets t
    JOIN employees e ON t.employee_id = e.id
    WHERE t.status IN ('submitted', 'approved', 'rejected')
    ORDER BY t.submitted_at DESC
    LIMIT 10
  `).all();

  return {
    timesheetStats,
    employeeStats,
    recentActivity
  };
};

// Get all employees
const getAllEmployees = () => {
  const employees = db.prepare(`
    SELECT
      e.id,
      e.employee_id,
      e.name,
      e.email,
      e.department,
      e.employment_start_date,
      e.status,
      COUNT(DISTINCT t.id) as total_timesheets,
      SUM(CASE WHEN t.status = 'submitted' THEN 1 ELSE 0 END) as pending_timesheets
    FROM employees e
    LEFT JOIN timesheets t ON e.id = t.employee_id
    WHERE e.status = 'active'
    GROUP BY e.id
    ORDER BY e.name ASC
  `).all();

  return employees;
};

module.exports = {
  getPendingTimesheets,
  getAllTimesheets,
  getTimesheetDetails,
  approveTimesheet,
  rejectTimesheet,
  getDashboardStats,
  getAllEmployees
};

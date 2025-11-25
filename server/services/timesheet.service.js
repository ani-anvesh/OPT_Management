const db = require('../config/database');

// Get all timesheets for an employee
const getEmployeeTimesheets = (employeeId, status = null) => {
  let query = `
    SELECT id, week_start_date, week_end_date, total_hours, status, submitted_at, created_at
    FROM timesheets
    WHERE employee_id = ?
  `;

  const params = [employeeId];

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  query += ` ORDER BY week_start_date DESC`;

  return db.prepare(query).all(...params);
};

// Get a single timesheet with entries
const getTimesheetById = (timesheetId, employeeId) => {
  const timesheet = db.prepare(`
    SELECT id, employee_id, week_start_date, week_end_date, total_hours, status, submitted_at, created_at
    FROM timesheets
    WHERE id = ? AND employee_id = ?
  `).get(timesheetId, employeeId);

  if (!timesheet) {
    return null;
  }

  // Get timesheet entries
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

// Create a new timesheet
const createTimesheet = (employeeId, weekStartDate, entries) => {
  // Check if timesheet already exists for this week
  const existing = db.prepare(`
    SELECT id FROM timesheets
    WHERE employee_id = ? AND week_start_date = ?
  `).get(employeeId, weekStartDate);

  if (existing) {
    throw new Error('Timesheet already exists for this week');
  }

  // Calculate week end date (6 days after start)
  const startDate = new Date(weekStartDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  // Calculate total hours
  const totalHours = entries.reduce((sum, entry) => sum + parseFloat(entry.hours), 0);

  // Validate hours for each day
  for (const entry of entries) {
    const hours = parseFloat(entry.hours);
    if (hours < 0 || hours > 24) {
      throw new Error(`Invalid hours for ${entry.date}: must be between 0 and 24`);
    }
  }

  // Insert timesheet
  const result = db.prepare(`
    INSERT INTO timesheets (employee_id, week_start_date, week_end_date, total_hours, status)
    VALUES (?, ?, ?, ?, 'draft')
  `).run(employeeId, weekStartDate, endDate.toISOString().split('T')[0], totalHours);

  const timesheetId = result.lastInsertRowid;

  // Insert entries
  const insertEntry = db.prepare(`
    INSERT INTO timesheet_entries (timesheet_id, date, hours, project_description, work_location)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const entry of entries) {
    insertEntry.run(
      timesheetId,
      entry.date,
      entry.hours,
      entry.project_description || '',
      entry.work_location || ''
    );
  }

  return getTimesheetById(timesheetId, employeeId);
};

// Submit a timesheet (lock it)
const submitTimesheet = (timesheetId, employeeId) => {
  const timesheet = db.prepare(`
    SELECT id, status FROM timesheets
    WHERE id = ? AND employee_id = ?
  `).get(timesheetId, employeeId);

  if (!timesheet) {
    throw new Error('Timesheet not found');
  }

  if (timesheet.status === 'submitted') {
    return {
      message: 'Timesheet already submitted',
      alreadySubmitted: true
    };
  }

  db.prepare(`
    UPDATE timesheets
    SET status = 'submitted', submitted_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(timesheetId);

  return {
    message: 'Timesheet submitted successfully',
    alreadySubmitted: false
  };
};

module.exports = {
  getEmployeeTimesheets,
  getTimesheetById,
  createTimesheet,
  submitTimesheet
};

const timesheetService = require('../services/timesheet.service');

// Get all timesheets for current employee
const getTimesheets = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;
    const status = req.query.status;

    const timesheets = timesheetService.getEmployeeTimesheets(employeeId, status);

    res.json({ timesheets });
  } catch (error) {
    next(error);
  }
};

// Get a single timesheet
const getTimesheet = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;
    const timesheetId = parseInt(req.params.id);

    if (!timesheetId || isNaN(timesheetId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid timesheet ID'
      });
    }

    const timesheet = timesheetService.getTimesheetById(timesheetId, employeeId);

    if (!timesheet) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Timesheet not found'
      });
    }

    res.json({ timesheet });
  } catch (error) {
    next(error);
  }
};

// Create a new timesheet
const createTimesheet = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;
    const { weekStartDate, entries } = req.body;

    if (!weekStartDate || !entries || !Array.isArray(entries)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Week start date and entries are required'
      });
    }

    if (entries.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'At least one timesheet entry is required'
      });
    }

    const timesheet = timesheetService.createTimesheet(employeeId, weekStartDate, entries);

    res.status(201).json({
      message: 'Timesheet created successfully',
      timesheet
    });
  } catch (error) {
    if (error.message === 'Timesheet already exists for this week') {
      return res.status(409).json({
        error: 'Conflict',
        message: error.message
      });
    }
    if (error.message.includes('Invalid hours')) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.message
      });
    }
    next(error);
  }
};

// Submit a timesheet
const submitTimesheet = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;
    const timesheetId = parseInt(req.params.id);

    if (!timesheetId || isNaN(timesheetId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid timesheet ID'
      });
    }

    const result = timesheetService.submitTimesheet(timesheetId, employeeId);

    res.json(result);
  } catch (error) {
    if (error.message === 'Timesheet not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message
      });
    }
    next(error);
  }
};

module.exports = {
  getTimesheets,
  getTimesheet,
  createTimesheet,
  submitTimesheet
};

const managerService = require('../services/manager.service');

// Get dashboard statistics
const getDashboardStats = (req, res, next) => {
  try {
    const stats = managerService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// Get all timesheets
const getTimesheets = (req, res, next) => {
  try {
    const status = req.query.status;
    const timesheets = managerService.getAllTimesheets(status);
    res.json({ timesheets });
  } catch (error) {
    next(error);
  }
};

// Get pending timesheets
const getPendingTimesheets = (req, res, next) => {
  try {
    const timesheets = managerService.getPendingTimesheets();
    res.json({ timesheets });
  } catch (error) {
    next(error);
  }
};

// Get timesheet details
const getTimesheetDetails = (req, res, next) => {
  try {
    const timesheetId = parseInt(req.params.id);

    if (!timesheetId || isNaN(timesheetId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid timesheet ID'
      });
    }

    const timesheet = managerService.getTimesheetDetails(timesheetId);

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

// Approve timesheet
const approveTimesheet = (req, res, next) => {
  try {
    const timesheetId = parseInt(req.params.id);

    if (!timesheetId || isNaN(timesheetId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid timesheet ID'
      });
    }

    const result = managerService.approveTimesheet(timesheetId);
    res.json(result);
  } catch (error) {
    if (error.message === 'Timesheet not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message
      });
    }
    if (error.message.includes('Only submitted')) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.message
      });
    }
    next(error);
  }
};

// Reject timesheet
const rejectTimesheet = (req, res, next) => {
  try {
    const timesheetId = parseInt(req.params.id);
    const { reason } = req.body;

    if (!timesheetId || isNaN(timesheetId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid timesheet ID'
      });
    }

    const result = managerService.rejectTimesheet(timesheetId, reason);
    res.json(result);
  } catch (error) {
    if (error.message === 'Timesheet not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message
      });
    }
    if (error.message.includes('Only submitted')) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.message
      });
    }
    next(error);
  }
};

// Get all employees
const getEmployees = (req, res, next) => {
  try {
    const employees = managerService.getAllEmployees();
    res.json({ employees });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getTimesheets,
  getPendingTimesheets,
  getTimesheetDetails,
  approveTimesheet,
  rejectTimesheet,
  getEmployees
};

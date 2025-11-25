const express = require('express');
const router = express.Router();
const timesheetController = require('../controllers/timesheet.controller');
const { requireEmployeeAuth } = require('../middleware/auth');

// GET /api/timesheets - Get all timesheets for current employee
router.get('/', requireEmployeeAuth, timesheetController.getTimesheets);

// GET /api/timesheets/:id - Get a single timesheet
router.get('/:id', requireEmployeeAuth, timesheetController.getTimesheet);

// POST /api/timesheets - Create a new timesheet
router.post('/', requireEmployeeAuth, timesheetController.createTimesheet);

// POST /api/timesheets/:id/submit - Submit a timesheet
router.post('/:id/submit', requireEmployeeAuth, timesheetController.submitTimesheet);

module.exports = router;

const express = require('express');
const router = express.Router();
const managerController = require('../controllers/manager.controller');
const { requireManagerAuth } = require('../middleware/auth');

// GET /api/manager/stats - Get dashboard statistics
router.get('/stats', requireManagerAuth, managerController.getDashboardStats);

// GET /api/manager/timesheets - Get all timesheets (with optional status filter)
router.get('/timesheets', requireManagerAuth, managerController.getTimesheets);

// GET /api/manager/timesheets/pending - Get pending timesheets
router.get('/timesheets/pending', requireManagerAuth, managerController.getPendingTimesheets);

// GET /api/manager/timesheets/:id - Get timesheet details
router.get('/timesheets/:id', requireManagerAuth, managerController.getTimesheetDetails);

// POST /api/manager/timesheets/:id/approve - Approve timesheet
router.post('/timesheets/:id/approve', requireManagerAuth, managerController.approveTimesheet);

// POST /api/manager/timesheets/:id/reject - Reject timesheet
router.post('/timesheets/:id/reject', requireManagerAuth, managerController.rejectTimesheet);

// GET /api/manager/employees - Get all employees
router.get('/employees', requireManagerAuth, managerController.getEmployees);

module.exports = router;

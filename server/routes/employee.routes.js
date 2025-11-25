const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');
const { requireEmployeeAuth } = require('../middleware/auth');

// GET /api/employees/me - Get current employee profile
router.get('/me', requireEmployeeAuth, employeeController.getMe);

// GET /api/employees/dashboard - Get employee dashboard data
router.get('/dashboard', requireEmployeeAuth, employeeController.getDashboard);

module.exports = router;

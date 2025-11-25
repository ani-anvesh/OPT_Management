const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export.controller');
const { requireEmployeeAuth } = require('../middleware/auth');

// GET /api/export/timesheet/:id - Export a specific timesheet as PDF
router.get('/timesheet/:id', requireEmployeeAuth, exportController.exportTimesheet);

// GET /api/export/expenses - Export all expenses as PDF (with optional category filter)
router.get('/expenses', requireEmployeeAuth, exportController.exportExpenses);

module.exports = router;

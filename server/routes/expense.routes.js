const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { requireEmployeeAuth } = require('../middleware/auth');
const { uploadReceipt } = require('../middleware/fileUpload');

// GET /api/expenses - Get all expenses for current employee
router.get('/', requireEmployeeAuth, expenseController.getExpenses);

// GET /api/expenses/summary - Get expense summary statistics
router.get('/summary', requireEmployeeAuth, expenseController.getExpenseSummary);

// GET /api/expenses/:id - Get a single expense
router.get('/:id', requireEmployeeAuth, expenseController.getExpense);

// POST /api/expenses - Create a new expense with optional receipt upload
router.post('/', requireEmployeeAuth, uploadReceipt, expenseController.createExpense);

// PUT /api/expenses/:id - Update an expense
router.put('/:id', requireEmployeeAuth, uploadReceipt, expenseController.updateExpense);

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', requireEmployeeAuth, expenseController.deleteExpense);

module.exports = router;

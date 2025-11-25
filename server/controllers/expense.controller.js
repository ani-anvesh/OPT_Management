const expenseService = require('../services/expense.service');
const path = require('path');

// Get all expenses for current employee
const getExpenses = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;
    const category = req.query.category;

    const expenses = expenseService.getEmployeeExpenses(employeeId, category);

    res.json({ expenses });
  } catch (error) {
    next(error);
  }
};

// Get a single expense
const getExpense = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;
    const expenseId = parseInt(req.params.id);

    if (!expenseId || isNaN(expenseId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid expense ID'
      });
    }

    const expense = expenseService.getExpenseById(expenseId, employeeId);

    if (!expense) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Expense not found'
      });
    }

    res.json({ expense });
  } catch (error) {
    next(error);
  }
};

// Create a new expense (with optional receipt upload)
const createExpense = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;
    const { date, category, amount, currency, description } = req.body;

    if (!date || !category || !amount) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Date, category, and amount are required'
      });
    }

    const expenseData = {
      date,
      category,
      amount: parseFloat(amount),
      currency: currency || 'USD',
      description,
      receipt_doc_path: req.file ? `/uploads/receipts/${req.file.filename}` : null
    };

    const expense = expenseService.createExpense(employeeId, expenseData);

    res.status(201).json({
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    if (error.message.includes('Invalid category') || error.message.includes('Amount must')) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.message
      });
    }
    next(error);
  }
};

// Update an expense
const updateExpense = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;
    const expenseId = parseInt(req.params.id);

    if (!expenseId || isNaN(expenseId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid expense ID'
      });
    }

    const updateData = {};
    const { date, category, amount, currency, description } = req.body;

    if (date) updateData.date = date;
    if (category) updateData.category = category;
    if (amount) updateData.amount = parseFloat(amount);
    if (currency) updateData.currency = currency;
    if (description !== undefined) updateData.description = description;
    if (req.file) updateData.receipt_doc_path = `/uploads/receipts/${req.file.filename}`;

    const expense = expenseService.updateExpense(expenseId, employeeId, updateData);

    res.json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    if (error.message === 'Expense not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message
      });
    }
    if (error.message.includes('Invalid category') || error.message.includes('Amount must')) {
      return res.status(400).json({
        error: 'Validation Error',
        message: error.message
      });
    }
    next(error);
  }
};

// Delete an expense
const deleteExpense = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;
    const expenseId = parseInt(req.params.id);

    if (!expenseId || isNaN(expenseId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid expense ID'
      });
    }

    const result = expenseService.deleteExpense(expenseId, employeeId);

    res.json(result);
  } catch (error) {
    if (error.message === 'Expense not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message
      });
    }
    next(error);
  }
};

// Get expense summary
const getExpenseSummary = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;

    const summary = expenseService.getExpenseSummary(employeeId);

    res.json(summary);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
};

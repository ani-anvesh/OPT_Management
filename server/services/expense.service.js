const db = require('../config/database');

// Get all expenses for an employee
const getEmployeeExpenses = (employeeId, category = null) => {
  let query = `
    SELECT id, date, category, amount, currency, description, receipt_doc_path, created_at
    FROM expenses
    WHERE employee_id = ?
  `;

  const params = [employeeId];

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  query += ` ORDER BY date DESC, created_at DESC`;

  return db.prepare(query).all(...params);
};

// Get a single expense
const getExpenseById = (expenseId, employeeId) => {
  const expense = db.prepare(`
    SELECT id, employee_id, date, category, amount, currency, description, receipt_doc_path, created_at
    FROM expenses
    WHERE id = ? AND employee_id = ?
  `).get(expenseId, employeeId);

  return expense;
};

// Create a new expense
const createExpense = (employeeId, expenseData) => {
  const { date, category, amount, currency = 'USD', description, receipt_doc_path } = expenseData;

  // Validate amount
  if (!amount || amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  // Validate category
  const validCategories = ['Travel', 'Meals', 'Office Supplies', 'Training', 'Other'];
  if (!validCategories.includes(category)) {
    throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
  }

  // Insert expense
  const result = db.prepare(`
    INSERT INTO expenses (employee_id, date, category, amount, currency, description, receipt_doc_path)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(employeeId, date, category, amount, currency, description || '', receipt_doc_path || null);

  const expenseId = result.lastInsertRowid;

  return getExpenseById(expenseId, employeeId);
};

// Update an expense
const updateExpense = (expenseId, employeeId, updateData) => {
  // Check if expense exists and belongs to employee
  const existing = getExpenseById(expenseId, employeeId);
  if (!existing) {
    throw new Error('Expense not found');
  }

  const { date, category, amount, currency, description, receipt_doc_path } = updateData;

  // Validate amount if provided
  if (amount !== undefined && amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  // Validate category if provided
  if (category) {
    const validCategories = ['Travel', 'Meals', 'Office Supplies', 'Training', 'Other'];
    if (!validCategories.includes(category)) {
      throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }
  }

  // Build update query dynamically
  const updates = [];
  const params = [];

  if (date !== undefined) {
    updates.push('date = ?');
    params.push(date);
  }
  if (category !== undefined) {
    updates.push('category = ?');
    params.push(category);
  }
  if (amount !== undefined) {
    updates.push('amount = ?');
    params.push(amount);
  }
  if (currency !== undefined) {
    updates.push('currency = ?');
    params.push(currency);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description);
  }
  if (receipt_doc_path !== undefined) {
    updates.push('receipt_doc_path = ?');
    params.push(receipt_doc_path);
  }

  if (updates.length === 0) {
    return existing;
  }

  params.push(expenseId, employeeId);

  db.prepare(`
    UPDATE expenses
    SET ${updates.join(', ')}
    WHERE id = ? AND employee_id = ?
  `).run(...params);

  return getExpenseById(expenseId, employeeId);
};

// Delete an expense
const deleteExpense = (expenseId, employeeId) => {
  const expense = getExpenseById(expenseId, employeeId);
  if (!expense) {
    throw new Error('Expense not found');
  }

  db.prepare(`
    DELETE FROM expenses
    WHERE id = ? AND employee_id = ?
  `).run(expenseId, employeeId);

  return { message: 'Expense deleted successfully', expense };
};

// Get expense summary statistics
const getExpenseSummary = (employeeId) => {
  const summary = db.prepare(`
    SELECT
      COUNT(*) as total_count,
      SUM(amount) as total_amount,
      currency
    FROM expenses
    WHERE employee_id = ?
    GROUP BY currency
  `).all(employeeId);

  const byCategory = db.prepare(`
    SELECT
      category,
      COUNT(*) as count,
      SUM(amount) as total,
      currency
    FROM expenses
    WHERE employee_id = ?
    GROUP BY category, currency
    ORDER BY total DESC
  `).all(employeeId);

  return {
    summary,
    byCategory
  };
};

module.exports = {
  getEmployeeExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
};

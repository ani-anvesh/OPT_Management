const bcrypt = require('bcrypt');
const db = require('../config/database');
const { validatePassword, validateEmail } = require('../utils/validation');
const { generateEmployeeId } = require('../utils/idGenerator');
const path = require('path');

// Register employee
const register = async (req, res, next) => {
  try {
    const { name, email, password, department, employmentStartDate } = req.body;

    // Validation
    if (!name || !email || !password || !department) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'All fields are required'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid email format'
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Validation Error',
        message: passwordValidation.errors.join(', ')
      });
    }

    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM employees WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Email already registered'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate employee ID
    const employeeId = generateEmployeeId();

    // Handle file upload
    let workEligibilityDocPath = null;
    if (req.file) {
      workEligibilityDocPath = `/uploads/work-eligibility/${req.file.filename}`;
    }

    // Insert employee
    const result = db.prepare(`
      INSERT INTO employees (employee_id, name, email, password_hash, department, work_eligibility_doc_path, employment_start_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
    `).run(
      employeeId,
      name,
      email,
      passwordHash,
      department,
      workEligibilityDocPath,
      employmentStartDate || new Date().toISOString().split('T')[0]
    );

    res.status(201).json({
      message: 'Registration successful',
      employeeId: employeeId,
      employee: {
        id: result.lastInsertRowid,
        employeeId: employeeId,
        name,
        email,
        department
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password, userType = 'employee' } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email and password are required'
      });
    }

    let user;
    let tableName;

    if (userType === 'manager') {
      tableName = 'managers';
      user = db.prepare('SELECT * FROM managers WHERE email = ?').get(email);
    } else {
      tableName = 'employees';
      user = db.prepare('SELECT * FROM employees WHERE email = ?').get(email);
    }

    if (!user) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      });
    }

    // Create session
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: userType,
      employeeId: user.employee_id || null
    };

    // Remove sensitive data
    delete user.password_hash;

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: userType,
        employeeId: user.employee_id || null,
        department: user.department || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Logout Failed',
        message: 'Could not log out'
      });
    }
    res.json({ message: 'Logout successful' });
  });
};

// Get current user
const me = (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Not authenticated'
    });
  }

  res.json({
    user: req.session.user
  });
};

module.exports = {
  register,
  login,
  logout,
  me
};

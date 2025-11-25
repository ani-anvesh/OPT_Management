const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const dbPath = path.join(__dirname, 'employees.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// Create database
const db = new Database(dbPath);

// Enable foreign keys and WAL mode
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Read and execute schema
console.log('Initializing database schema...');
const schema = fs.readFileSync(schemaPath, 'utf8');
const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);

statements.forEach(statement => {
  try {
    db.exec(statement);
  } catch (error) {
    // Ignore errors for tables that already exist
  }
});

// Hash password function
const hashPassword = (password) => bcrypt.hashSync(password, 10);

// Clear existing data
console.log('Clearing existing data...');
db.exec('DELETE FROM timesheet_entries');
db.exec('DELETE FROM timesheets');
db.exec('DELETE FROM expenses');
db.exec('DELETE FROM employee_training');
db.exec('DELETE FROM training_modules');
db.exec('DELETE FROM employees');
db.exec('DELETE FROM managers');

// Insert Managers
console.log('Seeding managers...');
const insertManager = db.prepare(`
  INSERT INTO managers (name, email, password_hash, access_level)
  VALUES (?, ?, ?, ?)
`);

insertManager.run('Manager User', 'manager@company.com', hashPassword('Manager123'), 'manager');
insertManager.run('Admin User', 'admin@company.com', hashPassword('Admin123'), 'admin');

// Insert Employees
console.log('Seeding employees...');
const insertEmployee = db.prepare(`
  INSERT INTO employees (employee_id, name, email, password_hash, department, work_eligibility_doc_path, employment_start_date, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const employees = [
  { id: 'EMP-00001', name: 'John Doe', email: 'john.doe@company.com', dept: 'Engineering', start: '2024-01-15' },
  { id: 'EMP-00002', name: 'Jane Smith', email: 'jane.smith@company.com', dept: 'Marketing', start: '2024-02-01' },
  { id: 'EMP-00003', name: 'Bob Johnson', email: 'bob.johnson@company.com', dept: 'Sales', start: '2024-03-10' },
  { id: 'EMP-00004', name: 'Alice Williams', email: 'alice.williams@company.com', dept: 'HR', start: '2024-04-20' },
  { id: 'EMP-00005', name: 'Charlie Brown', email: 'charlie.brown@company.com', dept: 'Finance', start: '2024-05-05' }
];

employees.forEach(emp => {
  insertEmployee.run(
    emp.id,
    emp.name,
    emp.email,
    hashPassword('Password123'),
    emp.dept,
    `/uploads/work-eligibility/${emp.id}-eligibility.pdf`,
    emp.start,
    'active'
  );
});

// Insert Training Modules
console.log('Seeding training modules...');
const insertModule = db.prepare(`
  INSERT INTO training_modules (code, name, description, estimated_hours, category)
  VALUES (?, ?, ?, ?, ?)
`);

const modules = [
  { code: 'TRN-001', name: 'Company Orientation', desc: 'Introduction to company culture and policies', hours: 8, cat: 'Onboarding' },
  { code: 'TRN-002', name: 'Workplace Safety', desc: 'Essential safety protocols and procedures', hours: 4, cat: 'Compliance' },
  { code: 'TRN-003', name: 'IT Security Fundamentals', desc: 'Cybersecurity best practices', hours: 6, cat: 'Technical' },
  { code: 'TRN-004', name: 'Communication Skills', desc: 'Effective workplace communication', hours: 5, cat: 'Professional Development' },
  { code: 'TRN-005', name: 'Time Management', desc: 'Productivity and prioritization techniques', hours: 3, cat: 'Professional Development' },
  { code: 'TRN-006', name: 'Project Management Basics', desc: 'Introduction to project management methodologies', hours: 8, cat: 'Professional Development' },
  { code: 'TRN-007', name: 'Customer Service Excellence', desc: 'Customer relationship management', hours: 6, cat: 'Professional Development' },
  { code: 'TRN-008', name: 'Data Privacy & GDPR', desc: 'Understanding data protection regulations', hours: 5, cat: 'Compliance' },
  { code: 'TRN-009', name: 'Leadership Essentials', desc: 'Foundational leadership skills', hours: 10, cat: 'Leadership' },
  { code: 'TRN-010', name: 'Diversity & Inclusion', desc: 'Creating inclusive work environments', hours: 4, cat: 'Compliance' }
];

modules.forEach(mod => {
  insertModule.run(mod.code, mod.name, mod.desc, mod.hours, mod.cat);
});

// Assign training modules to employees with varied statuses
console.log('Assigning training modules to employees...');
const insertTraining = db.prepare(`
  INSERT INTO employee_training (employee_id, module_id, status, completion_date, completion_score)
  VALUES (?, ?, ?, ?, ?)
`);

// Get employee and module IDs
const employeeIds = db.prepare('SELECT id FROM employees').all().map(e => e.id);
const moduleIds = db.prepare('SELECT id FROM training_modules').all().map(m => m.id);

// Assign 3-5 modules to each employee with varied statuses
employeeIds.forEach((empId, index) => {
  const numModules = 3 + (index % 3); // 3-5 modules per employee
  const shuffled = [...moduleIds].sort(() => 0.5 - Math.random());

  for (let i = 0; i < numModules; i++) {
    let status = 'Not Started';
    let completionDate = null;
    let score = null;

    if (i === 0) {
      status = 'Completed';
      completionDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
      score = 85 + (index * 3);
    } else if (i === 1 && numModules > 3) {
      status = 'Completed';
      completionDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 days ago
      score = 90 + (index * 2);
    } else if (i === 2 && numModules > 4) {
      status = 'In Progress';
    }

    insertTraining.run(empId, shuffled[i], status, completionDate, score);
  }
});

// Add some sample timesheets
console.log('Seeding timesheets...');
const insertTimesheet = db.prepare(`
  INSERT INTO timesheets (employee_id, week_start_date, week_end_date, total_hours, status, submitted_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertTimesheetEntry = db.prepare(`
  INSERT INTO timesheet_entries (timesheet_id, date, hours, project_description, work_location)
  VALUES (?, ?, ?, ?, ?)
`);

// Create timesheets for first two employees
employeeIds.slice(0, 2).forEach((empId, index) => {
  const weekStartDate = new Date();
  weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay()); // Start of current week

  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  const result = insertTimesheet.run(
    empId,
    weekStartDate.toISOString().split('T')[0],
    weekEndDate.toISOString().split('T')[0],
    40,
    'submitted',
    new Date().toISOString()
  );

  const timesheetId = result.lastInsertRowid;

  // Add daily entries (Mon-Fri, 8 hours each)
  for (let day = 0; day < 5; day++) {
    const entryDate = new Date(weekStartDate);
    entryDate.setDate(entryDate.getDate() + day);

    insertTimesheetEntry.run(
      timesheetId,
      entryDate.toISOString().split('T')[0],
      8,
      'Regular work activities',
      'Office'
    );
  }
});

// Add some sample expenses
console.log('Seeding expenses...');
const insertExpense = db.prepare(`
  INSERT INTO expenses (employee_id, date, category, amount, currency, description, receipt_doc_path)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const expenses = [
  { empId: 1, cat: 'Education', amt: 299.99, desc: 'Online course subscription', receipt: '/uploads/receipts/receipt-001.pdf' },
  { empId: 1, cat: 'Travel', amt: 45.50, desc: 'Client meeting transportation', receipt: '/uploads/receipts/receipt-002.pdf' },
  { empId: 2, cat: 'Education', amt: 150.00, desc: 'Professional certification exam', receipt: '/uploads/receipts/receipt-003.pdf' },
  { empId: 3, cat: 'Travel', amt: 120.00, desc: 'Conference travel', receipt: '/uploads/receipts/receipt-004.pdf' },
  { empId: 3, cat: 'Other', amt: 75.00, desc: 'Office supplies', receipt: '/uploads/receipts/receipt-005.pdf' }
];

expenses.forEach(exp => {
  insertExpense.run(
    exp.empId,
    new Date().toISOString().split('T')[0],
    exp.cat,
    exp.amt,
    'USD',
    exp.desc,
    exp.receipt
  );
});

console.log('\n✅ Database seeded successfully!');
console.log('\nDemo Credentials:');
console.log('=================');
console.log('Employees:');
employees.forEach(emp => {
  console.log(`  ${emp.email} / Password123`);
});
console.log('\nManagers:');
console.log('  manager@company.com / Manager123');
console.log('  admin@company.com / Admin123');
console.log('\nDatabase location:', dbPath);

db.close();

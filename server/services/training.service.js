const db = require('../config/database');

// Get all training modules for an employee
const getEmployeeTraining = (employeeId) => {
  const modules = db.prepare(`
    SELECT
      tm.id,
      tm.code,
      tm.name,
      tm.description,
      tm.estimated_hours,
      tm.category,
      et.status,
      et.completion_date,
      et.completion_score,
      et.created_at as assigned_date
    FROM employee_training et
    JOIN training_modules tm ON et.module_id = tm.id
    WHERE et.employee_id = ?
    ORDER BY et.created_at DESC
  `).all(employeeId);

  return modules;
};

// Get training progress summary
const getTrainingProgress = (employeeId) => {
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_modules,
      SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_modules,
      SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_modules,
      SUM(CASE WHEN status = 'Not Started' THEN 1 ELSE 0 END) as not_started_modules,
      SUM(tm.estimated_hours) as total_hours,
      SUM(CASE WHEN et.status = 'Completed' THEN tm.estimated_hours ELSE 0 END) as completed_hours
    FROM employee_training et
    JOIN training_modules tm ON et.module_id = tm.id
    WHERE et.employee_id = ?
  `).get(employeeId);

  const percentage = stats.total_modules > 0
    ? Math.round((stats.completed_modules / stats.total_modules) * 100)
    : 0;

  // Estimate completion date based on average completion rate
  let estimatedCompletionDate = null;
  if (stats.completed_modules > 0 && stats.not_started_modules > 0) {
    // Get date of first completion
    const firstCompletion = db.prepare(`
      SELECT MIN(completion_date) as first_completion
      FROM employee_training
      WHERE employee_id = ? AND status = 'Completed'
    `).get(employeeId);

    if (firstCompletion && firstCompletion.first_completion) {
      const firstDate = new Date(firstCompletion.first_completion);
      const now = new Date();
      const daysElapsed = Math.max(1, Math.ceil((now - firstDate) / (1000 * 60 * 60 * 24)));
      const modulesPerDay = stats.completed_modules / daysElapsed;
      const daysRemaining = Math.ceil(stats.not_started_modules / modulesPerDay);

      estimatedCompletionDate = new Date(now.getTime() + (daysRemaining * 24 * 60 * 60 * 1000));
    }
  }

  return {
    total: stats.total_modules || 0,
    completed: stats.completed_modules || 0,
    inProgress: stats.in_progress_modules || 0,
    notStarted: stats.not_started_modules || 0,
    percentage,
    totalHours: stats.total_hours || 0,
    completedHours: stats.completed_hours || 0,
    estimatedCompletionDate: estimatedCompletionDate ? estimatedCompletionDate.toISOString() : null
  };
};

// Complete a training module
const completeModule = (employeeId, moduleId) => {
  // Check if module exists for this employee
  const existingModule = db.prepare(`
    SELECT id, status FROM employee_training
    WHERE employee_id = ? AND module_id = ?
  `).get(employeeId, moduleId);

  if (!existingModule) {
    throw new Error('Training module not assigned to this employee');
  }

  // If already completed, return success (idempotent)
  if (existingModule.status === 'Completed') {
    return {
      message: 'Module already completed',
      alreadyCompleted: true
    };
  }

  // Update module status to completed
  db.prepare(`
    UPDATE employee_training
    SET status = 'Completed',
        completion_date = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE employee_id = ? AND module_id = ?
  `).run(employeeId, moduleId);

  return {
    message: 'Module marked as completed',
    alreadyCompleted: false
  };
};

module.exports = {
  getEmployeeTraining,
  getTrainingProgress,
  completeModule
};

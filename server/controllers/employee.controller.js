const employeeService = require('../services/employee.service');

// Get current employee profile
const getMe = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;

    const profile = employeeService.getEmployeeProfile(employeeId);

    if (!profile) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Employee profile not found'
      });
    }

    res.json({ employee: profile });
  } catch (error) {
    next(error);
  }
};

// Get employee dashboard
const getDashboard = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;

    const dashboard = employeeService.getEmployeeDashboard(employeeId);

    if (!dashboard) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Employee not found'
      });
    }

    res.json(dashboard);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  getDashboard
};

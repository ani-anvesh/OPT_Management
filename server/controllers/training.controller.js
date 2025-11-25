const trainingService = require('../services/training.service');

// Get employee's training modules
const getModules = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;

    const modules = trainingService.getEmployeeTraining(employeeId);
    const progress = trainingService.getTrainingProgress(employeeId);

    res.json({
      modules,
      progress
    });
  } catch (error) {
    next(error);
  }
};

// Mark module as complete
const completeModule = (req, res, next) => {
  try {
    const employeeId = req.session.user.id;
    const moduleId = parseInt(req.params.id);

    if (!moduleId || isNaN(moduleId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid module ID'
      });
    }

    const result = trainingService.completeModule(employeeId, moduleId);

    // Get updated progress
    const progress = trainingService.getTrainingProgress(employeeId);

    res.json({
      ...result,
      progress
    });
  } catch (error) {
    if (error.message === 'Training module not assigned to this employee') {
      return res.status(404).json({
        error: 'Not Found',
        message: error.message
      });
    }
    next(error);
  }
};

module.exports = {
  getModules,
  completeModule
};

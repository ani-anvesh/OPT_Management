const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/training.controller');
const { requireEmployeeAuth } = require('../middleware/auth');

// GET /api/training/modules - Get employee's training modules
router.get('/modules', requireEmployeeAuth, trainingController.getModules);

// POST /api/training/modules/:id/complete - Mark module as complete
router.post('/modules/:id/complete', requireEmployeeAuth, trainingController.completeModule);

module.exports = router;

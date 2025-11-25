const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { uploadWorkEligibility } = require('../middleware/fileUpload');

// POST /api/auth/register - Register new employee
router.post('/register', (req, res, next) => {
  uploadWorkEligibility(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: 'File Upload Error',
        message: err.message
      });
    }
    authController.register(req, res, next);
  });
});

// POST /api/auth/login - Login
router.post('/login', authController.login);

// POST /api/auth/logout - Logout
router.post('/logout', authController.logout);

// GET /api/auth/me - Get current user
router.get('/me', authController.me);

module.exports = router;
